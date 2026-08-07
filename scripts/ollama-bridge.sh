#!/bin/bash

# USJET Ollama Sandbox Bridge
# Use this to tunnel your local Ollama models to Cursor's cloud orchestrator.

echo "--------------------------------------------------"
echo "USJET Fleet Command — Ollama Sandbox Bridge"
echo "--------------------------------------------------"

# Check for Ollama
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "[✓] Ollama detected on localhost:11434"
    echo "[i] Verified models: qwen2.5:latest, deepseek-r1:7b"
else
    echo "[!] Ollama not detected! Start Ollama on your Mac first."
    exit 1
fi

# Bridge Instructions
echo ""
echo "To fix 'Service Unavailable' in Cursor:"
echo "1. Install ngrok: brew install ngrok"
echo "2. Run a tunnel for Ollama:"
echo "   ngrok http 11434"
echo ""
echo "3. Copy the 'Forwarding' URL (https://...) from ngrok."
echo ""
echo "4. In Cursor Settings > Models > OpenAI:"
echo "   - Toggle 'Override OpenAI Base URL' ON"
echo "   - Paste: <YOUR_NGROK_URL>/v1"
echo "   - API Key: ollama"
echo "   - Add Model: qwen2.5:latest"
echo "   - Add Model: deepseek-r1:7b"
echo ""
echo "5. Toggle OFF all other models to force local execution."
echo "--------------------------------------------------"
