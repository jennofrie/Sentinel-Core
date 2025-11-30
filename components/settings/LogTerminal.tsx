"use client";

import { useEffect, useRef } from "react";
import { useSystemLogs } from "@/context/SystemLogContext";
import { Trash2 } from "lucide-react";

export default function LogTerminal() {
  const { logs, clearLogs } = useSystemLogs();
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return "text-green-400";
      case "ERROR":
        return "text-signal-red";
      case "WARNING":
        return "text-cyber-amber";
      case "INFO":
      default:
        return "text-safe-cyan";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  };

  return (
    <div className="glass-panel rounded-lg overflow-hidden border border-white/10">
      {/* Terminal Header */}
      <div className="bg-black/40 border-b border-white/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-signal-red" />
            <div className="w-3 h-3 rounded-full bg-cyber-amber" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs font-mono text-slate-400 ml-3">SYSTEM LOG - TERMINAL</span>
        </div>
        <button
          onClick={clearLogs}
          className="px-3 py-1 text-xs font-mono text-slate-400 hover:text-signal-red transition-colors flex items-center gap-2"
          title="Clear logs"
        >
          <Trash2 className="w-3 h-3" />
          CLEAR
        </button>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        className="bg-black/60 h-[600px] overflow-y-auto p-4 font-mono text-sm"
        style={{
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {logs.length === 0 ? (
          <div className="text-slate-500">
            <span className="text-green-400">$</span>{" "}
            <span className="text-slate-400">Waiting for system logs...</span>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="mb-1">
              <span className="text-slate-600">[{formatTimestamp(log.timestamp)}]</span>
              <span className="text-slate-500 mx-2">|</span>
              <span className="text-slate-500">[{log.source}]</span>
              <span className="text-slate-500 mx-2">|</span>
              <span className={getLogColor(log.type)}>[{log.type}]</span>
              <span className="text-slate-500 mx-2">:</span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))
        )}
        {/* Terminal Cursor */}
        {logs.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-400">$</span>
            <span className="w-2 h-4 bg-green-400 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

