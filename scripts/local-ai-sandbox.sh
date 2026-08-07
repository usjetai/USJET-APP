#!/bin/bash

# USJET Local AI Sandbox Setup Script
# Use this to bridge your local Mac AIs (Ollama / LM Studio) to Cursor

echo "--------------------------------------------------"
echo "USJET Fleet Command — Local AI Sandbox Bridge"
echo "--------------------------------------------------"

# 1. Check for Ollama
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "[✓] Ollama detected on localhost:11434"
else
    echo "[ ] Ollama not detected. Start Ollama if you want to use it."
fi

# 2. Check for LM Studio
if curl -s http://localhost:1234/v1/models > /dev/null; then
    echo "[✓] LM Studio detected on localhost:1234"
else
    echo "[ ] LM Studio not detected. Start LM Studio Local Server (port 1234) if you want to use it."
fi

echo ""
echo "To hook these up in Cursor (Free, no tokens):"
echo "1. Install ngrok: brew install ngrok"
echo "2. Run a tunnel for your preferred model:"
echo "   - For Ollama:    ngrok http 11434"
echo "   - For LM Studio:  ngrok http 1234"
echo ""
echo "3. Copy the 'Forwarding' URL (https://...) from ngrok."
echo ""
echo "4. In Cursor Settings > Models > OpenAI:"
echo "   - Toggle 'Override OpenAI Base URL' ON"
echo "   - Paste: <YOUR_NGROK_URL>/v1"
echo "   - API Key: ollama (or any text)"
echo "   - Add Model: llama3 (or your local model ID)"
echo ""
echo "5. Your local AIs are now integrated into the USJET Hangar bays (Slots 30 & 31)."
echo "--------------------------------------------------"
