/**
 * useDeviceOrientation hook for handling device orientation changes
 */

import { useEffect, useState, useCallback } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { DeviceOrientation } from '../types/pose';

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    portrait: true,
    landscape: false,
    orientation: 'portrait'
  });

  const updateOrientation = useCallback(async () => {
    const orientationInfo = await ScreenOrientation.getOrientationAsync();
    
    let deviceOrientation: DeviceOrientation['orientation'];
    let isPortrait = false;
    let isLandscape = false;

    switch (orientationInfo) {
      case ScreenOrientation.Orientation.PORTRAIT_UP:
        deviceOrientation = 'portrait';
        isPortrait = true;
        break;
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        deviceOrientation = 'portrait-upside-down';
        isPortrait = true;
        break;
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
        deviceOrientation = 'landscape-left';
        isLandscape = true;
        break;
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        deviceOrientation = 'landscape-right';
        isLandscape = true;
        break;
      default:
        deviceOrientation = 'unknown';
    }

    setOrientation({
      portrait: isPortrait,
      landscape: isLandscape,
      orientation: deviceOrientation
    });
  }, []);

  useEffect(() => {
    // Get initial orientation
    updateOrientation();

    // Subscribe to orientation changes
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      let deviceOrientation: DeviceOrientation['orientation'];
      let isPortrait = false;
      let isLandscape = false;

      switch (event.orientationInfo.orientation) {
        case ScreenOrientation.Orientation.PORTRAIT_UP:
          deviceOrientation = 'portrait';
          isPortrait = true;
          break;
        case ScreenOrientation.Orientation.PORTRAIT_DOWN:
          deviceOrientation = 'portrait-upside-down';
          isPortrait = true;
          break;
        case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
          deviceOrientation = 'landscape-left';
          isLandscape = true;
          break;
        case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
          deviceOrientation = 'landscape-right';
          isLandscape = true;
          break;
        default:
          deviceOrientation = 'unknown';
      }

      setOrientation({
        portrait: isPortrait,
        landscape: isLandscape,
        orientation: deviceOrientation
      });
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, [updateOrientation]);

  const lockOrientation = useCallback(async (orientationLock: ScreenOrientation.OrientationLock) => {
    await ScreenOrientation.lockAsync(orientationLock);
  }, []);

  const unlockOrientation = useCallback(async () => {
    await ScreenOrientation.unlockAsync();
  }, []);

  return {
    ...orientation,
    lockOrientation,
    unlockOrientation,
    refresh: updateOrientation
  };
}