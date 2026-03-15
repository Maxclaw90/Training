import { Pose, POSE_CONNECTIONS, POSE_LANDMARKS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

export interface MediaPipePoseConfig {
  modelComplexity?: 0 | 1 | 2;
  smoothLandmarks?: boolean;
  enableSegmentation?: boolean;
  smoothSegmentation?: boolean;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
}

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface PoseResults {
  poseLandmarks?: PoseLandmark[];
  poseWorldLandmarks?: PoseLandmark[];
  segmentationMask?: any;
  image: any;
}

/**
 * MediaPipe Pose detector wrapper for React Native / Expo
 */
export class MediaPipePoseDetector {
  private pose: Pose | null = null;
  private camera: Camera | null = null;
  private config: MediaPipePoseConfig;
  private onResultsCallback: ((results: PoseResults) => void) | null = null;
  private isInitialized: boolean = false;

  constructor(config: MediaPipePoseConfig = {}) {
    this.config = {
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      ...config,
    };
  }

  /**
   * Initialize the pose detector
   */
  async initialize(onResults: (results: PoseResults) => void): Promise<void> {
    if (this.isInitialized) return;

    this.onResultsCallback = onResults;

    this.pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    this.pose.setOptions({
      modelComplexity: this.config.modelComplexity,
      smoothLandmarks: this.config.smoothLandmarks,
      enableSegmentation: this.config.enableSegmentation,
      smoothSegmentation: this.config.smoothSegmentation,
      minDetectionConfidence: this.config.minDetectionConfidence,
      minTrackingConfidence: this.config.minTrackingConfidence,
    });

    this.pose.onResults((results) => {
      if (this.onResultsCallback) {
        this.onResultsCallback(results as PoseResults);
      }
    });

    await this.pose.initialize();
    this.isInitialized = true;
  }

  /**
   * Process a single image/frame
   */
  async processFrame(imageSource: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): Promise<void> {
    if (!this.pose || !this.isInitialized) {
      throw new Error('Pose detector not initialized');
    }

    await this.pose.send({ image: imageSource });
  }

  /**
   * Start continuous processing from a video element
   */
  startContinuousProcessing(
    videoElement: HTMLVideoElement,
    onResults: (results: PoseResults) => void
  ): void {
    if (!this.pose) {
      throw new Error('Pose detector not initialized');
    }

    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        if (this.pose) {
          await this.pose.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480,
    });

    this.camera.start();
  }

  /**
   * Stop continuous processing
   */
  stopContinuousProcessing(): void {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
  }

  /**
   * Check if detector is initialized
   */
  getInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get POSE_CONNECTIONS for drawing skeleton
   */
  static getPoseConnections(): readonly [number, number][] {
    return POSE_CONNECTIONS;
  }

  /**
   * Get POSE_LANDMARKS enum
   */
  static getPoseLandmarks(): typeof POSE_LANDMARKS {
    return POSE_LANDMARKS;
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.stopContinuousProcessing();
    
    if (this.pose) {
      this.pose.close();
      this.pose = null;
    }

    this.isInitialized = false;
    this.onResultsCallback = null;
  }
}

export { POSE_CONNECTIONS, POSE_LANDMARKS };
