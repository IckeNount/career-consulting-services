#!/bin/bash

# 🎯 Quick PostgreSQL Setup (No Docker)
# Choose one option below

echo "Choose your PostgreSQL installation method:"
echo ""
echo "1. Postgres.app (Easiest - GUI)"
echo "   - Download: https://postgresapp.com/"
echo "   - Just drag, drop, and click Initialize"
echo ""
echo "2. Homebrew (Most Lightweight)"
echo "   - Run: brew install postgresql@15"
echo "   - Run: brew services start postgresql@15"
echo ""
echo "3. Colima (Docker Alternative)"
echo "   - Run: brew install colima docker"
echo "   - Run: colima start"
echo ""
read -p "Enter your choice (1, 2, or 3): " choice

case $choice in
  1)
    echo ""
    echo "📦 Setting up with Postgres.app:"
    echo ""
    echo "1. Download from: https://postgresapp.com/"
    echo "2. Drag to Applications"
    echo "3. Open and click 'Initialize'"
    echo "4. Then run these commands:"
    echo ""
    echo "   psql -U postgres -c 'CREATE DATABASE career_db;'"
    echo "   npm run db:migrate"
    echo "   npm run db:seed"
    echo ""
    ;;
  2)
    echo ""
    echo "🍺 Setting up with Homebrew:"
    echo ""
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
      echo "❌ Homebrew not found. Installing..."
      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    echo "📦 Installing PostgreSQL..."
    brew install postgresql@15
    
    echo "🚀 Starting PostgreSQL..."
    brew services start postgresql@15
    
    echo "👤 Creating database..."
    sleep 3
    createdb career_db
    
    echo "✅ PostgreSQL is ready!"
    echo ""
    echo "Now run:"
    echo "   npm run db:migrate"
    echo "   npm run db:seed"
    ;;
  3)
    echo ""
    echo "🐳 Setting up with Colima:"
    echo ""
    
    if ! command -v brew &> /dev/null; then
      echo "❌ Homebrew not found. Installing..."
      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    echo "📦 Installing Colima and Docker..."
    brew install colima docker docker-compose
    
    echo "🚀 Starting Colima VM..."
    colima start --cpu 2 --memory 4
    
    echo "🐘 Starting PostgreSQL with Docker..."
    docker compose up -d
    
    echo "✅ PostgreSQL is ready!"
    echo ""
    echo "Now run:"
    echo "   npm run db:migrate"
    echo "   npm run db:seed"
    ;;
  *)
    echo "Invalid choice. Please run the script again."
    exit 1
    ;;
esac

echo ""
echo "🎉 Setup complete!"
