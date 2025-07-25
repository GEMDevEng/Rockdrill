from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

# Create FastAPI application
app = FastAPI(
    title="Rockdrill API",
    version="1.0.0",
    description="AI-Powered SDR Automation API",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://rockdrill-rnzl5r01q-gem-devs-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Rockdrill API",
        "version": "1.0.0",
        "environment": "development",
        "database": "not connected (test mode)",
        "timestamp": time.time()
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Rockdrill API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

# Test API endpoint
@app.get("/api/v1/test")
async def test_endpoint():
    """Test endpoint"""
    return {
        "message": "API is working!",
        "timestamp": time.time(),
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "test": "/api/v1/test"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main_simple:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
