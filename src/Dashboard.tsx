import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  ClipboardCheck, 
  FileText, 
  User as UserIcon, 
  Bell, 
  LogOut, 
  Search, 
  Menu, 
  X,
  Sun,
  Moon,
  ChevronRight,
  TrendingUp,
  Users,
  Building2,
  Calendar,
  Shield,
  Timer,
  MapPin,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './AuthContext';
import { Job, Application } from './types';

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, onAuthRequired }: any) => {
  const { logout, user } = useAuth();
  
  const menuItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard, protected: false },
    { id: 'jobs', label: 'Job Profiles', icon: Briefcase, protected: false },
    { id: 'assessments', label: 'Assessment', icon: ClipboardCheck, protected: true },
    { id: 'applications', label: 'My Applications', icon: FileText, protected: true },
    { id: 'profile', label: 'My Profile', icon: UserIcon, protected: true },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: Shield, protected: true }] : []),
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 260 : 0, opacity: isOpen ? 1 : 0 }}
      className="fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-50 overflow-hidden"
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
          <span className="text-xl font-bold text-slate-900">SmartHire</span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.protected && !user) {
                  onAuthRequired();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-600 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {user ? (
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all mt-auto"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        ) : (
          <button 
            onClick={onAuthRequired}
            className="flex items-center gap-3 px-4 py-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all mt-auto font-bold"
          >
            <UserIcon size={20} />
            <span>Login / Sign Up</span>
          </button>
        )}
      </div>
    </motion.aside>
  );
};

