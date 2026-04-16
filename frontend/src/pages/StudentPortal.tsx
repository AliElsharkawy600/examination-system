import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GraduationCap, PlayCircle, Fingerprint, User as UserIcon } from 'lucide-react';
import api from '../services/api';

const StudentPortal = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');

  const { data: exams = [], isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const res = await api.get('/exams');
      return res.data.data.exams;
    },
  });

  const handleStartExam = (examId: string) => {
    if (!studentName || !studentId) {
      alert('Please enter your name and ID to continue');
      return;
    }
    navigate(`/student/exam/${examId}?studentName=${encodeURIComponent(studentName)}&studentIdentifier=${encodeURIComponent(studentId)}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-2xl text-primary-600 mb-2">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Student Portal</h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Welcome! Please provide your details and select an exam to begin.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Identifiers */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-primary-500" />
            Your Identity
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                <UserIcon className="w-4 h-4" /> Full Name
              </label>
              <input 
                type="text"
                placeholder="John Doe"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                <Fingerprint className="w-4 h-4" /> Student ID / National ID
              </label>
              <input 
                type="text"
                placeholder="STU-123456"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
              />
            </div>
          </div>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
              💡 Your ID is used to track your progress and results. Ensure it is correct as per your academic record.
            </p>
          </div>
        </div>

        {/* Exam List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Available Exams</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {exams.length === 0 && <p className="text-slate-400 text-center py-8">No exams active at the moment.</p>}
              {exams.map((exam: any) => (
                <div 
                  key={exam._id}
                  className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-primary-400 transition-all hover:shadow-lg hover:shadow-primary-100 cursor-default flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{exam.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">{exam.questions.length} Multiple Choice Questions</p>
                  </div>
                  <button 
                    onClick={() => handleStartExam(exam._id)}
                    className="p-3 bg-slate-50 group-hover:bg-primary-500 rounded-full text-slate-400 group-hover:text-white transition-all transform group-hover:scale-110 active:scale-95"
                    title="Start Exam"
                  >
                    <PlayCircle className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
