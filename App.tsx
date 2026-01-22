
import React, { useState, useEffect } from 'react';
import { GameState, Theme, QuizQuestion, GameScore } from './types';
import { THEMES, WORD_BANK } from './constants';
import { generateRewardImage, getCelebrationMessage } from './services/geminiService';
import { Sparkles, Trophy, RotateCcw, Volume2, Settings, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState<GameScore>({ correct: 0, total: 0 });
  const [loadingMsg, setLoadingMsg] = useState('Preparing...');
  const [celebrationMsg, setCelebrationMsg] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [apiKeyError, setApiKeyError] = useState(false);

  const speak = (text: string) => {
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const startNewGame = (theme: Theme) => {
    setSelectedTheme(theme);
    setGameState(GameState.PLAYING);
    
    // Pick 5 random words from the theme
    const themeWords = [...WORD_BANK[theme]].sort(() => Math.random() - 0.5);
    const selectedWords = themeWords.slice(0, 5);
    
    const newQuestions: QuizQuestion[] = selectedWords.map(correctWord => {
      // Get 3 wrong options from the entire word bank
      const otherWords = Object.values(WORD_BANK)
        .flat()
        .filter(w => w.word !== correctWord.word);
      const shuffledWrong = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [correctWord, ...shuffledWrong].sort(() => Math.random() - 0.5);
      
      return { correctWord, options };
    });

    setQuestions(newQuestions);
    setScore({ correct: 0, total: newQuestions.length });
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (selectedWord: string) => {
    if (isAnswering) return;
    
    setIsAnswering(true);
    const currentQ = questions[currentQuestionIndex];
    const isCorrect = selectedWord === currentQ.correctWord.word;

    // Speak the clicked word so they hear what they chose
    speak(selectedWord);

    if (isCorrect) {
      setLastFeedback('correct');
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setLastFeedback('wrong');
    }

    // Brief delay before next question
    setTimeout(() => {
      setLastFeedback(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsAnswering(false);
      } else {
        finishGame();
      }
    }, 1200);
  };

  const finishGame = async () => {
    setGameState(GameState.LOADING);
    setLoadingMsg("Well done! Checking results...");
    
    try {
      const finalCorrectCount = score.correct + (lastFeedback === 'correct' ? 1 : 0);
      
      // Get AI celebration message
      const msg = await getCelebrationMessage(finalCorrectCount, questions.length);
      setCelebrationMsg(msg);

      let reward = undefined;
      if (finalCorrectCount >= questions.length * 0.6) {
        setLoadingMsg("Magical sticker incoming...");
        reward = await generateRewardImage(selectedTheme || 'rainbow star');
      }

      setScore(prev => ({ ...prev, correct: finalCorrectCount, rewardImage: reward }));
      setGameState(GameState.RESULT);
    } catch (error: any) {
      if (error.message === "MISSING_API_KEY") {
        setApiKeyError(true);
        setGameState(GameState.MENU);
      } else {
        setGameState(GameState.RESULT);
        setCelebrationMsg("Amazing work! 繼(ㄐㄧˋ)續(ㄒㄩˋ)加(ㄐㄧㄚ)油(ㄧㄡˊ)！");
      }
    }
    setIsAnswering(false);
  };

  const renderApiKeyWarning = () => (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border-4 border-orange-200 text-center space-y-6">
        <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <Settings size={40} className="text-orange-500 animate-spin-slow" />
        </div>
        <h2 className="text-2xl font-black text-gray-800">Setup Required</h2>
        <p className="text-gray-600 text-sm font-medium">
          To enable AI rewards, please add your <code className="bg-gray-100 px-1 rounded text-red-500 font-bold">API_KEY</code> to the environment variables.
        </p>
        <button onClick={() => setApiKeyError(false)} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors">
          I'll play without AI for now
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col items-center justify-center p-4">
      {apiKeyError && renderApiKeyWarning()}

      <div className="w-full max-w-3xl bg-white rounded-[3rem] shadow-xl border-8 border-white overflow-hidden">
        {gameState === GameState.MENU && (
          <div className="p-12 flex flex-col items-center text-center space-y-12">
            <div className="space-y-2">
              <span className="bg-yellow-400 text-white px-4 py-1 rounded-full font-black text-xs">GO! GO! GO!</span>
              <h1 className="text-6xl font-black text-blue-600 tracking-tight">Vocab Hero</h1>
              <p className="text-xl text-gray-400 font-medium">Pick a topic to start learning</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
              {THEMES.map(theme => (
                <button
                  key={theme}
                  onClick={() => startNewGame(theme)}
                  className="bg-blue-50 hover:bg-yellow-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all flex flex-col items-center space-y-3 group border-4 border-transparent hover:border-white"
                >
                  <Sparkles size={32} className="text-blue-400 group-hover:text-yellow-500 group-hover:scale-125 transition-all" />
                  <span className="font-black text-lg text-blue-800">{theme}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === GameState.LOADING && (
          <div className="p-24 flex flex-col items-center space-y-8">
            <div className="w-20 h-20 border-8 border-blue-50 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-2xl font-black text-blue-600 animate-pulse">{loadingMsg}</p>
          </div>
        )}

        {gameState === GameState.PLAYING && questions.length > 0 && (
          <div className="p-10 space-y-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center">
              <div className="text-blue-300 font-black text-lg">
                STEP {currentQuestionIndex + 1} / {questions.length}
              </div>
              <div className="bg-green-500 text-white px-5 py-2 rounded-full font-black shadow-lg">
                ★ {score.correct}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-pink-50 p-8 rounded-[3.5rem] flex flex-col items-center space-y-6 relative border-4 border-white shadow-inner">
              <img 
                src={questions[currentQuestionIndex].correctWord.imageUrl} 
                alt="Prompt" 
                className="w-56 h-56 object-cover rounded-[3rem] shadow-2xl border-4 border-white"
              />
              <div className="text-center">
                <h2 className="text-6xl font-black text-gray-800 mb-2">
                  {questions[currentQuestionIndex].correctWord.translation}
                </h2>
                <div className="text-2xl font-bold text-blue-400 tracking-widest">
                  {questions[currentQuestionIndex].correctWord.zhuyin}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestionIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.word)}
                  disabled={isAnswering}
                  className={`p-6 rounded-[2rem] text-3xl font-black transition-all border-4 shadow-sm ${
                    isAnswering && option.word === questions[currentQuestionIndex].correctWord.word
                      ? 'bg-green-500 text-white border-green-200 scale-105 z-10'
                      : isAnswering && lastFeedback === 'wrong' && option.word !== questions[currentQuestionIndex].correctWord.word
                      ? 'bg-red-50 text-red-200 border-red-50 opacity-50'
                      : 'bg-white hover:bg-blue-600 hover:text-white border-gray-100 hover:border-blue-400 hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>{option.word}</span>
                    {!isAnswering && <Volume2 size={16} className="opacity-0 group-hover:opacity-100" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === GameState.RESULT && (
          <div className="p-12 flex flex-col items-center text-center space-y-10 animate-in slide-in-from-bottom duration-700">
            <div className="space-y-4">
              <div className="relative">
                <Trophy size={100} className="text-yellow-400 mx-auto" />
                <Sparkles className="absolute top-0 right-0 text-pink-400 animate-ping" />
              </div>
              <h2 className="text-5xl font-black text-gray-800 tracking-tight">Super Star!</h2>
              <div className="text-3xl font-black text-white bg-blue-600 px-10 py-3 rounded-full shadow-xl">
                {score.correct} / {score.total}
              </div>
            </div>

            <div className="max-w-md bg-white p-8 rounded-[3rem] border-4 border-blue-50 shadow-lg">
              <p className="text-2xl font-bold text-blue-700 leading-relaxed whitespace-pre-line">
                {celebrationMsg}
              </p>
            </div>

            {score.rewardImage && (
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-[3rem] shadow-xl border-4 border-white flex flex-col items-center space-y-4">
                <p className="text-pink-500 font-black tracking-widest text-sm uppercase">Unlocked Sticker</p>
                <img src={score.rewardImage} alt="Reward" className="w-48 h-48 rounded-2xl shadow-lg border-2 border-white object-cover" />
              </div>
            )}

            <button
              onClick={() => setGameState(GameState.MENU)}
              className="flex items-center space-x-3 bg-gray-800 hover:bg-black text-white px-12 py-5 rounded-full text-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              <RotateCcw size={28} />
              <span>Try Again</span>
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-blue-200 font-black text-sm uppercase tracking-widest flex items-center gap-2">
        <Sparkles size={14} /> Created with Gemini AI
      </p>
    </div>
  );
};

export default App;
