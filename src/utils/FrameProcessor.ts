import { useEffect, useRef, useCallback, useState } from 'react';
import { Platform } from 'react-native';

export interface FrameData {
  width: number;
  height: number;
  timestamp: number;
  data: any; // Platform-specific frame data
}

export interface FrameProcessorOptions {
  onFrame?: (frame: FrameData) => void;
  onPoseDetected?: (pose: any) => void;
  frameInterval?: number; // Process every N frames (default: 3)
  targetWidth?: number;
  targetHeight?: number;
}

/**
 * Utility class for processing camera frames for pose detection
 */
export class FrameProcessor {
  private options: FrameProcessorOptions;
  private frameCount: number = 0;
  private isProcessing: boolean = false;
  private lastProcessedTime: number = 0;
  private processingInterval: number;

  constructor(options: FrameProcessorOptions = {}) {
    this.options = {
      frameInterval: 3,
      targetWidth: 640,
      targetHeight: 480,
      ...options,
    };
    this.processingInterval = 1000 / 30; // Target 30 FPS processing
  }

  /**
   * Process a frame from the camera
   */
  async processFrame(frame: any): Promise<void> {
    // Skip if already processing
    if (this.isProcessing) return;

    // Frame skipping for performance
    this.frameCount++;
    if (this.frameCount % (this.options.frameInterval || 3) !== 0) return;

    // Throttle processing rate
    const now = Date.now();
    if (now - this.lastProcessedTime < this.processingInterval) return;

    this.isProcessing = true;
    this.lastProcessedTime = now;

    try {
      const frameData = this.extractFrameData(frame);
      
      if (frameData) {
        this.options.onFrame?.(frameData);
      }
    } catch (error) {
      console.error('Frame processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Extract frame data in a platform-agnostic way
   */
  private extractFrameData(frame: any): FrameData | null {
    if (!frame) return null;

    // Handle different frame formats from expo-camera
    if (Platform.OS === 'ios') {
      return this.extractIOSFrame(frame);
    } else if (Platform.OS === 'android') {
      return this.extractAndroidFrame(frame);
    } else {
      return this.extractWebFrame(frame);
    }
  }

  private extractIOSFrame(frame: any): FrameData | null {
    // iOS frame format handling
    return {
      width: frame.width || this.options.targetWidth || 640,
      height: frame.height || this.options.targetHeight || 480,
      timestamp: Date.now(),
      data: frame,
    };
  }

  private extractAndroidFrame(frame: any): FrameData | null {
    // Android frame format handling
    return {
      width: frame.width || this.options.targetWidth || 640,
      height: frame.height || this.options.targetHeight || 480,
      timestamp: Date.now(),
      data: frame,
    };
  }

  private extractWebFrame(frame: any): FrameData | null {
    // Web frame format handling
    return {
      width: frame.width || this.options.targetWidth || 640,
      height: frame.height || this.options.targetHeight || 480,
      timestamp: Date.now(),
      data: frame,
    };
  }

  /**
   * Convert frame to format suitable for MediaPipe
   */
  convertForMediaPipe(frameData: FrameData): HTMLVideoElement | HTMLCanvasElement | null {
    if (Platform.OS !== 'web') {
      // For native, we need to handle differently
      return null;
    }

    // On web, we can use the frame directly if it's a video element
    if (frameData.data instanceof HTMLVideoElement) {
      return frameData.data;
    }

    // Or create a canvas from the frame data
    if (frameData.data instanceof ImageData || frameData.data instanceof HTMLCanvasElement) {
      return frameData.data;
    }

    return null;
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.isProcessing = false;
    this.frameCount = 0;
  }

  /**
   * Reset the processor state
   */
  reset(): void {
    this.frameCount = 0;
    this.isProcessing = false;
    this.lastProcessedTime = 0;
  }
}

/**
 * Hook for using frame processor in React components
 */
export function useFrameProcessor(options: FrameProcessorOptions) {
  const processorRef = useRef<FrameProcessor | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    processorRef.current = new FrameProcessor(options);
    setIsReady(true);

    return () => {
      processorRef.current?.dispose();
      processorRef.current = null;
    };
  }, []);

  const processFrame = useCallback(async (frame: any) => {
    if (!processorRef.current) return;
    await processorRef.current.processFrame(frame);
  }, []);

  const reset = useCallback(() => {
    processorRef.current?.reset();
  }, []);

  return {
    isReady,
    processFrame,
    reset,
  };
}
