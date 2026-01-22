
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
  const [loadingMsg, setLoadingMsg] = useState('Preparing your adventure...');
  const [celebrationMsg, setCelebrationMsg] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [apiKeyError, setApiKeyError] = useState(false);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8; // Slower for kids
    window.speechSynthesis.speak(utterance);
  };

  const startNewGame = (theme: Theme) => {
    setSelectedTheme(theme);
    setGameState(GameState.PLAYING);
    
    const themeWords = [...WORD_BANK[theme]].sort(() => Math.random() - 0.5);
    const selectedWords = themeWords.slice(0, 5);
    
    const newQuestions: QuizQuestion[] = selectedWords.map(correctWord => {
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
    
    // Auto speak the first word
    setTimeout(() => speak(selectedWords[0].word), 500);
  };

  const handleAnswer = (translation: string) => {
    if (isAnswering) return;
    
    setIsAnswering(true);
    const currentQ = questions[currentQuestionIndex];
    const isCorrect = translation === currentQ.correctWord.translation;

    if (isCorrect) {
      setLastFeedback('correct');
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setLastFeedback('wrong');
    }

    setTimeout(() => {
      setLastFeedback(null);
      if (currentQuestionIndex < questions.length - 1) {
        const nextIdx = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIdx);
        setIsAnswering(false);
        speak(questions[nextIdx].correctWord.word);
      } else {
        finishGame();
      }
    }, 1500);
  };

  const finishGame = async () => {
    setGameState(GameState.LOADING);
    setLoadingMsg("Calculating your score...");
    
    try {
      const finalCorrectCount = score.correct + (lastFeedback === 'correct' ? 1 : 0);
      const msg = await getCelebrationMessage(finalCorrectCount, questions.length);
      setCelebrationMsg(msg);

      let reward = undefined;
      if (finalCorrectCount >= questions.length * 0.6) {
        setLoadingMsg("Creating a magic sticker for you...");
        reward = await generateRewardImage(selectedTheme || 'star');
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
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border-4 border-blue-100 flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-300">
        <div className="bg-orange-100 p-5 rounded-full">
          <Settings size={48} className="text-orange-500 animate-[spin_4s_linear_infinite]" />
        </div>
        <h2 className="text-3xl font-black text-gray-800">API Key Missing</h2>
        <div className="bg-blue-50 p-6 rounded-3xl text-left w-full space-y-3 border border-blue-100">
          <p className="text-sm font-bold text-blue-900 underline">How to fix in Vercel:</p>
          <p className="text-sm text-blue-800">1. Go to Project Settings > Environment Variables</p>
          <p className="text-sm text-blue-800">2. Key: <b>API_KEY</b></p>
          <p className="text-sm text-blue-800">3. Value: <b>(Paste your Gemini Key)</b></p>
          <p className="text-sm text-blue-800">4. Go to Deployments > <b>Redeploy</b></p>
        </div>
        <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold flex items-center">Get Key <ExternalLink size={14} className="ml-1" /></a>
        <button onClick={() => setApiKeyError(false)} className="text-gray-400 font-bold">Close</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCF0] flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      {apiKeyError && renderApiKeyWarning()}

      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white relative">
        {gameState === GameState.MENU && (
          <div className="p-12 flex flex-col items-center text-center space-y-12">
            <div className="space-y-4">
              <div className="bg-yellow-400 text-white px-6 py-2 rounded-full font-black tracking-widest text-sm inline-block shadow-md">LEVEL 1</div>
              <h1 className="text-6xl font-black text-blue-600">English Adventure</h1>
              <p className="text-xl text-gray-400 font-medium italic">Learning is fun!</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
              {THEMES.map(theme => (
                <button
                  key={theme}
                  onClick={() => startNewGame(theme)}
                  className="bg-white hover:bg-yellow-50 p-6 rounded-[2rem] shadow-lg border-2 border-transparent hover:border-yellow-200 transition-all flex flex-col items-center space-y-4 group"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-yellow-100 group-hover:text-yellow-600 transition-colors">
                    <Sparkles size={32} />
                  </div>
                  <span className="font-bold text-lg">{theme}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === GameState.LOADING && (
          <div className="p-20 flex flex-col items-center space-y-8 animate-pulse">
            <div className="w-24 h-24 border-8 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-2xl font-bold text-blue-600">{loadingMsg}</p>
          </div>
        )}

        {gameState === GameState.PLAYING && questions.length > 0 && (
          <div className="p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div className="bg-blue-50 px-6 py-2 rounded-full font-bold text-blue-400">
                Question {currentQuestionIndex + 1} / {questions.length}
              </div>
              <div className="bg-green-500 px-6 py-2 rounded-full font-bold text-white shadow-lg">
                ★ {score.correct}
              </div>
            </div>

            <div className="bg-gradient-to-b from-blue-50 to-white p-8 rounded-[3rem] border-4 border-blue-100 flex flex-col items-center space-y-6 relative overflow-hidden">
              <div className="relative group">
                <img 
                  src={questions[currentQuestionIndex].correctWord.imageUrl} 
                  alt="Quiz Item" 
                  className="w-64 h-64 object-cover rounded-[2.5rem] shadow-xl border-4 border-white transition-transform group-hover:scale-105"
                />
                <button 
                  onClick={() => speak(questions[currentQuestionIndex].correctWord.word)}
                  className="absolute -bottom-4 -right-4 bg-yellow-400 p-4 rounded-2xl shadow-lg text-white hover:scale-110 active:scale-95 transition-all"
                >
                  <Volume2 size={32} fill="currentColor" />
                </button>
              </div>
              <div className="text-center space-y-1">
                <p className="text-7xl md:text-8xl font-black text-blue-600 tracking-tight">
                  {questions[currentQuestionIndex].correctWord.word}
                </p>
                <p className="text-gray-300 font-bold uppercase tracking-[0.3em]">LISTEN & MATCH</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestionIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.translation)}
                  disabled={isAnswering}
                  className={`p-6 rounded-[2rem] text-3xl font-black transition-all border-4 shadow-md ${
                    isAnswering && option.translation === questions[currentQuestionIndex].correctWord.translation
                      ? 'bg-green-500 text-white border-green-200 scale-105'
                      : isAnswering && lastFeedback === 'wrong' && option.translation !== questions[currentQuestionIndex].correctWord.translation
                      ? 'bg-red-100 text-red-300 border-red-50'
                      : 'bg-white hover:bg-blue-50 text-gray-700 border-gray-100 hover:border-blue-300'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span>{option.translation}</span>
                    <span className="text-lg font-medium opacity-60 mt-1">{option.zhuyin}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === GameState.RESULT && (
          <div className="p-12 flex flex-col items-center text-center space-y-10 animate-in slide-in-from-bottom duration-700">
            <div className="space-y-4">
              <Trophy size={100} className="text-yellow-400 mx-auto animate-bounce" />
              <h2 className="text-5xl font-black text-gray-800">Well Done!</h2>
              <div className="text-4xl font-black text-blue-600 bg-blue-50 px-8 py-3 rounded-full inline-block">
                {score.correct} / {score.total}
              </div>
            </div>

            <div className="max-w-md bg-purple-50 p-8 rounded-[2.5rem] border-2 border-purple-100 relative">
              <p className="text-2xl font-bold text-purple-600 leading-relaxed whitespace-pre-line">
                {celebrationMsg}
              </p>
            </div>

            {score.rewardImage && (
              <div className="bg-white p-6 rounded-[3rem] shadow-2xl border-4 border-pink-100 flex flex-col items-center space-y-4">
                <p className="text-pink-500 font-black tracking-widest text-sm">MAGIC REWARD UNLOCKED</p>
                <img src={score.rewardImage} alt="Magic Sticker" className="w-56 h-56 rounded-3xl shadow-lg border-4 border-white object-cover" />
              </div>
            )}

            <button
              onClick={() => setGameState(GameState.MENU)}
              className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full text-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <RotateCcw size={28} />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-gray-300 font-bold flex items-center space-x-2">
        <Sparkles size={16} />
        <span>Gemini AI Learning Buddy</span>
      </div>
    </div>
  );
};

export default App;
