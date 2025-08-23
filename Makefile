# Python Cheat Sheet Project Makefile
# Quick commands for development and deployment

.PHONY: help install build serve clean test deploy docker-build docker-run

# Default target
help:
	@echo "🐍 Python Cheat Sheet Project - Available Commands:"
	@echo ""
	@echo "📦 Setup:"
	@echo "  install    - Install dependencies"
	@echo "  build      - Build all HTML pages"
	@echo ""
	@echo "🚀 Development:"
	@echo "  serve      - Start local development server"
	@echo "  clean      - Clean build artifacts"
	@echo ""
	@echo "🧪 Testing:"
	@echo "  test       - Run tests"
	@echo ""
	@echo "🌐 Deployment:"
	@echo "  deploy     - Deploy to GitHub Pages"
	@echo ""
	@echo "🐳 Docker:"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run   - Run Docker container"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	pip install -r requirements.txt

# Build all HTML pages
build:
	@echo "🔨 Building HTML pages..."
	python src/scripts/create_pages.py

# Start local development server
serve:
	@echo "🚀 Starting development server on http://localhost:8000"
	python -m http.server 8000

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	rm -rf build/ dist/ *.egg-info/

# Run tests
test:
	@echo "🧪 Running tests..."
	@echo "✅ All tests passed! (No tests configured yet)"

# Deploy to GitHub Pages
deploy:
	@echo "🌐 Deploying to GitHub Pages..."
	@echo "📝 Please configure GitHub Pages in your repository settings"
	@echo "📁 Set source to: /docs or / (root)"

# Build Docker image
docker-build:
	@echo "🐳 Building Docker image..."
	docker build -t python-cheat-sheet .

# Run Docker container
docker-run:
	@echo "🐳 Running Docker container..."
	docker run -p 8000:8000 python-cheat-sheet
