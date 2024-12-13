import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { X, Minus, Maximize2, Sun, Moon, Settings } from 'lucide-react';
import { useTerminalInput } from '../hooks/useTerminalInput';
import { useTheme } from '../hooks/useTheme';
import About from './tabs/About';
import Skills from './tabs/Skills';
import Projects from './tabs/Projects';
import Socials from './tabs/Socials';
import '../styles/themes.css';

type Tab = 'about' | 'skills' | 'projects' | 'socials';
type ResizeDirection = 'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left' | null;

// Update Theme type to include 'dracula'
type Theme = 'dark' | 'light' | 'dracula';
type Font = 'JetBrains Mono' | 'Fira Code' | 'Source Code Pro';
type Background = 'gradient-dark' | 'gradient-light' | 'solid-black' | 'solid-white';

export default function Terminal() {
  const [activeTab, setActiveTab] = useState<Tab>('about');
  const {
    command,
    setCommand,
    cursorPosition,
    setCursorPosition,
    handleKeyDown,
    addToHistory,
  } = useTerminalInput();

  const { theme, toggleTheme, setTheme, font, setFont, background, setBackground } = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const terminalStart = useRef({ x: 0, y: 0 });

  const [isResizing, setIsResizing] = useState(false);
  const resizeDirection = useRef<ResizeDirection>(null);
  const resizeStart = useRef({ x: 0, y: 0 });
  const sizeStart = useRef({ width: 800, height: 600 });
  const positionStart = useRef({ x: 100, y: 100 });

  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 800, height: 600 });

  // State for Settings Dropdown
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  // Center the terminal on initial mount only
  useLayoutEffect(() => {
    const centerX = window.innerWidth / 2 - size.width / 2;
    const centerY = window.innerHeight / 2 - size.height / 2;
    setPosition({ x: centerX, y: centerY });
    positionStart.current = { x: centerX, y: centerY };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

  const handleCommand = (cmd: string) => {
    const normalized = cmd.toLowerCase().trim();
    if (normalized.startsWith('cd ')) {
      const tab = normalized.split(' ')[1].replace('/', '') as Tab;
      if (['about', 'skills', 'projects', 'socials'].includes(tab)) {
        setActiveTab(tab);
      }
    }
    addToHistory(cmd);
    setCommand('');
    setCursorPosition(0);
  };

  // Handle arrow key navigation
  const handleArrowKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setCursorPosition(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setCursorPosition(prev => (prev < command.length ? prev + 1 : prev));
    }
  };

  // Handle mouse click to set cursor position
  const handleMouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mirrorRef.current && inputRef.current && cursorRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;

      // Create a temporary span for each character to find the cursor position
      let newCursorPos = 0;

      for (let i = 0; i <= command.length; i++) {
        mirrorRef.current.textContent = command.substring(0, i);
        const width = mirrorRef.current.getBoundingClientRect().width;
        if (width >= clickX) {
          newCursorPos = i;
          break;
        }
      }

      setCursorPosition(newCursorPos);
    }
  };

  // Update cursor position based on mirror span width
  useEffect(() => {
    if (mirrorRef.current && cursorRef.current) {
      const mirrorWidth = mirrorRef.current.getBoundingClientRect().width;
      cursorRef.current.style.left = `${mirrorWidth}px`;
    }
  }, [cursorPosition, command]);

  // Handle dragging
  const onMouseDownDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    terminalStart.current = { x: position.x, y: position.y };
    e.preventDefault();
  };

  // Handle resizing
  const onMouseDownResize = (direction: ResizeDirection) => (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    resizeDirection.current = direction;
    resizeStart.current = { x: e.clientX, y: e.clientY };
    sizeStart.current = { width: size.width, height: size.height };
    positionStart.current = { x: position.x, y: position.y };
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.current.x;
        const deltaY = e.clientY - dragStart.current.y;
        setPosition({
          x: terminalStart.current.x + deltaX,
          y: terminalStart.current.y + deltaY
        });
      }

      if (isResizing && resizeDirection.current) {
        let newWidth = sizeStart.current.width;
        let newHeight = sizeStart.current.height;
        let newX = positionStart.current.x;
        let newY = positionStart.current.y;

        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;

        switch (resizeDirection.current) {
          case 'right':
            newWidth = Math.max(400, sizeStart.current.width + deltaX);
            break;
          case 'left':
            newWidth = Math.max(400, sizeStart.current.width - deltaX);
            newX = positionStart.current.x + deltaX;
            break;
          case 'bottom':
            newHeight = Math.max(300, sizeStart.current.height + deltaY);
            break;
          case 'top':
            newHeight = Math.max(300, sizeStart.current.height - deltaY);
            newY = positionStart.current.y + deltaY;
            break;
          case 'top-right':
            newWidth = Math.max(400, sizeStart.current.width + deltaX);
            newHeight = Math.max(300, sizeStart.current.height - deltaY);
            newY = positionStart.current.y + deltaY;
            break;
          case 'bottom-right':
            newWidth = Math.max(400, sizeStart.current.width + deltaX);
            newHeight = Math.max(300, sizeStart.current.height + deltaY);
            break;
          case 'bottom-left':
            newWidth = Math.max(400, sizeStart.current.width - deltaX);
            newHeight = Math.max(300, sizeStart.current.height + deltaY);
            newX = positionStart.current.x + deltaX;
            break;
          case 'top-left':
            newWidth = Math.max(400, sizeStart.current.width - deltaX);
            newHeight = Math.max(300, sizeStart.current.height - deltaY);
            newX = positionStart.current.x + deltaX;
            newY = positionStart.current.y + deltaY;
            break;
          default:
            break;
        }

        setSize({
          width: newWidth,
          height: newHeight
        });

        setPosition({
          x: newX,
          y: newY
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      resizeDirection.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  return (
    <div
      className="flex items-center justify-center font-mono"
      style={{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        zIndex: 1000,
        transition: isDragging ? 'none' : 'top 0.2s ease, left 0.2s ease',
      }}
    >
      <div
        className={`theme-${theme} font-${font.replace(' ', '-').toLowerCase()} rounded-lg shadow-2xl backdrop-blur-md fixed-size-terminal ${isDragging ? 'terminal-dragging' : ''}`}
        style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}
      >
        {/* Terminal Header */}
        <div
          className="terminal-header cursor-grab"
          onMouseDown={onMouseDownDrag}
        >
          <div className="flex items-center gap-2">
            <button className="w-3 h-3 bg-red-500 rounded-full"></button>
            <button className="w-3 h-3 bg-yellow-500 rounded-full"></button>
            <button className="w-3 h-3 bg-green-500 rounded-full"></button>
          </div>
          <span className="terminal-title">terminal@portfolio</span>
          <div className="flex gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1 hover:bg-primary/10 rounded"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-secondary" />
              ) : (
                <Moon className="w-4 h-4 text-secondary" />
              )}
            </button>
            {/* Settings Button */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setIsSettingsOpen(prev => !prev)}
                className="p-1 hover:bg-primary/10 rounded"
              >
                <Settings className="w-4 h-4 text-secondary" />
              </button>
              {/* Settings Dropdown */}
              {isSettingsOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-gray-800 text-gray-300 rounded-md shadow-lg z-20"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="settings-menu"
                >
                  <div className="py-2 px-4 border-b border-gray-700" role="none">
                    <span className="font-semibold" role="menuitem">Settings</span>
                  </div>
                  {/* Theme Selection */}
                  <div className="py-2 px-4" role="none">
                    <label className="block text-sm" htmlFor="theme-select">Theme:</label>
                    <select
                      id="theme-select"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as Theme)}
                      className="mt-1 w-full bg-gray-700 text-gray-300 border border-gray-600 rounded-md"
                      role="menuitem"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="dracula">Dracula</option>
                    </select>
                  </div>
                  {/* Font Selection */}
                  <div className="py-2 px-4" role="none">
                    <label className="block text-sm" htmlFor="font-select">Font:</label>
                    <select
                      id="font-select"
                      value={font}
                      onChange={(e) => setFont(e.target.value as Font)}
                      className="mt-1 w-full bg-gray-700 text-gray-300 border border-gray-600 rounded-md"
                      role="menuitem"
                    >
                      <option value="JetBrains Mono">JetBrains Mono</option>
                      <option value="Fira Code">Fira Code</option>
                      <option value="Source Code Pro">Source Code Pro</option>
                    </select>
                  </div>
                  {/* Background Selection */}
                  <div className="py-2 px-4" role="none">
                    <label className="block text-sm" htmlFor="background-select">Background:</label>
                    <select
                      id="background-select"
                      value={background}
                      onChange={(e) => setBackground(e.target.value as Background)}
                      className="mt-1 w-full bg-gray-700 text-gray-300 border border-gray-600 rounded-md"
                      role="menuitem"
                    >
                      <option value="gradient-dark">Gradient Dark</option>
                      <option value="gradient-light">Gradient Light</option>
                      <option value="solid-black">Solid Black</option>
                      <option value="solid-white">Solid White</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            {/* Minimize Button */}
            <button className="p-1 hover:bg-primary/10 rounded">
              <Minus className="w-4 h-4 text-secondary" />
            </button>
            {/* Maximize Button */}
            <button className="p-1 hover:bg-primary/10 rounded">
              <Maximize2 className="w-4 h-4 text-secondary" />
            </button>
            {/* Close Button */}
            <button className="p-1 hover:bg-primary/10 rounded">
              <X className="w-4 h-4 text-secondary" />
            </button>
          </div>
        </div>

        {/* Terminal Content with Gradient */}
        <div className="terminal-content bg-terminal-gradient flex-1 overflow-hidden">
          <div className="content-area">
            {activeTab === 'about' && <About />}
            {activeTab === 'skills' && <Skills />}
            {activeTab === 'projects' && <Projects />}
            {activeTab === 'socials' && <Socials />}

            {/* Command Input */}
            <div
              className="command-input mt-4 flex items-center relative"
              onClick={handleMouseClick}
            >
              <span className="text-accent-primary">➜</span>
              <span className="text-accent-secondary ml-2">~</span>
              <div className="flex-1 ml-2 relative">
                <input
                  type="text"
                  ref={inputRef}
                  value={command}
                  onChange={(e) => {
                    setCommand(e.target.value);
                    setCursorPosition(e.target.selectionStart || 0);
                  }}
                  onKeyDown={(e) => {
                    handleKeyDown(e);
                    handleArrowKeys(e);
                    if (e.key === 'Enter') {
                      handleCommand(command);
                    }
                  }}
                  className="w-full bg-transparent outline-none text-primary caret-transparent block cursor-none"
                  autoFocus
                />
                {/* Hidden Mirror Span for Cursor Positioning */}
                <span ref={mirrorRef} className="mirror-span">
                  {command.substring(0, cursorPosition)}
                </span>
                {/* Custom Block Cursor */}
                <div
                  ref={cursorRef}
                  className="cursor-block"
                  style={{
                    top: '0',
                    height: '100%',
                    width: '1ch',
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Terminal Tabs */}
          <div className="terminal-tabs">
            {(['about', 'skills', 'projects', 'socials'] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm ${
                    activeTab === tab
                      ? 'text-accent-primary border-b-2 border-accent-primary'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Resize Handles */}
        {/* Top */}
        <div
          className="resize-handle"
          onMouseDown={onMouseDownResize('top')}
          style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '10px',
            cursor: 'n-resize',
            zIndex: 10,
          }}
        ></div>

        {/* Right */}
        <div
          className="resize-handle"
          onMouseDown={onMouseDownResize('right')}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-5px',
            transform: 'translateY(-50%)',
            width: '10px',
            height: '100%',
            cursor: 'e-resize',
            zIndex: 10,
          }}
        ></div>

        {/* Bottom */}
        <div
          className="resize-handle"
          onMouseDown={onMouseDownResize('bottom')}
          style={{
            position: 'absolute',
            bottom: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '10px',
            cursor: 's-resize',
            zIndex: 10,
          }}
        ></div>

        {/* Left */}
        <div
          className="resize-handle"
          onMouseDown={onMouseDownResize('left')}
          style={{
            position: 'absolute',
            top: '50%',
            left: '-5px',
            transform: 'translateY(-50%)',
            width: '10px',
            height: '100%',
            cursor: 'w-resize',
            zIndex: 10,
          }}
        ></div>

        {/* Top-Right */}
        <div
          className="resize-handle"
          onMouseDown={onMouseDownResize('top-right')}
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '15px',
            height: '15px',
            cursor: 'ne-resize',
            zIndex: 10,
          }}
        ></div>

        {/* Bottom-Right */}
        <div
          className="resize-handle"
          onMouseDown={onMouseDownResize('bottom-right')}
          style={{
            position: 'absolute',
            bottom: '-5px',
            right: '-5px',
            width: '15px',
            height: '15px',
            cursor: 'se-resize',
            zIndex: 10,
          }}
        ></div>

        {/* Bottom-Left */}
        <div
          className="resize-handle"
          onMouseDown={onMouseDownResize('bottom-left')}
          style={{
            position: 'absolute',
            bottom: '-5px',
            left: '-5px',
            width: '15px',
            height: '15px',
            cursor: 'sw-resize',
            zIndex: 10,
          }}
        ></div>

        {/* Top-Left */}
        <div
          className="resize-handle"
          onMouseDown={onMouseDownResize('top-left')}
          style={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            width: '15px',
            height: '15px',
            cursor: 'nw-resize',
            zIndex: 10,
          }}
        ></div>
      </div>
    </div>
  );
}