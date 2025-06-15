'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FaRegClock, FaCog } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import SessionHistory from './SessionHistory';
import Settings from './Settings';
import '@/styles/timer.css';

interface Session {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  isBreak: boolean;
}

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sessionSequence, setSessionSequence] = useState([1, 0]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize timer with current session duration
  useEffect(() => {
    setIsMounted(true);
    if (!isActive) {
      const isCurrentBreak = sessionSequence[currentSessionIndex] === 0;
      const newMinutes = isCurrentBreak ? breakDuration : focusDuration;
      setMinutes(newMinutes);
      setSeconds(0);
    }
  }, [isBreak, focusDuration, breakDuration, isActive, sessionSequence, currentSessionIndex]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetTimer();
      } else if (e.code === 'KeyS') {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleTimer = useCallback(() => {
    if (!isActive) {
      setSessionStartTime(new Date());
    }
    setIsActive(prev => !prev);
  }, [isActive]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    const isCurrentBreak = sessionSequence[currentSessionIndex] === 0;
    const newMinutes = isCurrentBreak ? breakDuration : focusDuration;
    setMinutes(newMinutes);
    setSeconds(0);
    setSessionStartTime(null);
  }, [sessionSequence, currentSessionIndex, breakDuration, focusDuration]);

  const handleSessionComplete = useCallback(() => {
    if (sessionStartTime) {
      const newSession: Session = {
        id: uuidv4(),
        startTime: sessionStartTime,
        endTime: new Date(),
        duration: isBreak ? breakDuration : focusDuration,
        isBreak,
      };
      setSessions(prev => [newSession, ...prev]);
    }
    
    const nextIndex = (currentSessionIndex + 1) % sessionSequence.length;
    setCurrentSessionIndex(nextIndex);
    const isNextBreak = sessionSequence[nextIndex] === 0;
    setIsBreak(isNextBreak);
    const newMinutes = isNextBreak ? breakDuration : focusDuration;
    setMinutes(newMinutes);
    setSeconds(0);
  }, [sessionStartTime, isBreak, breakDuration, focusDuration, sessionSequence, currentSessionIndex]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 0) {
            if (minutes === 0) {
              setIsActive(false);
              handleSessionComplete();
              return 0;
            }
            setMinutes(prevMinutes => Math.max(0, prevMinutes - 1));
            return 59;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, minutes, handleSessionComplete]);

  if (!isMounted) return null;

  return (
    <div className={`timer-container ${isBreak ? 'break-theme' : 'focus-theme'}`}>
      <div className="history-panel">
        <SessionHistory sessions={sessions} />
      </div>

      <div className="main-content">
        <div className="timer-card">
          <div className="timer-header">
            <div className="title-container">
              <FaRegClock className="text-4xl" />
              <h1 className="text-2xl font-bold">
                {isBreak ? 'Break Time 🍅' : 'Focus Time 🍅'}
              </h1>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="settings-button"
              aria-label="Settings"
            >
              <FaCog className="text-2xl" />
            </button>
          </div>
          <div className="timer-display">
            {Math.max(0, minutes).toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="button-container">
            <button
              onClick={toggleTimer}
              className={`timer-button ${isActive ? 'start-button' : 'start-button'}`}
              aria-label={isActive ? 'Pause timer' : 'Start timer'}
            >
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="timer-button reset-button"
              aria-label="Reset timer"
            >
              Reset
            </button>
          </div>
          <div className="mt-4 text-center text-sm text-neutral-500">
            <p>Press <kbd className="px-2 py-1 bg-neutral-100 rounded">Space</kbd> to {isActive ? 'pause' : 'start'}</p>
            <p>Press <kbd className="px-2 py-1 bg-neutral-100 rounded">R</kbd> to reset</p>
            <p>Press <kbd className="px-2 py-1 bg-neutral-100 rounded">S</kbd> for settings</p>
          </div>
        </div>
      </div>

      <Settings
        focusDuration={focusDuration}
        breakDuration={breakDuration}
        onFocusDurationChange={setFocusDuration}
        onBreakDurationChange={setBreakDuration}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        sessionSequence={sessionSequence}
        onSessionSequenceChange={setSessionSequence}
      />
    </div>
  );
};

export default PomodoroTimer; 