const Header = ({ toggleSidebar, user, onAuthRequired }: any) => {
  const [isDark, setIsDark] = useState(false);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
          <Menu size={24} />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search jobs, assessments..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl w-64 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-600"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        {user ? (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {user?.name?.[0]}
            </div>
          </div>
        ) : (
          <div className="pl-4 border-l border-slate-200">
            <button 
              onClick={onAuthRequired}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

import JobApplicationForm from './JobApplicationForm';
import AssessmentModule from './AssessmentModule';

// --- Views ---

const AssessmentView = () => {
  const [isExamStarted, setIsExamStarted] = useState(false);

  if (isExamStarted) {
    return <AssessmentModule title="React Developer Assessment" duration={30} onComplete={(score) => console.log('Score:', score)} />;
  }

  const assessments = [
    { id: 1, title: 'Frontend Developer Assessment', duration: 30, questions: 5, difficulty: 'Medium', tags: ['React', 'CSS', 'JS'] },
    { id: 2, title: 'Backend Logic Test', duration: 45, questions: 10, difficulty: 'Hard', tags: ['Node.js', 'SQL'] },
    { id: 3, title: 'UI/UX Design Principles', duration: 20, questions: 15, difficulty: 'Easy', tags: ['Figma', 'UX'] },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Available Assessments</h1>
        <p className="text-slate-500 mt-1">Complete these assessments to improve your profile visibility.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <div key={assessment.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col group">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ClipboardCheck size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                assessment.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                assessment.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
              }`}>
                {assessment.difficulty}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">{assessment.title}</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {assessment.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">#{tag}</span>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span className="flex items-center gap-2"><Timer size={16} /> {assessment.duration} mins</span>
                <span className="flex items-center gap-2"><Briefcase size={16} /> {assessment.questions} Qs</span>
              </div>
              <button 
                onClick={() => setIsExamStarted(true)}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all group-hover:bg-indigo-600"
              >
                Start Assessment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HomeView = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8">
      <div className="relative h-72 rounded-[2.5rem] overflow-hidden bg-slate-900 flex items-center px-12">
        <div className="absolute inset-0 opacity-40">
          <img src="https://picsum.photos/seed/tech/1200/400" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-xl">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Welcome back, {user?.name || 'Guest'}! 🚀
          </h1>
          <p className="text-slate-300 mt-3 text-lg">
            Your journey to the perfect job starts here. Explore opportunities and showcase your skills.
          </p>
          <div className="mt-8 flex gap-4">
            <button 
              onClick={() => setActiveTab('jobs')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
            >
              Browse Jobs
            </button>
            <button 
              onClick={() => setActiveTab('assessments')}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all"
            >
              Take Assessment
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { id: 'applications', label: 'Applied Jobs', value: '12', icon: Briefcase, color: 'bg-blue-500' },
          { id: 'assessments', label: 'Assessments', value: '04', icon: ClipboardCheck, color: 'bg-emerald-500' },
          { id: 'interviews', label: 'Interviews', value: '02', icon: Calendar, color: 'bg-amber-500' },
          { id: 'profile', label: 'Profile Views', value: '156', icon: TrendingUp, color: 'bg-indigo-500' },
        ].map((stat, i) => (
          <button 
            key={i} 
            onClick={() => setActiveTab(stat.id)}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group text-left"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Application Status</h3>
            <button 
              onClick={() => setActiveTab('applications')}
              className="text-indigo-600 text-sm font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[
              { company: 'Google', role: 'UX Designer', status: 'Shortlisted', date: '2 days ago' },
              { company: 'Meta', role: 'Product Manager', status: 'Under Review', date: '5 days ago' },
              { company: 'Netflix', role: 'Frontend Lead', status: 'Rejected', date: '1 week ago' },
            ].map((app, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{app.role}</p>
                    <p className="text-xs text-slate-500">{app.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    app.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-600' :
                    app.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {app.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{app.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Upcoming Assessments</h3>
          <div className="space-y-4">
            {[
              { title: 'React Advanced Quiz', time: 'Tomorrow, 10:00 AM', duration: '45 mins' },
              { title: 'System Design Round', time: 'Mar 15, 02:00 PM', duration: '60 mins' },
            ].map((exam, i) => (
              <div key={i} className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                <p className="font-semibold text-indigo-900">{exam.title}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-indigo-600">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {exam.time}</span>
                  <span className="flex items-center gap-1"><TrendingUp size={12} /> {exam.duration}</span>
                </div>
                <button 
                  onClick={() => setActiveTab('assessments')}
                  className="w-full mt-4 bg-white text-indigo-600 py-2 rounded-lg text-sm font-bold border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all"
                >
                  Prepare Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ApplicationsView = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([
    { id: 1, user_id: 1, job_id: 101, job_role: 'Frontend Developer', company_name: 'Google', created_at: '2024-03-01T10:00:00Z', status: 'Shortlisted' },
    { id: 2, user_id: 1, job_id: 102, job_role: 'UI/UX Designer', company_name: 'Meta', created_at: '2024-02-15T14:30:00Z', status: 'Under Review' },
    { id: 3, user_id: 1, job_id: 103, job_role: 'Full Stack Engineer', company_name: 'Amazon', created_at: '2024-01-20T09:15:00Z', status: 'Rejected' },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      // In a real app, we'd fetch here
      // fetch(`/api/applications/${user?.id}`)
      //   .then(res => res.json())
      //   .then(data => {
      //     if (data.length > 0) setApps(data);
      //     setLoading(false);
      //   });
    }
  }, [user?.id]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
        <p className="text-slate-500 mt-1">Track the status of your job applications.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Job Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applied Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">Loading applications...</td></tr>
            ) : apps.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">No applications found.</td></tr>
            ) : apps.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-6 py-4 font-semibold text-slate-900">{app.job_role}</td>
                <td className="px-6 py-4 text-slate-600">{app.company_name}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{new Date(app.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    app.status === 'Selected' ? 'bg-emerald-50 text-emerald-600' :
                    app.status === 'Shortlisted' ? 'bg-indigo-50 text-indigo-600' :
                    app.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-indigo-600 font-bold text-sm hover:underline">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProfileView = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal information and account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                <p className="font-semibold text-slate-900">{user?.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                <p className="font-semibold text-slate-900">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Mobile Number</label>
                <p className="font-semibold text-slate-900">{user?.mobile || 'Not provided'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Location</label>
                <p className="font-semibold text-slate-900">Bangalore, India</p>
              </div>
            </div>
            <button 
              onClick={() => alert('Edit profile feature coming soon!')}
              className="mt-8 text-indigo-600 font-bold text-sm hover:underline"
            >
              Edit Information
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Experience & Skills</h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-3">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold mx-auto mb-4">
              {user?.name?.[0]}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
            <p className="text-slate-500 text-sm">Full Stack Developer</p>
            <button 
              onClick={() => alert('Photo upload feature coming soon!')}
              className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              Upload New Photo
            </button>
          </div>

          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <h4 className="text-red-900 font-bold text-sm">Danger Zone</h4>
            <p className="text-red-600 text-xs mt-1">Once you delete your account, there is no going back. Please be certain.</p>
            <button 
              onClick={() => alert('Account deletion requires confirmation. Please contact support.')}
              className="mt-4 text-red-600 font-bold text-sm hover:underline"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminView = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage jobs, assessments, and candidates.</p>
        </div>
        <button 
          onClick={() => alert('Job creation form coming soon!')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          + Add New Job
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[
          { label: 'Total Candidates', value: '1,284', trend: '+12%', icon: Users },
          { label: 'Active Jobs', value: '42', trend: '+5', icon: Briefcase },
          { label: 'Pending Reviews', value: '156', trend: '-8%', icon: FileText },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <stat.icon size={20} />
              </div>
              <span className="text-xs font-bold text-emerald-500">{stat.trend}</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Recent Applications</h3>
          <button className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Job Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Score</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[
              { name: 'Alice Smith', role: 'Frontend Dev', score: '92%', status: 'Shortlisted' },
              { name: 'Bob Johnson', role: 'Backend Dev', score: '78%', status: 'Under Review' },
              { name: 'Charlie Brown', role: 'UI Designer', score: '85%', status: 'Shortlisted' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-all">
                <td className="px-6 py-4 font-semibold text-slate-900">{row.name}</td>
                <td className="px-6 py-4 text-slate-600">{row.role}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: row.score }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{row.score}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    row.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => alert(`Reviewing application for ${row.name}`)}
                      className="text-indigo-600 font-bold text-sm hover:underline"
                    >
                      Review
                    </button>
                    <button 
                      onClick={() => alert(`Running AI screening for ${row.name}`)}
                      className="text-emerald-600 font-bold text-sm hover:underline flex items-center gap-1"
                    >
                      <Shield size={14} /> AI Screen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const JobsView = ({ onApply }: { onApply: (job: Job) => void }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [zone, setZone] = useState<'IT' | 'Non-IT' | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: '',
    workMode: '',
    location: ''
  });

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      });
  }, []);

  if (!zone) {
    return (
      <div className="space-y-12 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Interest Zone</h1>
          <p className="text-slate-500 text-lg">Select a sector to explore currently hiring companies and job openings.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            { id: 'IT', title: 'IT & Software', desc: 'Software Development, AI, Cloud, Data Science', icon: Shield, color: 'bg-indigo-600' },
            { id: 'Non-IT', title: 'Non-IT & Core', desc: 'Manufacturing, Finance, HR, Sales, Marketing', icon: Building2, color: 'bg-emerald-600' }
          ].map(z => (
            <button 
              key={z.id}
              onClick={() => setZone(z.id as any)}
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all text-left"
            >
              <div className={`w-16 h-16 ${z.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                <z.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{z.title}</h3>
              <p className="text-slate-500">{z.desc}</p>
              <div className="mt-8 flex items-center gap-2 text-indigo-600 font-bold">
                Explore Jobs <ChevronRight size={20} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const companies = Array.from(new Set(jobs.filter(j => j.zone === zone).map(j => j.company_name))).map(name => {
    const job = jobs.find(j => j.company_name === name);
    return { name, logo: job?.company_logo, role: job?.role, location: job?.location, workMode: job?.work_mode };
  });

  const filteredJobs = jobs.filter(j => 
    j.zone === zone && 
    (!selectedCompany || j.company_name === selectedCompany) &&
    (!filters.role || j.role.toLowerCase().includes(filters.role.toLowerCase())) &&
    (!filters.workMode || j.work_mode === filters.workMode) &&
    (!filters.location || j.location.toLowerCase().includes(filters.location.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => { setZone(null); setSelectedCompany(null); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
            <Menu size={20} className="rotate-180" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{selectedCompany || (zone === 'IT' ? 'IT Jobs' : 'Non-IT Jobs')}</h1>
            <p className="text-slate-500 mt-1">
              {selectedCompany ? `Available openings at ${selectedCompany}` : `Currently hiring companies in ${zone} sector`}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setFilters({...filters, workMode: e.target.value})}
          >
            <option value="">All Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
          <input 
            type="text"
            placeholder="Filter by role..."
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setFilters({...filters, role: e.target.value})}
          />
        </div>
      </div>

      {!selectedCompany ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, i) => (
            <button 
              key={i}
              onClick={() => setSelectedCompany(company.name)}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-4 mb-6">
                <img src={company.logo} alt={company.name} className="w-14 h-14 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{company.name}</h3>
                  <p className="text-sm text-slate-500">{company.location}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Briefcase size={14} /> Top Role: {company.role}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <TrendingUp size={14} /> Mode: {company.workMode}
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-indigo-600 font-bold text-sm">
                View Openings <ChevronRight size={16} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <motion.div 
              layout
              key={job.id} 
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src={job.company_logo} alt={job.company_name} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <h3 className="font-bold text-slate-900">{job.role}</h3>
                    <p className="text-sm text-slate-500">{job.company_name}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-bold">{job.work_mode}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Users size={16} /> <span>{job.experience}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <TrendingUp size={16} /> <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Building2 size={16} /> <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <ClipboardCheck size={16} /> <span>{job.qualification}</span>
                </div>
              </div>

              <button 
                onClick={() => onApply(job)}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all"
              >
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Dashboard ---

import AuthPage from './AuthPage';
import ChatBot from './components/ChatBot';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        onAuthRequired={handleAuthRequired}
      />
      
      <main className={`flex-1 transition-all ${isSidebarOpen ? 'ml-[260px]' : 'ml-0'}`}>
        <Header 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          user={user} 
          onAuthRequired={handleAuthRequired}
        />
        
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} />}
              {activeTab === 'jobs' && <JobsView onApply={(job) => {
                if (!user) {
                  handleAuthRequired();
                } else {
                  setApplyingJob(job);
                }
              }} />}
              {activeTab === 'assessments' && <AssessmentView />}
              {activeTab === 'applications' && <ApplicationsView />}
              {activeTab === 'profile' && <ProfileView />}
              {activeTab === 'admin' && <AdminView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden"
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-6 right-6 z-10 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={24} />
              </button>
              <div className="max-h-[90vh] overflow-y-auto">
                <AuthPage onAuthSuccess={() => setShowAuthModal(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {applyingJob && (
          <JobApplicationForm 
            job={applyingJob} 
            onClose={() => setApplyingJob(null)} 
            onSuccess={() => {
              setApplyingJob(null);
              setActiveTab('applications');
            }}
          />
        )}
      </AnimatePresence>

      <ChatBot />
    </div>
  );
}
