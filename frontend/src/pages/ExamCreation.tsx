import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Check, Send } from 'lucide-react';
import api from '../services/api';

interface Question {
  _id: string;
  text: string;
  options: string[];
}

const ExamCreation = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const res = await api.get('/questions');
      return res.data.data.questions;
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { title: string; questionIds: string[] }) => 
      api.post('/exams', data),
    onSuccess: () => {
      alert('Exam and 4 unique forms generated successfully!');
      setTitle('');
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error creating exam');
    }
  });

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!title) return alert('Enter exam title');
    if (selectedIds.length === 0) return alert('Select at least one question');
    mutation.mutate({ title, questionIds: selectedIds });
  };

  if (isLoading) return <div>Loading questions...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">New Exam Configuration</h2>
        <div className="flex gap-4">
          <input 
            type="text"
            placeholder="Exam Title (e.g., Midterm React Basics)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
          />
          <button 
            onClick={handleCreate}
            disabled={mutation.isPending}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {mutation.isPending ? 'Generating Forms...' : 'Create & Generate'}
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Generating an exam will automatically create **4 unique versions** with shuffled questions and options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((q: Question) => (
          <div 
            key={q._id}
            onClick={() => toggleSelection(q._id)}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between h-32 ${
              selectedIds.includes(q._id) 
              ? 'border-primary-500 bg-primary-50 shadow-sm' 
              : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between gap-2">
              <span className="text-sm font-medium text-slate-700 line-clamp-3">{q.text}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                selectedIds.includes(q._id) ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-300'
              }`}>
                {selectedIds.includes(q._id) && <Check className="w-3 h-3" />}
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{q.options.length} Options</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamCreation;
