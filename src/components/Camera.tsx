import { useState, useRef, useCallback, useEffect } from 'react';
import type { Pose } from '../types';
import { useCameraPermission } from '../hooks/useCameraPermission';
import { useCameraFacing } from '../hooks/useCameraFacing';
import { useFrameProcessor } from '../utils/FrameProcessor';

export interface CameraProps {
  onPoseDetected?: (pose: Pose) => void;
  onFrame?: (frame: ImageData) => void;
  showOverlay?: boolean;
  isActive?: boolean;
  width?: number;
  height?: number;
}

export function Camera({
  onPoseDetected,
  onFrame,
  showOverlay = true,
  isActive = true,
  width = 640,
  height = 480,
}: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { permission, requestPermission } = useCameraPermission();
  const { facing, toggleFacing } = useCameraFacing('user');
  const { isReady: processorReady, processFrame } = useFrameProcessor({
    onFrame,
    onPoseDetected,
    frameInterval: 3,
  });

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        // Stop any existing stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facing,
            width: { ideal: width },
            height: { ideal: height },
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsReady(true);
            setError(null);
          };
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to access camera');
        setIsReady(false);
      }
    };

    if (permission.granted && isActive) {
      initCamera();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [permission.granted, facing, isActive, width, height]);

  // Frame processing loop
  useEffect(() => {
    if (!isReady || !isActive || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastProcessTime = 0;
    const processInterval = 1000 / 30; // 30 FPS

    const processVideoFrame = async (timestamp: number) => {
      if (!video.paused && !video.ended && video.readyState >= 2) {
        // Throttle processing
        if (timestamp - lastProcessTime >= processInterval) {
          // Draw video frame to canvas
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Get frame data and process
          try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            await processFrame(imageData);
          } catch (err) {
            // Frame processing error - continue
          }

          lastProcessTime = timestamp;
        }
      }

      animationId = requestAnimationFrame(processVideoFrame);
    };

    animationId = requestAnimationFrame(processVideoFrame);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isReady, isActive, processFrame]);

  // Handle permission states
  if (permission.status === 'loading') {
    return (
      <div className="camera-container">
        <div className="camera-message">Loading camera permissions...</div>
      </div>
    );
  }

  if (!permission.granted) {
    return (
      <div className="camera-container">
        <div className="camera-message">
          <p>We need your permission to show the camera</p>
          <button className="camera-button" onClick={requestPermission}>
            Grant Permission
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="camera-container">
        <div className="camera-error">
          <span className="error-icon">📷❌</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="camera-container">
        <div className="camera-message">Camera is paused</div>
      </div>
    );
  }

  return (
    <div className="camera-wrapper">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-video"
        style={{ display: showOverlay ? 'none' : 'block' }}
      />
      <canvas
        ref={canvasRef}
        className="camera-canvas"
        style={{ display: showOverlay ? 'block' : 'none' }}
      />
      
      <div className="camera-controls">
        <button className="camera-flip-button" onClick={toggleFacing}>
          🔄 Flip
        </button>
      </div>

      {!isReady && (
        <div className="camera-loading">
          <div className="loading-spinner" />
          <span>Initializing camera...</span>
        </div>
      )}
    </div>
  );
}
