import React from 'react';
import Terminal from './components/Terminal';
import { useTheme } from './hooks/useTheme';
import './styles/themes.css';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`bg-gradient-${theme} w-screen h-screen`}>
      <Terminal theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;