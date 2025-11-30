import React, { useState } from 'react';
import PasswordScreen from './components/PasswordScreen';
import MainScreen from './components/StickersScreen'; // MainScreen is now the unified dashboard
import MusicPlayer from './components/MusicPlayer';
import { AppStage } from './types';
import { HashRouter as Router } from 'react-router-dom';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.PASSWORD);
  const [playMusic, setPlayMusic] = useState(false);

  const handleUnlock = () => {
    setStage(AppStage.MAIN);
    setPlayMusic(true);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-cream-50 font-sans">
      
      {/* Background Music Logic */}
      <MusicPlayer shouldPlay={playMusic} />

      {/* Pages */}
      
      {/* Password Screen is always mounted but animates out */}
      <PasswordScreen onUnlock={handleUnlock} />

      {/* Main Content (Revealed after password) */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${stage === AppStage.MAIN ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}>
         {stage === AppStage.MAIN && <MainScreen isActive={true} />}
      </div>

    </div>
  );
};

export default App;