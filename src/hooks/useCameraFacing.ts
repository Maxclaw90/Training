import { useState, useCallback, useRef } from 'react';
import { CameraType } from 'expo-camera';

export interface CameraFacingState {
  facing: CameraType;
  isFlipping: boolean;
}

export interface UseCameraFacingReturn {
  facing: CameraType;
  isFlipping: boolean;
  toggleFacing: () => void;
  setFacing: (facing: CameraType) => void;
}

/**
 * Hook to manage camera facing (front/back) state
 */
export function useCameraFacing(initialFacing: CameraType = 'front'): UseCameraFacingReturn {
  const [state, setState] = useState<CameraFacingState>({
    facing: initialFacing,
    isFlipping: false,
  });

  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleFacing = useCallback(() => {
    setState(prev => ({ ...prev, isFlipping: true }));

    // Clear any existing timeout
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
    }

    // Set new facing direction
    setState(prev => ({
      facing: prev.facing === 'back' ? 'front' : 'back',
      isFlipping: true,
    }));

    // Reset flipping state after animation
    flipTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isFlipping: false }));
    }, 300);
  }, []);

  const setFacing = useCallback((newFacing: CameraType) => {
    if (newFacing !== state.facing) {
      setState({
        facing: newFacing,
        isFlipping: true,
      });

      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }

      flipTimeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, isFlipping: false }));
      }, 300);
    }
  }, [state.facing]);

  return {
    facing: state.facing,
    isFlipping: state.isFlipping,
    toggleFacing,
    setFacing,
  };
}
