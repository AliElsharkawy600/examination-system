import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, ClipboardList } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="glass sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
                <ClipboardList className="w-8 h-8" />
                <span>EduExam</span>
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/teacher" className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 transition-colors py-2 px-3 rounded-md hover:bg-white/50">
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-sm font-medium">Teacher Dashboard</span>
              </Link>
              <Link to="/student" className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 transition-colors py-2 px-3 rounded-md hover:bg-white/50">
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm font-medium">Student Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="py-6 border-t border-slate-200 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} EduExam System. Built with MERN & Redis.
      </footer>
    </div>
  );
};

export default MainLayout;
