import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, AlertCircle, CheckCircle2, Shield, Monitor, Camera } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface AssessmentModuleProps {
  title: string;
  duration: number; // in minutes
  onComplete: (score: number) => void;
}

export default function AssessmentModule({ title, duration, onComplete }: AssessmentModuleProps) {
  const [step, setStep] = useState<'instructions' | 'exam' | 'result' | 'feedback'>('instructions');
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isAgreed, setIsAgreed] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [feedback, setFeedback] = useState({ rating: 5, difficulty: 'Medium', comments: '' });

  const questions: Question[] = [
    { id: 1, text: "What is the primary purpose of React's useEffect hook?", options: ["Managing state", "Handling side effects", "Optimizing performance", "Creating components"] },
    { id: 2, text: "Which of the following is NOT a valid Tailwind CSS utility?", options: ["bg-red-500", "p-4", "flex-center", "rounded-xl"] },
    { id: 3, text: "In Node.js, what does the 'fs' module stand for?", options: ["Fast Storage", "File System", "Function Stream", "Format String"] },
    { id: 4, text: "What is the virtual DOM in React?", options: ["A direct copy of the real DOM", "A lightweight representation of the real DOM", "A server-side rendering tool", "A database for React state"] },
    { id: 5, text: "Which command is used to initialize a new Node.js project?", options: ["node init", "npm start", "npm init", "node start"] },
  ];

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && step === 'exam') {
        setTabSwitches(prev => prev + 1);
        alert('Warning: Tab switching is prohibited. This incident has been logged.');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [step]);

  useEffect(() => {
    let timer: any;
    if (step === 'exam' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 'exam') {
      setStep('result');
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFinish = () => {
    setStep('result');
  };

  const handleFeedbackSubmit = () => {
    const score = (Object.keys(answers).length / questions.length) * 100;
    onComplete(score);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-[70] flex flex-col">
      {/* Header */}
      <div className="h-16 bg-slate-800 border-b border-slate-700 px-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <Shield className="text-emerald-400" size={20} />
          <span className="font-bold">{title}</span>
        </div>
        {step === 'exam' && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <AlertCircle size={14} /> Tab Switches: {tabSwitches}
            </div>
            <div className="flex items-center gap-3 bg-slate-700 px-4 py-1.5 rounded-lg border border-slate-600">
              <Timer size={18} className={timeLeft < 60 ? 'text-red-400' : 'text-slate-300'} />
              <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-900">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {step === 'instructions' && (
                <motion.div 
                  key="instructions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-slate-300 space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white">Assessment Instructions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Duration</p>
                      <p className="text-lg font-bold text-white">{duration} Minutes</p>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Questions</p>
                      <p className="text-lg font-bold text-white">{questions.length} MCQs</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">Rules & Regulations</h3>
                    <ul className="space-y-3">
                      <li className="flex gap-3 text-sm"><CheckCircle2 className="text-emerald-400 shrink-0" size={18} /> Do not refresh the page during the assessment.</li>
                      <li className="flex gap-3 text-sm"><CheckCircle2 className="text-emerald-400 shrink-0" size={18} /> Tab switching or minimizing the window will be flagged.</li>
                      <li className="flex gap-3 text-sm"><CheckCircle2 className="text-emerald-400 shrink-0" size={18} /> Ensure a stable internet connection and quiet environment.</li>
                      <li className="flex gap-3 text-sm"><CheckCircle2 className="text-emerald-400 shrink-0" size={18} /> The assessment will auto-submit when the timer reaches zero.</li>
                    </ul>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-700">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-500"
                        checked={isAgreed}
                        onChange={e => setIsAgreed(e.target.checked)}
                      />
                      <span className="text-sm group-hover:text-white transition-colors">I have read and agree to the instructions and confirm that I am ready to begin.</span>
                    </label>
                  </div>

                  <button 
                    disabled={!isAgreed}
                    onClick={() => setStep('exam')}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
                  >
                    Start Exam
                  </button>
                </motion.div>
              )}

              {step === 'exam' && (
                <motion.div 
                  key="exam"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Question {currentQuestion + 1} of {questions.length}</span>
                    <div className="h-2 w-48 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-8 leading-relaxed">{questions[currentQuestion].text}</h3>
                    <div className="space-y-4">
                      {questions[currentQuestion].options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => setAnswers({...answers, [questions[currentQuestion].id]: i})}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                            answers[questions[currentQuestion].id] === i 
                              ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                              : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500'
                          }`}
                        >
                          <span>{option}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            answers[questions[currentQuestion].id] === i ? 'border-white bg-white' : 'border-slate-500'
                          }`}>
                            {answers[questions[currentQuestion].id] === i && <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button 
                      disabled={currentQuestion === 0}
                      onClick={() => setCurrentQuestion(q => q - 1)}
                      className="px-6 py-3 text-slate-400 font-bold hover:text-white disabled:opacity-30 transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex gap-2">
                      {questions.map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => setCurrentQuestion(i)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                            currentQuestion === i ? 'bg-indigo-600 text-white' : 
                            answers[questions[i].id] !== undefined ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    {currentQuestion === questions.length - 1 ? (
                      <button 
                        onClick={handleFinish}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20"
                      >
                        Submit Exam
                      </button>
                    ) : (
                      <button 
                        onClick={() => setCurrentQuestion(q => q + 1)}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/20"
                      >
                        Next Question
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 'result' && (
                <motion.div 
                  key="result"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-slate-800 p-12 rounded-[2.5rem] border border-slate-700 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Exam Submitted!</h2>
                  <p className="text-slate-400">Your assessment has been successfully recorded. Here is your performance summary.</p>
                  
                  <div className="py-8 grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 p-6 rounded-2xl border border-slate-600">
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Final Score</p>
                      <p className="text-4xl font-bold text-white mt-2">{(Object.keys(answers).length / questions.length) * 100}%</p>
                    </div>
                    <div className="bg-slate-700/50 p-6 rounded-2xl border border-slate-600">
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Status</p>
                      <p className="text-4xl font-bold text-emerald-400 mt-2">PASS</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep('feedback')}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all"
                  >
                    Provide Feedback
                  </button>
                </motion.div>
              )}

              {step === 'feedback' && (
                <motion.div 
                  key="feedback"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 p-10 rounded-[2.5rem] border border-slate-700 space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">Share Your Feedback</h2>
                    <p className="text-slate-500 mt-2">Help us improve the assessment experience.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase mb-3">User Experience Rating</label>
                      <div className="flex gap-4 justify-center">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button 
                            key={num}
                            onClick={() => setFeedback({...feedback, rating: num})}
                            className={`w-12 h-12 rounded-xl font-bold transition-all ${feedback.rating === num ? 'bg-indigo-600 text-white scale-110' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase mb-3">Exam Difficulty</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Easy', 'Medium', 'Hard'].map(diff => (
                          <button 
                            key={diff}
                            onClick={() => setFeedback({...feedback, difficulty: diff})}
                            className={`py-3 rounded-xl font-bold transition-all ${feedback.difficulty === diff ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase mb-3">Comments</label>
                      <textarea 
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-32 resize-none"
                        placeholder="Tell us about your experience..."
                        value={feedback.comments}
                        onChange={e => setFeedback({...feedback, comments: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleFeedbackSubmit}
                    className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all"
                  >
                    Submit & Finish
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Proctoring Sidebar */}
        {step === 'exam' && (
          <div className="w-64 bg-slate-800 border-l border-slate-700 p-4 space-y-6 hidden lg:block">
            <div className="aspect-video bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center relative overflow-hidden">
              <Camera size={24} className="text-slate-700" />
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-white font-bold uppercase tracking-wider">Live Proctoring</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-2"><Monitor size={14} /> Screen Sharing</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-2"><Camera size={14} /> Face Detection</span>
                  <span className="text-emerald-400 font-bold">Verified</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-[10px] text-amber-500 font-bold leading-relaxed">
                WARNING: Do not exit full-screen mode or switch tabs. Any such activity will be flagged.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
