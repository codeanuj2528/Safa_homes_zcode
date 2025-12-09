
🏠 SafaHomes AI - AI Image Generation System
<div align="center"> <img src="generated_images/all_frames.png" alt="AI Generated Design Examples" width="800"> <br> <em>🚀 AI-Powered Design Generation using Stable Diffusion</em> </div>
🤖 Core AI Technology: Stable Diffusion
🖼️ Image Generation Pipeline
text
Text Prompt → Stable Diffusion → Image Processing → Final Design
      ↓              ↓                ↓              ↓
User Input → AI Model Inference → Quality Enhancement → PNG Output
⚙️ Model Configuration
python
# Backend/main.py - Core AI Configuration
MODEL_CONFIG = {
    "model_id": "runwayml/stable-diffusion-v1-5",
    "dtype": torch.float16 if torch.cuda.is_available() else torch.float32,
    "resolution": (512, 512),
    "inference_steps": 30,
    "guidance_scale": 7.5,
    "safety_checker": None,  # Disabled for interior design
    "requires_safety_checker": False
}
🚀 AI Generation Endpoints (FastAPI)
1. Generate Design Image
python
# POST /generate - Main AI Endpoint
@app.post("/generate")
async def generate_image(request: PromptRequest):
    """
    Core AI image generation endpoint
    
    Flow:
    1. Receive text prompt from user
    2. Enhance prompt for better design results
    3. Load Stable Diffusion model
    4. Generate high-quality image
    5. Return base64 encoded image
    """
    
    # Prompt enhancement for interior/exterior designs
    enhanced_prompt = f"{request.prompt}, high quality, detailed, 
                       professional interior/exterior design, 
                       4k, realistic, architecture"
    
    # AI Model inference
    image = pipe(
        prompt=enhanced_prompt,
        negative_prompt="blurry, low quality, distorted, ugly",
        num_inference_steps=30,
        guidance_scale=7.5,
        height=512,
        width=512
    ).images[0]
    
    return {
        "success": True,
        "image": base64_image,
        "prompt": request.prompt
    }
2. Model Management
python
# Model loading and GPU optimization
def load_model():
    """Initialize Stable Diffusion model with GPU acceleration"""
    global pipe
    
    if pipe is None:
        # Load pretrained model
        pipe = StableDiffusionPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            torch_dtype=torch.float16,
            safety_checker=None,
            requires_safety_checker=False
        )
        
        # GPU acceleration
        if torch.cuda.is_available():
            pipe = pipe.to("cuda")
            pipe.enable_attention_slicing()  # Memory optimization
            pipe.enable_vae_slicing()
    
    return pipe
🎨 Prompt Engineering for Design Generation
🔧 Smart Prompt Enhancement
python
def enhance_design_prompt(user_prompt):
    """
    Automatically enhances user prompts for better design results
    
    Examples:
    Input: "modern living room"
    Output: "modern living room, high quality, detailed, 
             professional interior design, 4k, realistic, 
             architecture, lighting, furniture"
    """
    
    design_keywords = {
        "living room": ["sofa", "coffee table", "tv", "carpet", "lighting"],
        "kitchen": ["countertop", "cabinets", "island", "appliances", "backsplash"],
        "bedroom": ["bed", "wardrobe", "nightstand", "lighting", "textiles"],
        "bathroom": ["bathtub", "shower", "vanity", "tiles", "mirror"],
        "exterior": ["garden", "landscaping", "windows", "door", "roof"]
    }
    
    # Add style-specific enhancements
    style_enhancements = {
        "modern": "clean lines, minimalist, contemporary",
        "traditional": "classic, ornate, detailed",
        "scandinavian": "light wood, natural light, minimalist",
        "industrial": "exposed brick, metal, concrete"
    }
    
    return enhanced_prompt
