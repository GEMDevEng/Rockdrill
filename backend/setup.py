#!/usr/bin/env python3
"""
Rockdrill Backend Setup Script
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return None

def setup_development_environment():
    """Set up the development environment"""
    print("🚀 Setting up Rockdrill Backend Development Environment")
    print("=" * 60)
    
    # Check if we're in the backend directory
    if not os.path.exists("requirements.txt"):
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Create virtual environment
    if not os.path.exists("venv"):
        run_command("python3 -m venv venv", "Creating virtual environment")
    
    # Activate virtual environment and install dependencies
    if os.name == 'nt':  # Windows
        activate_cmd = "venv\\Scripts\\activate"
    else:  # Unix/Linux/macOS
        activate_cmd = "source venv/bin/activate"
    
    install_cmd = f"{activate_cmd} && pip install --upgrade pip && pip install -r requirements.txt"
    run_command(install_cmd, "Installing Python dependencies")
    
    # Copy environment file
    if not os.path.exists(".env"):
        if os.path.exists(".env.example"):
            run_command("cp .env.example .env", "Creating environment file")
            print("📝 Please edit .env file with your configuration")
        else:
            print("⚠️  .env.example not found, please create .env manually")
    
    # Create necessary directories
    os.makedirs("logs", exist_ok=True)
    os.makedirs("uploads", exist_ok=True)
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Edit .env file with your database and API keys")
    print("2. Start PostgreSQL and Redis services")
    print("3. Run: docker-compose up -d db redis")
    print("4. Run: python -m alembic upgrade head")
    print("5. Run: uvicorn app.main:app --reload")
    print("\nOr use Docker:")
    print("docker-compose up --build")

if __name__ == "__main__":
    setup_development_environment()
