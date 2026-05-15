import { useCallback, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import { getFuelMetrics } from "../../lib/foundersFuelMetrics";

function drawShareCard(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const metrics = getFuelMetrics();
  const w = canvas.width;
  const h = canvas.height;

  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "#020617");
  gradient.addColorStop(0.45, "#0a192f");
  gradient.addColorStop(1, "#042f2e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(34, 211, 238, 0.35)";
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, w - 48, h - 48);

  ctx.fillStyle = "rgba(251, 191, 36, 0.95)";
  ctx.font = "bold 28px system-ui, sans-serif";
  ctx.fillText("USJET.AI · FLEET STATUS", 56, 88);

  ctx.fillStyle = "rgba(248, 250, 252, 0.95)";
  ctx.font = "bold 52px system-ui, sans-serif";
  ctx.fillText("30 AI UNITS ONLINE", 56, 160);

  ctx.fillStyle = "rgba(103, 232, 249, 0.92)";
  ctx.font = "600 32px system-ui, sans-serif";
  ctx.fillText(`${metrics.supporters} / ${metrics.goal} Founder's Fuel`, 56, 220);

  ctx.fillStyle = "rgba(203, 213, 225, 0.85)";
  ctx.font = "500 24px system-ui, sans-serif";
  ctx.fillText("Sovereign hangar · wrenches, not slides", 56, 270);

  ctx.fillStyle = "rgba(74, 222, 128, 0.9)";
  ctx.font = "bold 22px ui-monospace, monospace";
  ctx.fillText("www.usjet.ai/founders-fuel", 56, h - 64);
}

export default function FleetStatusShare() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "shared">("idle");

  const generateCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return null;
    }
    drawShareCard(canvas);
    return canvas.toDataURL("image/png");
  }, []);

  const handleShare = async () => {
    const dataUrl = generateCard();
    if (!dataUrl) {
      return;
    }

    const metrics = getFuelMetrics();
    const shareText = `I fueled the USJET fleet — ${metrics.supporters}/${metrics.goal} toward today's dev sprint. 30 AIs. One hangar. wrenches, not slides.`;
    const shareUrl = "https://www.usjet.ai/founders-fuel";

    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "usjet-fleet-status.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "USJET Fleet Status",
          text: shareText,
          url: shareUrl,
          files: [file],
        });
        setStatus("shared");
        return;
      }
    } catch {
      /* fall through */
    }

    const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitter, "_blank", "noopener,noreferrer,width=600,height=520");
    setStatus("shared");
  };

  const handleDownload = () => {
    const dataUrl = generateCard();
    if (!dataUrl) {
      return;
    }
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = "usjet-fleet-status.png";
    anchor.click();
    setStatus("ready");
  };

  return (
    <div className="fleet-status-share">
      <canvas ref={canvasRef} className="fleet-status-share__canvas" width={1200} height={630} aria-hidden />
      <div className="fleet-status-share__actions">
        <button type="button" className="fleet-status-share__btn btn-glass glass-effect-interactive" onClick={handleShare}>
          <Share2 size={14} aria-hidden />
          Generate & share fleet status
        </button>
        <button type="button" className="fleet-status-share__btn btn-glass glass-effect-interactive" onClick={handleDownload}>
          Download card
        </button>
      </div>
      {status === "shared" ? (
        <p className="fleet-status-share__note" role="status">
          Share window opened — post your fleet status to X or LinkedIn.
        </p>
      ) : null}
    </div>
  );
}