📊 Performance Optimization
⚡ GPU Acceleration
python
# Optimize for GPU performance
if torch.cuda.is_available():
    # Enable memory optimization
    pipe.enable_attention_slicing()
    pipe.enable_vae_slicing()
    
    # Set CUDA device
    torch.cuda.set_device(0)
    
    # Clear cache for optimal performance
    torch.cuda.empty_cache()
⏱️ Generation Speed
python
# Generation time optimization
GENERATION_CONFIG = {
    "fast": {"steps": 20, "quality": "good"},
    "balanced": {"steps": 30, "quality": "excellent"},  # Default
    "high_quality": {"steps": 50, "quality": "premium"}
}
🛠️ Backend Architecture
FastAPI Server Structure
python
# FastAPI Application with AI Integration
app = FastAPI(
    title="SafaHomes AI Image Generator",
    description="Stable Diffusion API for interior/exterior design generation",
    version="1.0.0"
)

# CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Model lifecycle
@app.on_event("startup")
async def startup_event():
    """Load AI model on server startup"""
    load_model()
    print("✅ Stable Diffusion model loaded and ready!")
API Response Format
json
{
  "success": true,
  "image": "data:image/png;base64,...",
  "prompt": "Modern living room with white walls",
  "enhanced_prompt": "Modern living room with white walls...",
  "generation_time": 45.2,
  "model": "stable-diffusion-v1-5",
  "resolution": "512x512"
}
🔧 Installation & Setup
1. AI Backend Dependencies
txt
# requirements.txt - AI/ML Stack
torch>=2.0.0
torchvision>=0.15.0
diffusers>=0.20.0
transformers>=4.30.0
accelerate>=0.20.0
safetensors>=0.3.0
pillow>=10.0.0
fastapi>=0.100.0
2. Run AI Server
bash
# Start FastAPI with AI model
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Expected output:
# INFO:     Started server process
# INFO:     Waiting for application startup.
# ✅ Stable Diffusion model loaded and ready!
# INFO:     Application startup complete.
🎯 Generation Examples
Example 1: Modern Living Room
json
{
  "input": "modern living room white walls",
  "ai_enhanced": "modern living room with white walls, 
                  wooden floors, large windows, 
                  minimalist furniture, natural lighting",
  "generation_time": "38 seconds",
  "resolution": "512x512"
}
Example 2: Kitchen Design
json
{
  "input": "luxury kitchen marble",
  "ai_enhanced": "luxury kitchen with marble countertops, 
                  island, pendant lighting, modern appliances, 
                  glass cabinets, professional photography",
  "generation_time": "42 seconds"
}
📈 Technical Specifications
AI Model Details
Specification	Value
Base Model	Stable Diffusion v1.5
Resolution	512×512 pixels
Inference Steps	30 (optimized)
Guidance Scale	7.5
Format	PNG
Quality	Professional grade
Performance Metrics
Metric	Value	Notes
GPU Generation	30-45s	NVIDIA GPU recommended
CPU Generation	2-3min	Fallback option
Model Load Time	2-3min	First load only
Memory Usage	4-6GB	During generation
Concurrent Users	3-5	Based on GPU memory
🔒 Security & Optimization
Memory Management
python
# Optimize VRAM usage
def optimize_memory():
    """Clear GPU memory after generation"""
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
        torch.cuda.ipc_collect()
Error Handling
python
try:
    # AI Generation
    image = pipe(prompt=prompt).images[0]
except torch.cuda.OutOfMemoryError:
    # Clear cache and retry
    torch.cuda.empty_cache()
    image = pipe(prompt=prompt).images[0]
except Exception as e:
    return {"error": f"Generation failed: {str(e)}"}
🚀 Quick Test
bash
# Test AI Generation API
curl -X POST "http://localhost:8000/generate" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "modern living room design"}'
📞 Support & Issues
Common AI Generation Issues
Slow Generation: Enable GPU acceleration

Out of Memory: Reduce image resolution

Poor Quality: Increase inference steps

Model Not Loading: Check Hugging Face token

Performance Tips
Use GPU for faster generation

Enable attention slicing for memory optimization

Pre-load model on server startup

Cache generated images
