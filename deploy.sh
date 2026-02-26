#!/bin/bash
set -e

echo "🚀 Starting deployment..."

command -v node >/dev/null 2>&1 || { echo "❌ Node not installed"; exit 1; }

echo "✅ Node version:"
node -v

echo "📦 Installing dependencies..."
npm install

if ! npx tsc --version &> /dev/null
then
  echo "📥 Installing TypeScript..."
  npm install -g typescript
fi

echo "🛠️ Building TypeScript..."
npx tsc

PORT=8080
PID=$(lsof -ti tcp:$PORT || true)
if [ -n "$PID" ]; then
  echo "🧹 Killing process on port $PORT"
  kill -9 $PID
fi

echo "▶️ Starting service..."
nohup node dist/index.js > app.log 2>&1 &

sleep 2
echo "📄 Logs:"
tail -n 10 app.log

echo "✅ Deployment successful!"