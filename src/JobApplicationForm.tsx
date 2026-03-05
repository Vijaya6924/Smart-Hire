import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, GraduationCap, Upload, Camera, Mic, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Job } from './types';

interface JobApplicationFormProps {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

export default function JobApplicationForm({ job, onClose, onSuccess }: JobApplicationFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    qualification: '',
    university: '',
    passing_year: '',
    skills: '',
    certifications: '',
    resume: null as File | null,
    photo: null as string | null,
    signature: null as string | null,
    voice: null as string | null,
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    // Mock submission
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Applying for {job.role}</h2>
            <p className="text-slate-500 text-sm mt-1">Step {step} of 3: {
              step === 1 ? 'Personal Details' : step === 2 ? 'Educational Details' : 'Verification'
            }</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-all">
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
            className="h-full bg-indigo-600"
          />
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.full_name}
                      onChange={e => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Date of Birth</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.dob}
                      onChange={e => setFormData({...formData, dob: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Gender</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.gender}
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Current Address</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Highest Qualification</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bachelor of Technology"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.qualification}
                      onChange={e => setFormData({...formData, qualification: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">University / College</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.university}
                      onChange={e => setFormData({...formData, university: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Year of Passing</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.passing_year}
                      onChange={e => setFormData({...formData, passing_year: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Skills (Comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="React, Node.js, TypeScript"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.skills}
                      onChange={e => setFormData({...formData, skills: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Certifications</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.certifications}
                      onChange={e => setFormData({...formData, certifications: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Resume (PDF)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept=".pdf"
                        className="hidden" 
                        id="resume-upload"
                        onChange={e => setFormData({...formData, resume: e.target.files?.[0] || null})}
                      />
                      <label htmlFor="resume-upload" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                        <Upload size={18} className="text-slate-400" />
                        <span className="text-sm text-slate-600 font-medium">{formData.resume ? formData.resume.name : 'Upload Resume'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700">Live Photo</label>
                    <div className="aspect-square bg-slate-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 relative overflow-hidden">
                      {formData.photo ? (
                        <img src={formData.photo} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera size={32} className="text-slate-300 mb-2" />
                          <button 
                            onClick={() => setFormData({...formData, photo: 'https://picsum.photos/seed/user/400/400'})}
                            className="text-[10px] font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-lg shadow-sm"
                          >
                            Capture
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700">Digital Signature</label>
                    <div className="aspect-square bg-slate-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 relative overflow-hidden">
                      {formData.signature ? (
                        <div className="p-4 italic font-serif text-2xl text-slate-800">{formData.signature}</div>
                      ) : (
                        <>
                          <Upload size={32} className="text-slate-300 mb-2" />
                          <button 
                            onClick={() => setFormData({...formData, signature: formData.full_name})}
                            className="text-[10px] font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-lg shadow-sm"
                          >
                            Sign Now
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700">Voice Verification</label>
                    <div className="aspect-square bg-slate-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                      <Mic size={32} className="text-slate-300 mb-2" />
                      <button className="text-[10px] font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                        Record
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500" />
                  <p className="text-xs text-indigo-900 leading-relaxed">
                    I hereby declare that all the information provided above is true to the best of my knowledge. I understand that any false information may lead to disqualification.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button 
            onClick={step === 1 ? onClose : prevStep}
            className="px-6 py-3 text-slate-600 font-bold hover:bg-white rounded-xl transition-all"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button 
            onClick={step === 3 ? handleSubmit : nextStep}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
          >
            {step === 3 ? 'Submit Application' : 'Next Step'}
            <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
