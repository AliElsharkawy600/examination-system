import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Database, FileText, BarChart3 } from 'lucide-react';
import QuestionBank from './QuestionBank';
import ExamCreation from './ExamCreation';
import ResultsView from './ResultsView';

const TeacherDashboard = () => {
  const { pathname } = useLocation();

  const tabs = [
    { name: 'Question Bank', path: '/teacher/questions', icon: Database },
    { name: 'Create Exam', path: '/teacher/exams', icon: FileText },
    { name: 'Results', path: '/teacher/results', icon: BarChart3 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || (tab.path === '/teacher/questions' && pathname === '/teacher');
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </Link>
          );
        })}
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-2xl min-h-[500px]">
        <Routes>
          <Route index element={<QuestionBank />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="exams" element={<ExamCreation />} />
          <Route path="results" element={<ResultsView />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeacherDashboard;
