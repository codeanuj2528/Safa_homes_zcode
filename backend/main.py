from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from diffusers import StableDiffusionPipeline
import io
from PIL import Image
import base64
from typing import List, Optional
import json
import os
from datetime import datetime

app = FastAPI(
    title="SafaHomes AI Image Generator API",
    description="Generate interior/exterior design images using AI",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to store the pipeline
pipe = None
HISTORY_FILE = "generation_history.json"

class PromptRequest(BaseModel):
    prompt: str
    user_id: Optional[str] = "anonymous"

class HistoryItem(BaseModel):
    id: str
    prompt: str
    timestamp: str
    user_id: str

def load_model():
    """Load Stable Diffusion model"""
    global pipe
    if pipe is None:
        print("Loading Stable Diffusion model...")
        model_id = "runwayml/stable-diffusion-v1-5"
        pipe = StableDiffusionPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            safety_checker=None,
            requires_safety_checker=False
        )
        if torch.cuda.is_available():
            pipe = pipe.to("cuda")
            pipe.enable_attention_slicing()
        print("Model loaded successfully!")
    return pipe

def save_to_history(prompt: str, user_id: str = "anonymous"):
    """Save generation to history file"""
    try:
        history = []
        if os.path.exists(HISTORY_FILE):
            with open(HISTORY_FILE, 'r') as f:
                history = json.load(f)
        
        history_item = {
            "id": str(len(history) + 1),
            "prompt": prompt,
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id
        }
        
        history.append(history_item)
        
        # Keep only last 50 entries
        if len(history) > 50:
            history = history[-50:]
        
        with open(HISTORY_FILE, 'w') as f:
            json.dump(history, f, indent=2)
            
    except Exception as e:
        print(f"Error saving history: {e}")

def load_history(user_id: Optional[str] = None) -> List[dict]:
    """Load generation history"""
    try:
        if not os.path.exists(HISTORY_FILE):
            return []
        
        with open(HISTORY_FILE, 'r') as f:
            history = json.load(f)
        
        if user_id:
            history = [item for item in history if item.get('user_id') == user_id]
        
        return history[-20:]  # Return last 20 entries
    except Exception as e:
        print(f"Error loading history: {e}")
        return []

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model()

@app.get("/")
async def root():
    return {
        "message": "SafaHomes AI Image Generator API",
        "status": "running",
        "endpoints": {
            "generate": "POST /generate",
            "health": "GET /health",
            "history": "GET /history"
        }
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "gpu_available": torch.cuda.is_available(),
        "model_loaded": pipe is not None
    }

@app.post("/generate")
async def generate_image(request: PromptRequest):
    """Generate an image based on the user's prompt"""
    try:
        if not request.prompt or len(request.prompt.strip()) == 0:
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")

        pipe = load_model()

        # Enhance the prompt for better interior/exterior design results
        enhanced_prompt = f"{request.prompt}, high quality, detailed, professional interior/exterior design, 4k, realistic, architecture"
        negative_prompt = "blurry, low quality, distorted, ugly, bad anatomy, text, watermark"

        print(f"Generating image for prompt: {enhanced_prompt}")

        with torch.no_grad():
            image = pipe(
                prompt=enhanced_prompt,
                negative_prompt=negative_prompt,
                num_inference_steps=30,
                guidance_scale=7.5,
                height=512,
                width=512
            ).images[0]

        # Convert image to base64
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')

        # Save to history
        save_to_history(request.prompt, request.user_id)

        return {
            "success": True,
            "image": f"data:image/png;base64,{img_base64}",
            "prompt": request.prompt,
            "enhanced_prompt": enhanced_prompt,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        print(f"Error generating image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e)}")

@app.get("/history")
async def get_history(user_id: Optional[str] = None):
    """Get generation history"""
    try:
        history = load_history(user_id)
        return {
            "success": True,
            "history": history,
            "count": len(history)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading history: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)