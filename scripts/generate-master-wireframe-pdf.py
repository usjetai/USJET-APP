#!/usr/bin/env python3
"""Generate USJET sovereign wireframe mind-map PDF (visual only)."""

from __future__ import annotations

import math
import os
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, letter
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "master-tech"
OUT_PDF = OUT_DIR / "USJET_MASTER_WIREFRAME_MINDMAP.pdf"

W, H = landscape(letter)
CX, CY = W / 2, H / 2

FLEET = [
    "01 Gemini", "02 ChatGPT", "03 Claude", "04 Perplexity", "05 Grok",
    "06 Cursor", "07 Midjourney", "08 Luma", "09 Sora", "10 Higgsfield",
    "11 Leonardo", "12 Runway", "13 Firefly", "14 Canva", "15 Flux",
    "16 Suno", "17 ElevenLabs", "18 Play.ht", "19 Synthesia", "20 HeyGen",
    "21 v0", "22 Replit", "23 Copilot", "24 Consensus", "25 Gamma",
    "26 Notion", "27 Jasper", "28 Otter", "29 DeepSeek", "30 Origin",
]

PAGES = [
    ("FLEET", "/", (0, 210), "#22d3ee"),
    ("HANGAR", "/hangar", (55, 175), "#f59e0b"),
    ("INTEL", "/intel", (110, 120), "#a78bfa"),
    ("FOUNDER", "/founder", (155, 55), "#f472b6"),
    ("ORIGIN", "/origin", (180, -20), "#ec4899"),
    ("MEMBER", "/member", (155, -95), "#34d399"),
    ("SPECIAL", "/special", (90, -150), "#fbbf24"),
    ("1995", "/founder-special-1995", (10, -165), "#d97706"),
    ("COCKPIT", "/cockpit", (-70, -120), "#38bdf8"),
]

INFRA = [
    ("WARP", (0, 0)),
    ("STRIPE", (-200, 40)),
    ("OPS@", (-200, -40)),
    ("VERCEL", (200, 40)),
    ("PORKBUN", (200, -40)),
]


def radial(x: float, y: float, r: float, deg: float) -> tuple[float, float]:
    rad = math.radians(deg)
    return x + r * math.cos(rad), y + r * math.sin(rad)


def draw_glow_ring(c: canvas.Canvas, x: float, y: float, r: float, stroke) -> None:
    c.setStrokeColor(stroke)
    c.setLineWidth(0.6)
    c.circle(x, y, r, stroke=1, fill=0)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT_PDF), pagesize=landscape(letter))

    # Deep space background
    c.setFillColor(colors.HexColor("#020617"))
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Hyperspace tunnel rings
    for i, alpha in enumerate([0.08, 0.12, 0.18, 0.25, 0.32]):
        r = 80 + i * 55
        c.setStrokeColor(colors.Color(0.13, 0.83, 0.93, alpha=alpha))
        c.setLineWidth(1.2)
        c.circle(CX, CY, r, stroke=1, fill=0)

    # Fleet orbit connections
    fleet_r = 300
    for i in range(30):
        fx, fy = radial(CX, CY, fleet_r, -90 + i * 12)
        c.setStrokeColor(colors.Color(0.2, 0.7, 0.9, alpha=0.15))
        c.setLineWidth(0.35)
        c.line(CX, CY, fx, fy)
        c.setFillColor(colors.HexColor("#0e7490"))
        c.circle(fx, fy, 5, fill=1, stroke=0)
        c.setFillColor(colors.Color(0.75, 0.95, 1, alpha=0.85))
        c.setFont("Helvetica", 5.5)
        c.drawCentredString(fx, fy - 9, FLEET[i].split()[0])

    # Page nodes + links to core
    for label, _path, (ox, oy), hex_color in PAGES:
        px, py = CX + ox, CY + oy
        c.setStrokeColor(colors.Color(0.2, 0.8, 1, alpha=0.35))
        c.setLineWidth(1)
        c.line(CX, CY, px, py)
        c.setFillColor(colors.HexColor(hex_color))
        c.setStrokeColor(colors.white)
        c.setLineWidth(1.2)
        c.roundRect(px - 42, py - 14, 84, 28, 8, fill=1, stroke=1)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(px, py - 3, label)

    # Core hub
    c.setFillColor(colors.HexColor("#0a192f"))
    c.setStrokeColor(colors.HexColor("#22d3ee"))
    c.setLineWidth(2.5)
    c.circle(CX, CY, 48, fill=1, stroke=1)
    c.setFillColor(colors.HexColor("#22d3ee"))
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(CX, CY + 4, "USJET.AI")
    c.setFont("Helvetica", 7)
    c.setFillColor(colors.white)
    c.drawCentredString(CX, CY - 10, "30-UNIT FLEET")

    # Infra satellites
    for label, (ox, oy) in INFRA:
        ix, iy = CX + ox * 1.6, CY + oy * 1.6
        c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.2))
        c.line(CX, CY, ix, iy)
        c.setFillColor(colors.HexColor("#1e293b"))
        c.circle(ix, iy, 18, fill=1, stroke=0)
        c.setFillColor(colors.HexColor("#94a3b8"))
        c.setFont("Helvetica", 7)
        c.drawCentredString(ix, iy - 3, label)

    # Tier rings legend (icons only — minimal words)
    c.setFont("Helvetica", 6)
    c.setFillColor(colors.HexColor("#64748b"))
    c.drawString(24, 24, "T1 FLEET+HANGAR  |  T2 +INTEL+MEMBER  |  T3 +ORIGIN  |  GUEST: FLEET+HANGAR+FOUNDER")
    c.drawString(24, H - 22, "USJET LLC · EST. 2018 · master-tech · WIREFRAME SOVEREIGN MAP · PRINT = HARD PROOF")

    c.showPage()
    c.save()
    print(f"Wrote {OUT_PDF}")


if __name__ == "__main__":
    main()
