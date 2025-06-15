'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import '@/styles/timer.css';

interface SettingsProps {
  focusDuration: number;
  breakDuration: number;
  onFocusDurationChange: (duration: number) => void;
  onBreakDurationChange: (duration: number) => void;
  isOpen: boolean;
  onClose: () => void;
  sessionSequence: number[];
  onSessionSequenceChange: (sequence: number[]) => void;
}

const Settings = ({
  focusDuration,
  breakDuration,
  onFocusDurationChange,
  onBreakDurationChange,
  isOpen,
  onClose,
  sessionSequence,
  onSessionSequenceChange,
}: SettingsProps) => {
  const [localFocusDuration, setLocalFocusDuration] = useState(focusDuration);
  const [localBreakDuration, setLocalBreakDuration] = useState(breakDuration);
  const [localSequence, setLocalSequence] = useState(sessionSequence);

  const handleSave = useCallback(() => {
    // Validate durations before saving
    const validFocusDuration = Math.max(1, Math.min(60, localFocusDuration));
    const validBreakDuration = Math.max(1, Math.min(30, localBreakDuration));
    
    // Update parent component with validated values
    onFocusDurationChange(validFocusDuration);
    onBreakDurationChange(validBreakDuration);
    onSessionSequenceChange(localSequence);
    onClose();
  }, [localFocusDuration, localBreakDuration, localSequence, onFocusDurationChange, onBreakDurationChange, onSessionSequenceChange, onClose]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Effect for keyboard listener
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, handleKeyPress]);

  // Effect for resetting local state
  useEffect(() => {
    if (isOpen) {
      setLocalFocusDuration(focusDuration);
      setLocalBreakDuration(breakDuration);
      setLocalSequence(sessionSequence);
    }
  }, [isOpen, focusDuration, breakDuration, sessionSequence]);

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">Settings</h2>
            <button
              onClick={onClose}
              className="settings-button"
              aria-label="Close settings"
            >
              <FaTimes className="text-neutral-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Focus Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={localFocusDuration}
                onChange={(e) => setLocalFocusDuration(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                className="settings-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={localBreakDuration}
                onChange={(e) => setLocalBreakDuration(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                className="settings-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Session Sequence
              </label>
              <div className="flex flex-wrap gap-2">
                {localSequence.map((type, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const newSequence = [...localSequence];
                      newSequence[index] = type === 1 ? 0 : 1;
                      setLocalSequence(newSequence);
                    }}
                    className={`sequence-button ${type === 1 ? 'focus-sequence' : 'break-sequence'}`}
                  >
                    {type === 1 ? 'Focus' : 'Break'}
                  </button>
                ))}
                <button
                  onClick={() => setLocalSequence([...localSequence, 1])}
                  className="add-sequence-button"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="settings-cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="settings-save-button"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 