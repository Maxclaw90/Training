import { useState, useEffect, useCallback } from 'react';
import { Camera, PermissionStatus } from 'expo-camera';

export interface CameraPermissionState {
  status: PermissionStatus | null;
  granted: boolean;
  canAskAgain: boolean;
  error: string | null;
}

export interface UseCameraPermissionReturn {
  permission: CameraPermissionState;
  requestPermission: () => Promise<void>;
  checkPermission: () => Promise<void>;
}

/**
 * Hook to manage camera permissions
 */
export function useCameraPermission(): UseCameraPermissionReturn {
  const [permission, setPermission] = useState<CameraPermissionState>({
    status: null,
    granted: false,
    canAskAgain: true,
    error: null,
  });

  const checkPermission = useCallback(async () => {
    try {
      const { status, canAskAgain } = await Camera.getCameraPermissionsAsync();
      setPermission({
        status,
        granted: status === PermissionStatus.GRANTED,
        canAskAgain,
        error: null,
      });
    } catch (error) {
      setPermission(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to check permission',
      }));
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
      setPermission({
        status,
        granted: status === PermissionStatus.GRANTED,
        canAskAgain,
        error: status === PermissionStatus.DENIED ? 'Camera permission denied' : null,
      });
    } catch (error) {
      setPermission(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to request permission',
      }));
    }
  }, []);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    permission,
    requestPermission,
    checkPermission,
  };
}
