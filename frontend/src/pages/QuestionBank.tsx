import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Trash2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import api from '../services/api';
import { DataTable } from '../components/DataTable';

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  image?: string;
  createdAt: string;
}

const QuestionBank = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  
  // Queries
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const res = await api.get('/questions');
      return res.data.data.questions;
    },
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/questions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const columns: ColumnDef<Question>[] = [
    {
      accessorKey: 'text',
      header: 'Question Text',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.image && (
            <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
              <img 
                src={`${API_BASE_URL}${row.original.image}`} 
                alt="" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span className="font-medium line-clamp-2">{row.original.text}</span>
        </div>
      ),
    },
    {
      accessorKey: 'options',
      header: 'Options',
      cell: ({ row }) => (
        <div className="grid grid-cols-2 gap-1 text-[11px]">
          {row.original.options.map((opt, i) => (
            <div key={i} className={`flex items-center gap-1 p-1 rounded ${opt === row.original.correctAnswer ? 'bg-green-50 text-green-700' : 'bg-slate-50'}`}>
              <CheckCircle2 className={`w-3 h-3 ${opt === row.original.correctAnswer ? 'opacity-100' : 'opacity-20'}`} />
              <span className="truncate">{opt}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <button 
          onClick={() => {
            if(confirm('Are you sure you want to delete this question?')) {
              deleteMutation.mutate(row.original._id);
            }
          }}
          className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Question Bank</h1>
          <p className="text-slate-500 text-sm">Manage your multiple-choice questions here.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      <DataTable columns={columns} data={questions} searchKey="text" />

      {/* Basic Addition Form (Modal overlay) */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">Add New Question</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <div className="p-6">
              <AddQuestionForm onSuccess={() => setIsAdding(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Form Component logic
const AddQuestionForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswerIndex: null as number | null, // Store index instead of value
    image: null as File | null,
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = new FormData();
      payload.append('text', data.text);
      payload.append('options', JSON.stringify(data.options));
      // Map index back to string value for the backend
      const correctValue = data.correctAnswerIndex !== null ? data.options[data.correctAnswerIndex] : '';
      payload.append('correctAnswer', correctValue);
      
      if (data.image) payload.append('image', data.image);

      return api.post('/questions', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      onSuccess();
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const isOptionsFilled = formData.options.every(o => o.trim() !== '');
    const isCorrectAnswerSelected = formData.correctAnswerIndex !== null;
    
    if (!isOptionsFilled || !formData.text.trim() || !isCorrectAnswerSelected) {
      alert('Please fill all fields and select a correct answer');
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Question Text</label>
        <textarea 
          required
          rows={3}
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
          placeholder="Enter the question text..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {formData.options.map((opt, i) => (
          <div key={i}>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Option {i + 1}</label>
            <div className="relative">
              <input
                required
                type="text"
                value={opt}
                onChange={(e) => {
                  const newOptions = [...formData.options];
                  newOptions[i] = e.target.value;
                  setFormData({ ...formData, options: newOptions });
                }}
                className={`w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm ${formData.correctAnswerIndex === i ? 'ring-2 ring-green-500 border-green-500' : ''}`}
                placeholder={`Choice ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, correctAnswerIndex: i })}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all ${formData.correctAnswerIndex === i ? 'text-green-600 bg-green-50' : 'text-slate-300 hover:text-green-500'}`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Image (Optional)</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <ImageIcon className="w-4 h-4 text-slate-500" />
            <span>{formData.image ? formData.image.name : 'Choose Image'}</span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
            />
          </label>
          {formData.image && (
            <button 
              type="button" 
              onClick={() => setFormData({ ...formData, image: null })}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={() => onSuccess()}
          className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="px-8 py-2.5 rounded-xl font-medium bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 disabled:opacity-50 active:scale-95 transition-all"
        >
          {mutation.isPending ? 'Saving...' : 'Save Question'}
        </button>
      </div>
    </form>
  );
};

export default QuestionBank;
