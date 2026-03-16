import { useSettings } from '../context/SettingsContext';

export function useHaptic() {
  const { triggerHaptic } = useSettings();
  return { triggerHaptic };
}
