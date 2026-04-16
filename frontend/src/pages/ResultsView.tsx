import { useQuery } from '@tanstack/react-query';
import { Download, User, Clock, Award } from 'lucide-react';
import api from '../services/api';
import { DataTable } from '../components/DataTable';
import { ColumnDef } from '@tanstack/react-table';

interface Result {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    studentIdentifier: string;
  };
  examId: {
    _id: string;
    title: string;
  };
  score: number;
  solvingTime: number;
  createdAt: string;
}

const ResultsView = () => {
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['results'],
    queryFn: async () => {
      const res = await api.get('/results');
      return res.data.data.results;
    },
  });

  const handleExport = async () => {
    try {
      const response = await api.get('/results/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exam_results.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export results');
    }
  };

  const columns: ColumnDef<Result>[] = [
    {
      accessorKey: 'studentId.name',
      header: 'Student',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">{row.original.studentId.name}</span>
          <span className="text-[10px] text-slate-400 font-mono uppercase">{row.original.studentId.studentIdentifier}</span>
        </div>
      ),
    },
    {
      accessorKey: 'examId.title',
      header: 'Exam',
      cell: ({ row }) => <span className="font-medium">{row.original.examId.title}</span>,
    },
    {
      accessorKey: 'score',
      header: 'Score',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-bold text-primary-600">
          <Award className="w-4 h-4" />
          {row.original.score}
        </div>
      ),
    },
    {
      accessorKey: 'solvingTime',
      header: 'Time',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="w-4 h-4" />
          {Math.floor(row.original.solvingTime / 60)}m {row.original.solvingTime % 60}s
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exam Results</h1>
          <p className="text-slate-500 text-sm">Monitor student performance and export data.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-green-200 active:scale-95"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </div>

      <DataTable columns={columns} data={results} searchKey="studentId.name" />
    </div>
  );
};

export default ResultsView;
