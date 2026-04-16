import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentPortal from './pages/StudentPortal';
import TakeExam from './pages/TakeExam';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/teacher" replace />} />
          <Route path="teacher/*" element={<TeacherDashboard />} />
          <Route path="student" element={<StudentPortal />} />
        </Route>
        <Route path="student/exam/:examId" element={<TakeExam />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
