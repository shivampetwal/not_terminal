import { useState, useEffect, KeyboardEvent } from 'react';

export function useTerminalInput() {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState(0);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
          setCursorPosition(commandHistory[commandHistory.length - 1 - newIndex].length);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
          setCursorPosition(commandHistory[commandHistory.length - 1 - newIndex].length);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCommand('');
          setCursorPosition(0);
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (cursorPosition > 0) {
          setCursorPosition(cursorPosition - 1);
        }
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (cursorPosition < command.length) {
          setCursorPosition(cursorPosition + 1);
        }
        break;

      case 'Home':
        e.preventDefault();
        setCursorPosition(0);
        break;

      case 'End':
        e.preventDefault();
        setCursorPosition(command.length);
        break;
    }
  };

  const addToHistory = (cmd: string) => {
    if (cmd.trim()) {
      setCommandHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
    }
  };

  return {
    command,
    setCommand,
    cursorPosition,
    setCursorPosition,
    handleKeyDown,
    addToHistory
  };
}