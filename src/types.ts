export interface User {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  role: 'user' | 'admin';
}

export interface Job {
  id: number;
  company_id: number;
  company_name: string;
  company_logo: string;
  zone: 'IT' | 'Non-IT';
  role: string;
  location: string;
  salary: string;
  experience: string;
  work_mode: string;
  qualification: string;
  description: string;
  created_at: string;
}

export interface Application {
  id: number;
  user_id: number;
  job_id: number;
  job_role: string;
  company_name: string;
  status: 'Under Review' | 'Shortlisted' | 'Rejected' | 'Selected';
  created_at: string;
}

export interface Assessment {
  id: number;
  job_id: number;
  title: string;
  duration: number;
  instructions: string;
}

export interface Question {
  id: number;
  assessment_id: number;
  question: string;
  options: string[];
  correct_option: number;
  type: 'MCQ' | 'Coding' | 'Aptitude';
}
