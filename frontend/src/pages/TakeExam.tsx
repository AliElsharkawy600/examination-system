import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Clock, Send, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { API_BASE_URL } from '../config';

const TakeExam = () => {
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const studentName = searchParams.get('studentName');
  const studentIdentifier = searchParams.get('studentIdentifier');

  // Data fetching
  const { data: examData, isLoading, error } = useQuery({
    queryKey: ['exam-start', examId, studentIdentifier],
    queryFn: async () => {
      const res = await api.get(`/exams/start/${examId}`, {
        params: { studentName, studentIdentifier }
      });
      return res.data.data;
    },
    enabled: !!studentName && !!studentIdentifier,
    staleTime: Infinity,
  });

  // Submission handling
  const submitMutation = useMutation({
    mutationFn: async (payload: any) => api.post('/exams/submit', payload),
    onSuccess: (res) => {
      setResult(res.data.data);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Submission failed');
    }
  });

  const handleSelect = (questionId: string, option: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < examData.questions.length) {
      if (!confirm('You have unanswered questions. Submit anyway?')) return;
    }
    
    const payload = {
      studentId: examData.studentId,
      examId: examData.examId,
      formId: examData.formId,
      answers: Object.entries(answers).map(([qid, opt]) => ({
        questionId: qid,
        selectedOption: opt
      }))
    };
    submitMutation.mutate(payload);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-medium">Starting exam...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-red-100 shadow-xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Session Error</h2>
        <p className="text-slate-500">{(error as any).response?.data?.message || 'Could not start exam. Please try again from the portal.'}</p>
        <button onClick={() => navigate('/student')} className="text-primary-600 font-semibold hover:underline">Back to Portal</button>
      </div>
    </div>
  );

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="bg-primary-600 p-8 text-white text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl font-bold">Exam Submitted!</h1>
            <p className="opacity-80 mt-1">Well done, {studentName}.</p>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-2xl text-center">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Final Score</span>
                <span className="text-4xl font-black text-primary-600">{result.score} <span className="text-lg text-slate-300">/ {result.totalQuestions}</span></span>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl text-center">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time Taken</span>
                <span className="text-2xl font-black text-slate-700">{Math.floor(result.solvingTime / 60)}m {result.solvingTime % 60}s</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800 font-medium">
                  Your submission has been recorded securely. You can now close this window or return to the dashboard.
                </p>
              </div>
              <button 
                onClick={() => navigate('/student')}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalCount = examData.questions.length;
  const progress = (answeredCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Exam Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">{examData.title}</h1>
              <p className="text-xs text-slate-400 font-medium">Student: {studentName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm font-bold text-primary-600">{answeredCount} / {totalCount}</span>
            <button 
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
              {submitMutation.isPending ? 'Submitting...' : 'Finish Exam'}
            </button>
          </div>
        </div>
        {/* Mobile Progress Bar */}
        <div className="md:hidden w-full h-1 bg-slate-100">
          <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-4 space-y-12">
        {examData.questions.map((q: any, i: number) => (
          <div key={q.questionId} className="group scroll-mt-24" id={`q-${q.questionId}`}>
            <div className="flex items-start gap-4 mb-6">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-sm">
                {i + 1}
              </span>
              <div className="space-y-4 flex-1">
                <h2 className="text-xl font-semibold text-slate-900 leading-relaxed">{q.text}</h2>
                {q.image && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white max-w-lg">
                    <img src={`${API_BASE_URL}${q.image}`} alt="Question image" className="w-full h-auto" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 ml-12">
              {q.shuffledOptions.map((option: string, optIdx: number) => {
                const isSelected = answers[q.questionId] === option;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(q.questionId, option)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all hover:translate-x-1 ${
                      isSelected 
                      ? 'border-primary-500 bg-primary-50 shadow-md ring-4 ring-primary-100' 
                      : 'border-white bg-white hover:border-slate-200'
                    }`}
                  >
                    <span className={`font-medium ${isSelected ? 'text-primary-700' : 'text-slate-600'}`}>{option}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-200'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-8 border-t border-slate-200 flex flex-col items-center text-center space-y-6">
           <div className="max-w-xs space-y-2">
             <h3 className="font-bold text-slate-900">End of Exam</h3>
             <p className="text-sm text-slate-500">Make sure you've reviewed all your answers before submitting.</p>
           </div>
           <button 
              onClick={handleSubmit}
              className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95"
            >
              Submit All Answers
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </main>
    </div>
  );
};

export default TakeExam;
