"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

/**
 * System Log Entry Type
 */
export type LogType = "INFO" | "ERROR" | "SUCCESS" | "WARNING";

export interface SystemLog {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: LogType;
}

interface SystemLogContextType {
  logs: SystemLog[];
  addLog: (source: string, message: string, type?: LogType) => void;
  clearLogs: () => void;
}

const SystemLogContext = createContext<SystemLogContextType | undefined>(undefined);

/**
 * System Log Provider Component
 * Provides global log storage and management
 */
export function SystemLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<SystemLog[]>([]);

  const addLog = useCallback((source: string, message: string, type: LogType = "INFO") => {
    const newLog: SystemLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      source,
      message,
      type,
    };

    setLogs((prevLogs) => [...prevLogs, newLog]);

    // Optional: Limit log history to prevent memory issues (keep last 1000 logs)
    setLogs((prevLogs) => {
      if (prevLogs.length > 1000) {
        return prevLogs.slice(-1000);
      }
      return prevLogs;
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <SystemLogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </SystemLogContext.Provider>
  );
}

/**
 * Hook to access system logs
 * Usage: const { logs, addLog, clearLogs } = useSystemLogs();
 */
export function useSystemLogs() {
  const context = useContext(SystemLogContext);
  if (context === undefined) {
    throw new Error("useSystemLogs must be used within a SystemLogProvider");
  }
  return context;
}

