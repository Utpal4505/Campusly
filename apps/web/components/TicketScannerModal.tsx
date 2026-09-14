"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";
import {
  X,
  Camera,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  Ticket as TicketIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TicketCheckinResult } from "@repo/schemas";

interface TicketScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  eventTitle?: string;
}

interface ScanHistoryItem {
  ticketNumber: string;
  attendeeName: string;
  timestamp: string;
  status: "new" | "duplicate" | "error";
  message: string;
}

export default function TicketScannerModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
}: TicketScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isProcessing, setIsProcessing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Manual code input
  const [manualCode, setManualCode] = useState("");

  // Result display
  const [lastResult, setLastResult] = useState<{
    type: "success" | "warning" | "error";
    data?: TicketCheckinResult;
    error?: string;
  } | null>(null);

  // Session history
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  // Web Audio Chime synthesizers
  const playSound = useCallback((type: "success" | "warning" | "error") => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "success") {
        // High harmonic major triad (C6 - E6 - G6)
        const notes = [1046.5, 1318.51, 1567.98];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
        });
      } else {
        // Low dissonant buzz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(type === "warning" ? 330 : 220, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }, [soundEnabled]);

  // Checkin API call
  const handleVerifyTicket = useCallback(
    async (code: string) => {
      const trimmed = code.trim();
      if (!trimmed || isProcessing) return;

      setIsProcessing(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/tickets/checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketNumberOrId: trimmed, eventId }),
        });

        const data = await res.json();

        if (!res.ok) {
          const errorMsg = data.message || "Ticket verification failed";
          setLastResult({ type: "error", error: errorMsg });
          playSound("error");
          setHistory((prev) => [
            {
              ticketNumber: trimmed,
              attendeeName: "Unknown",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              status: "error",
              message: errorMsg,
            },
            ...prev.slice(0, 9),
          ]);
          return;
        }

        if (data.alreadyCheckedIn) {
          setLastResult({ type: "warning", data });
          playSound("warning");
          setHistory((prev) => [
            {
              ticketNumber: data.ticketNumber,
              attendeeName: data.attendeeName,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              status: "duplicate",
              message: "Already checked in",
            },
            ...prev.slice(0, 9),
          ]);
        } else {
          setLastResult({ type: "success", data });
          playSound("success");
          setHistory((prev) => [
            {
              ticketNumber: data.ticketNumber,
              attendeeName: data.attendeeName,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              status: "new",
              message: "Checked in successfully",
            },
            ...prev.slice(0, 9),
          ]);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Network error";
        setLastResult({ type: "error", error: message });
        playSound("error");
      } finally {
        setIsProcessing(false);
      }
    },
    [eventId, isProcessing, playSound]
  );

  // Stop camera media stream
  const stopCamera = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Frame processing loop using jsQR
  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code && code.data && !isProcessing) {
        // Pause briefly before processing to avoid multi-triggering
        handleVerifyTicket(code.data);
      }
    }

    animationFrameId.current = requestAnimationFrame(scanFrame);
  }, [cameraActive, handleVerifyTicket, isProcessing]);

  // Start Camera
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported on this device/browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to access camera.";
      setCameraError(msg);
      setCameraActive(false);
    }
  }, [facingMode, stopCamera]);

  // Start scanning when active
  useEffect(() => {
    if (cameraActive) {
      animationFrameId.current = requestAnimationFrame(scanFrame);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [cameraActive, scanFrame]);

  // Toggle camera on modal open/close
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setLastResult(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleVerifyTicket(manualCode.trim());
      setManualCode("");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden Canvas for QR frame extraction */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/70 bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <span>Gate Entry Ticket Scanner</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold uppercase">
                  Live
                </span>
              </h3>
              {eventTitle && (
                <p className="text-xs text-muted-foreground truncate max-w-[280px]">
                  {eventTitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="h-8 w-8 rounded-lg cursor-pointer"
              title={soundEnabled ? "Mute audio chimes" : "Enable audio chimes"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-primary" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Camera Viewfinder Box */}
        <div className="p-5">
          <div className="relative aspect-video sm:aspect-4/3 w-full bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            {/* Video stream */}
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${cameraActive ? "opacity-100" : "opacity-0"}`}
              muted
              playsInline
            />

            {/* Viewfinder Target & Laser Overlay */}
            {cameraActive && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                {/* Target bounding box */}
                <div className="relative w-52 h-52 sm:w-64 sm:h-64 border-2 border-emerald-400/60 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-md" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-md" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-md" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-emerald-400 rounded-br-md" />

                  {/* Pulsing scanning beam */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse" />
                </div>
                <span className="mt-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-medium text-white/90">
                  Align student ticket QR inside frame
                </span>
              </div>
            )}

            {/* Camera error or loading state */}
            {!cameraActive && (
              <div className="p-6 text-center text-white/80 flex flex-col items-center">
                {cameraError ? (
                  <>
                    <AlertCircle className="w-8 h-8 text-destructive mb-2" />
                    <p className="text-xs font-semibold text-white mb-1">Camera Inaccessible</p>
                    <p className="text-[11px] text-white/70 max-w-xs mb-3">{cameraError}</p>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={startCamera}
                      className="text-xs rounded-xl h-8 gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Camera</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                    <p className="text-xs font-medium">Starting camera stream...</p>
                  </>
                )}
              </div>
            )}

            {/* Camera flip button */}
            {cameraActive && (
              <button
                type="button"
                onClick={toggleFacingMode}
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                title="Switch Camera (Front/Rear)"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Processing Spinner Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center flex-col text-white gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <span className="text-xs font-bold">Verifying gate pass...</span>
              </div>
            )}
          </div>

          {/* Validation Result Flash Card */}
          {lastResult && (
            <div
              className={`mt-4 p-4 rounded-2xl border transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
                lastResult.type === "success"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
                  : lastResult.type === "warning"
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-950 dark:text-amber-100"
                  : "border-destructive/50 bg-destructive/10 text-destructive dark:text-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {lastResult.type === "success" ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                ) : lastResult.type === "warning" ? (
                  <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm">
                      {lastResult.type === "success"
                        ? "Gate Pass Confirmed!"
                        : lastResult.type === "warning"
                        ? "Already Used Pass!"
                        : "Invalid Ticket"}
                    </h4>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-background/80">
                      {lastResult.data?.ticketNumber || "CODE ERR"}
                    </span>
                  </div>

                  {lastResult.data ? (
                    <div className="mt-1.5 space-y-0.5 text-xs">
                      <p className="font-semibold text-foreground">
                        Attendee: {lastResult.data.attendeeName}
                      </p>
                      <p className="text-muted-foreground text-[11px] truncate">
                        Event: {lastResult.data.eventTitle}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Checked in at:{" "}
                        {new Date(lastResult.data.checkedInAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs mt-1 text-muted-foreground">
                      {lastResult.error || "Could not verify this ticket code."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Manual Entry Fallback */}
          <form onSubmit={handleManualSubmit} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <TicketIcon className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Manual serial (e.g. CPLY-7F3K92)"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="w-full pl-9 pr-3 h-9 text-xs rounded-xl font-mono uppercase border border-border/80 bg-background text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary shadow-2xs"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={!manualCode.trim() || isProcessing}
              className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify</span>
            </Button>
          </form>

          {/* Session Scan Log */}
          {history.length > 0 && (
            <div className="mt-5 border-t border-border/70 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground">
                  Session Log ({history.length})
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {history.filter((h) => h.status === "new").length} checked in
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-muted/40 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          item.status === "new"
                            ? "bg-emerald-500"
                            : item.status === "duplicate"
                            ? "bg-amber-500"
                            : "bg-destructive"
                        }`}
                      />
                      <span className="font-semibold text-foreground truncate max-w-[140px]">
                        {item.attendeeName}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {item.ticketNumber}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
