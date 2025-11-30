import React, { useState, useEffect } from 'react';
import { CORRECT_PASSWORD, PASSWORD_PROMPT } from '../constants';

interface PasswordScreenProps {
  onUnlock: () => void;
}

const PasswordScreen: React.FC<PasswordScreenProps> = ({ onUnlock }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handlePress = (val: string) => {
    if (input.length < 6) {
      setInput(prev => prev + val);
    }
  };

  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (input === CORRECT_PASSWORD) {
      setIsSuccess(true);
      // Wait for animation to finish before unmounting/changing state in parent
      setTimeout(() => {
        onUnlock();
      }, 1000); 
    } else {
      setError(true);
      setInput("");
    }
  };

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fdfbf7] transition-all duration-[1200ms] ease-in-out ${
        isSuccess ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
      }`}
    >
      <div className={`flex flex-col items-center w-full max-w-md px-6 ${error ? 'shake' : ''}`}>
        <h1 className="text-3xl md:text-4xl text-stone-700 font-['quicksand'] mb-8 text-center">
          {PASSWORD_PROMPT}
        </h1>

        {/* Display Slots */}
        <div className="flex gap-3 mb-4">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="w-8 h-12 flex items-center justify-center border-b-2 border-stone-300 text-2xl font-bold text-stone-700"
            >
              {input[i] || ""}
            </div>
          ))}
        </div>

        {error && (
          <p className="text-rose-500 text-sm h-6 font-semibold animate-pulse mb-4">
            Try again love.
          </p>
        )}
        {!error && <div className="h-6 mb-4" />}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="h-16 w-16 rounded-full bg-white shadow-sm border border-stone-100 text-xl font-['Quicksand'] font-medium text-stone-600 active:bg-stone-100 active:scale-95 transition-all mx-auto flex items-center justify-center hover:bg-stone-50"
            >
              {num}
            </button>
          ))}
          
          <button
            onClick={handleBackspace}
            className="h-16 w-16 rounded-full bg-stone-100 text-stone-500 active:scale-95 transition-all mx-auto flex items-center justify-center hover:bg-stone-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12l-2.25 2.25m-4.288-2.25h.008v.008h-.008v-.008zm1.944 0h.008v.008h-.008v-.008zm-2.4 0h.008v.008h-.008v-.008z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5h8.25a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H12a.75.75 0 01-.53-.22L3.53 12.22a.75.75 0 010-1.06l7.94-7.94A.75.75 0 0112 4.5z" />
            </svg>
          </button>
          
          <button
            onClick={() => handlePress( "0")}
            className="h-16 w-16 rounded-full bg-white shadow-sm border border-stone-100 text-xl font-['Quicksand'] font-medium text-stone-600 active:bg-stone-100 active:scale-95 transition-all mx-auto flex items-center justify-center hover:bg-stone-50"
          >
            0
          </button>

          <button
            onClick={handleConfirm}
            // Using arbitrary values for the pink color: #FFAFCC
            className="h-16 w-16 rounded-full bg-[#FFAFCC] text-white active:scale-95 transition-all mx-auto flex items-center justify-center shadow-md shadow-rose-100 hover:opacity-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordScreen;