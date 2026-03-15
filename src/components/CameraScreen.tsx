import { useRef, useEffect, useState, useCallback } from 'react';
import type { ExerciseType, WorkoutSession, FormFeedback, RepData, PoseLandmark } from '../types';
import { EXERCISES, FORM_TIPS } from '../utils/constants';
import { RepCounter } from './RepCounter';
import { FeedbackPanel } from './FeedbackPanel';
import { PoseOverlay } from './PoseOverlay';
import './CameraScreen.css';

interface CameraScreenProps {
  exerciseId: ExerciseType;
  onBack: () => void;
  onComplete: (session: WorkoutSession) => void;
}

export function CameraScreen({ exerciseId, onBack, onComplete }: CameraScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState<FormFeedback[]>([]);
  const [currentPose, setCurrentPose] = useState<PoseLandmark[] | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [repHistory, setRepHistory] = useState<RepData[]>([]);
  const [feedbackHistory, setFeedbackHistory] = useState<FormFeedback[]>([]);
  
  const exercise = EXERCISES.find(e => e.id === exerciseId)!;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 1280, height: 720 },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setCameraError('Camera access denied. Please allow camera permissions.');
      }
    };
    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Timer for elapsed time
  useEffect(() => {
    if (isActive && sessionStartTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, sessionStartTime]);

  // Simulate pose detection and rep counting
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate pose detection
      const mockPose: PoseLandmark[] = Array(33).fill(null).map((_, i) => ({
        x: 0.3 + Math.random() * 0.4,
        y: 0.2 + Math.random() * 0.6,
        z: 0,
        visibility: 0.8 + Math.random() * 0.2,
      }));
      setCurrentPose(mockPose);

      // Simulate occasional rep detection (every 3-5 seconds)
      if (Math.random() < 0.05) {
        const newRep: RepData = {
          count: repCount + 1,
          timestamp: Date.now(),
          formQuality: Math.random() > 0.7 ? 'perfect' : Math.random() > 0.3 ? 'good' : 'poor',
        };
        setRepCount(prev => prev + 1);
        setRepHistory(prev => [...prev, newRep]);

        // Add feedback for the rep
        const tips = FORM_TIPS[exerciseId];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        const newFeedback: FormFeedback = {
          id: Date.now().toString(),
          message: newRep.formQuality === 'perfect' 
            ? `Perfect! ${randomTip}` 
            : newRep.formQuality === 'good'
            ? `Good rep! Watch your ${randomTip.toLowerCase()}`
            : `Check form: ${randomTip}`,
          type: newRep.formQuality === 'perfect' ? 'good' : newRep.formQuality === 'good' ? 'warning' : 'error',
          timestamp: Date.now(),
        };
        setFeedback(prev => [newFeedback, ...prev].slice(0, 5));
        setFeedbackHistory(prev => [...prev, newFeedback]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, exerciseId, repCount]);

  const handleStartStop = useCallback(() => {
    if (isActive) {
      // Stop workout
      setIsActive(false);
      const session: WorkoutSession = {
        exerciseId,
        startTime: sessionStartTime!,
        endTime: Date.now(),
        reps: repHistory,
        feedback: feedbackHistory,
      };
      onComplete(session);
    } else {
      // Start workout
      setIsActive(true);
      setSessionStartTime(Date.now());
      setRepCount(0);
      setRepHistory([]);
      setFeedbackHistory([]);
      setFeedback([]);
    }
  }, [isActive, exerciseId, sessionStartTime, repHistory, feedbackHistory, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="camera-screen">
      <header className="camera-header">
        <button className="back-button" onClick={onBack}>
          ←
        </button>
        <div className="exercise-info-header">
          <span className="exercise-icon-small">{exercise.icon}</span>
          <span className="exercise-name-header">{exercise.name}</span>
        </div>
        <div className="timer-display">
          {formatTime(elapsedTime)}
        </div>
      </header>

      <main className="camera-main">
        <div className="camera-container">
          {cameraError ? (
            <div className="camera-error">
              <span className="error-icon">📷❌</span>
              <p>{cameraError}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
              />
              <canvas
                ref={canvasRef}
                className="pose-canvas"
              />
              {currentPose && <PoseOverlay pose={currentPose} isActive={isActive} />}
              
              {!isActive && repCount === 0 && (
                <div className="camera-overlay">
                  <div className="ready-prompt">
                    <span className="ready-icon">📹</span>
                    <p>Position yourself in frame</p>
                    <p className="ready-sub">Press START when ready</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="workout-panel">
          <RepCounter count={repCount} isActive={isActive} />
          <FeedbackPanel feedback={feedback} exerciseId={exerciseId} />
        </div>
      </main>

      <footer className="camera-footer">
        <button
          className={`start-stop-button ${isActive ? 'stop' : 'start'}`}
          onClick={handleStartStop}
        >
          {isActive ? (
            <>
              <span className="button-icon">⏹</span>
              <span>STOP WORKOUT</span>
            </>
          ) : (
            <>
              <span className="button-icon">▶</span>
              <span>START WORKOUT</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
}