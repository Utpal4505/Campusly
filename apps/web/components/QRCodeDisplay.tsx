"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Loader2 } from "lucide-react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
  bordered?: boolean;
}

export default function QRCodeDisplay({
  value,
  size = 200,
  className = "",
  darkColor = "#0f172a",
  lightColor = "#ffffff",
  bordered = true,
}: QRCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size * 2, // High DPI
      margin: 1.5,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (isMounted) {
          setDataUrl(url);
          setError(null);
        }
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
        if (isMounted) setError("Failed to render QR");
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, darkColor, lightColor]);

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-xl bg-destructive/10 text-destructive text-xs text-center p-2 ${className}`}
      >
        <span>{error}</span>
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-xl bg-muted/40 animate-pulse ${className}`}
      >
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/60" />
      </div>
    );
  }

  return (
    <div
      className={`inline-block ${
        bordered ? "rounded-2xl border border-border/80 bg-white p-2.5 shadow-sm" : ""
      } ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt="Scan QR Code"
        width={size}
        height={size}
        className="block rounded-lg select-none"
      />
    </div>
  );
}
