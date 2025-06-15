'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import '@/styles/timer.css';

interface Session {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  isBreak: boolean;
}

interface SessionHistoryProps {
  sessions: Session[];
}

const SessionHistory = ({ sessions }: SessionHistoryProps) => {
  const groupedSessions = useMemo(() => {
    const groups: { [key: string]: Session[] } = {};
    
    sessions.forEach(session => {
      const date = format(session.startTime, 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(session);
    });

    return Object.entries(groups).sort(([dateA], [dateB]) => 
      new Date(dateB).getTime() - new Date(dateA).getTime()
    );
  }, [sessions]);

  if (sessions.length === 0) {
    return (
      <div className="p-6 text-center text-white">
        <p className="text-lg font-medium drop-shadow-md">No sessions yet</p>
        <p className="text-sm mt-2 drop-shadow-md">Complete a focus or break session to see it here</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-neutral-800">Session History</h2>
      <div className="space-y-6">
        {groupedSessions.map(([date, daySessions]) => (
          <div key={date} className="space-y-2">
            <h3 className="text-sm font-medium text-neutral-600">
              {format(new Date(date), 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-2">
              {daySessions.map(session => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    session.isBreak
                      ? 'bg-break-bg border border-break-border'
                      : 'bg-focus-bg border border-focus-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      session.isBreak
                        ? 'text-break-text'
                        : 'text-focus-text'
                    }`}>
                      {session.isBreak ? 'Break' : 'Focus'}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {session.duration} min
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-neutral-500">
                    {format(session.startTime, 'h:mm a')} - {format(session.endTime, 'h:mm a')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionHistory; 