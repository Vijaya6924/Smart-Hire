import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, ArrowRight, Github, Linkedin, Chrome } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function AuthPage({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success) {
        if (isLogin) {
          login(data.user);
          onAuthSuccess?.();
        } else {
          setIsLogin(true);
          alert('Signup successful! Please login.');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white overflow-hidden">
        {/* Left Side - Visual */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-indigo-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-bold text-2xl mb-8">S</div>
            <h1 className="text-5xl font-bold leading-tight">Elevate Your Career with SmartHire.</h1>
            <p className="mt-6 text-indigo-100 text-lg max-w-md">The enterprise-grade platform for jobs, assessments, and AI-driven skill matching.</p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-10 h-10 rounded-full border-2 border-indigo-600" referrerPolicy="no-referrer" />
              ))}
            </div>
            <p className="text-sm text-indigo-100 font-medium">Joined by 10k+ professionals this month</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 lg:p-16">
          <div className="max-w-md mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-slate-500 mt-2">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-indigo-600 font-bold hover:underline"
                >
                  {isLogin ? 'Sign up for free' : 'Log in here'}
                </button>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 98765 43210"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      value={formData.mobile}
                      onChange={e => setFormData({...formData, mobile: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  {isLogin && <button type="button" className="text-xs font-bold text-indigo-600 hover:underline">Forgot Password?</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <span className="relative px-4 bg-white text-slate-400 text-xs font-bold uppercase tracking-wider">Or continue with</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Chrome, label: 'Google' },
                  { icon: Linkedin, label: 'LinkedIn' },
                  { icon: Github, label: 'GitHub' },
                ].map((social) => (
                  <button key={social.label} className="flex items-center justify-center py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                    <social.icon size={20} className="text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
