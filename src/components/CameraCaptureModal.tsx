import React, { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, Check, X, AlertCircle, FlipHorizontal, Sparkles } from "lucide-react";

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  mode: "document" | "face";
  title?: string;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  mode,
  title,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    mode === "document" ? "environment" : "user"
  );
  const [isCapturing, setIsCapturing] = useState(false);

  // Initialize camera
  const startCamera = async (facing: "environment" | "user") => {
    stopCamera();
    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Camera access is not supported by your browser in this environment.");
      setHasPermission(false);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setHasPermission(true);
    } catch (err: any) {
      console.warn("Camera start error:", err);
      // If environment camera failed, try user/front camera fallback
      if (facing === "environment") {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          streamRef.current = fallbackStream;
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            await videoRef.current.play();
          }
          setHasPermission(true);
          return;
        } catch (fbErr: any) {
          console.error("Camera fallback failed:", fbErr);
        }
      }

      setHasPermission(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage("Camera permission was denied. Please allow camera access in browser settings.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorMessage("No camera hardware detected on this device.");
      } else {
        setErrorMessage(`Camera error: ${err.message || "Failed to initialize camera stream."}`);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const handleCaptureFrame = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // If user front camera, mirror image for natural selfie appearance
      if (facingMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      setCapturedImage(dataUrl);
    }
    setIsCapturing(false);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (!streamRef.current) {
      startCamera(facingMode);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {title || (mode === "document" ? "Live Document Capture" : "Applicant Face Capture")}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === "document"
                  ? "Align identity document within the target boundary"
                  : "Center applicant's face with neutral expression"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Canvas / Stream Container */}
        <div className="relative bg-black flex-1 min-h-[360px] flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={capturedImage}
                alt="Captured Frame"
                className="max-h-[460px] w-auto object-contain rounded"
              />
              <div className="absolute top-4 left-4 bg-emerald-500/90 text-white text-xs px-3 py-1 rounded-full font-medium shadow flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Frame Captured Ready
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full max-h-[460px] object-cover ${
                  facingMode === "user" ? "-scale-x-100" : ""
                }`}
              />

              {/* Viewfinder Guides */}
              {hasPermission && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                  {mode === "document" ? (
                    /* ID Document Rectangular Target Guide */
                    <div className="relative w-[85%] max-w-[460px] aspect-[1.586/1] border-2 border-sky-400/80 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                      {/* Corner Crosshairs */}
                      <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-4 border-l-4 border-sky-400 rounded-tl" />
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-4 border-r-4 border-sky-400 rounded-tr" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-4 border-l-4 border-sky-400 rounded-bl" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-4 border-r-4 border-sky-400 rounded-br" />
                      {/* Document alignment guidelines */}
                      <div className="absolute bottom-4 left-6 right-6 border-t border-dashed border-sky-300/40 pt-1 text-[10px] text-sky-200 text-center font-mono">
                        ICAO MRZ ZONE / BOTTOM EDGE
                      </div>
                      <div className="absolute top-3 left-3 text-[10px] bg-sky-950/80 text-sky-300 px-2 py-0.5 rounded font-mono">
                        ID / PASSPORT BOUNDARY
                      </div>
                    </div>
                  ) : (
                    /* Face Oval Biometric Guide */
                    <div className="relative w-56 h-72 border-2 border-emerald-400/80 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                      <div className="absolute top-1/3 left-6 right-6 border-t border-dashed border-emerald-300/50 text-[10px] text-emerald-200 text-center pt-0.5">
                        EYE LEVEL
                      </div>
                      <div className="absolute bottom-10 left-12 right-12 border-t border-dashed border-emerald-300/50 text-[10px] text-emerald-200 text-center pt-0.5">
                        CHIN
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Permission / Hardware Error Overlay */}
              {errorMessage && (
                <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-white text-base font-semibold mb-1">Camera Permission Required</h4>
                  <p className="text-slate-400 text-xs max-w-sm mb-4">{errorMessage}</p>
                  <button
                    onClick={() => startCamera(facingMode)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry Camera Access
                  </button>
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Modal Controls Footer */}
        <div className="px-5 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div>
            {!capturedImage && hasPermission && (
              <button
                type="button"
                onClick={toggleFacingMode}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>Switch ({facingMode === "environment" ? "Rear" : "Front"})</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {capturedImage ? (
              <>
                <button
                  type="button"
                  id="camera-retake-btn"
                  onClick={handleRetake}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retake Photo
                </button>
                <button
                  type="button"
                  id="camera-confirm-btn"
                  onClick={handleConfirm}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Use This Photo
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="camera-capture-trigger-btn"
                  onClick={handleCaptureFrame}
                  disabled={!hasPermission || isCapturing}
                  className="px-6 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                  Capture Frame
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
