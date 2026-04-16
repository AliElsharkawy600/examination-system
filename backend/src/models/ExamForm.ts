import mongoose, { Document, Schema } from 'mongoose';

export interface IExamForm extends Document {
  examId: mongoose.Types.ObjectId;
  formNumber: number;
  questions: Array<{
    questionId: mongoose.Types.ObjectId;
    text: string;
    options: string[];
    correctAnswer: string;
    image?: string;
    shuffledOptions: string[];
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const examFormSchema: Schema = new Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  formNumber: {
    type: Number,
    required: true,
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    text: String,
    options: [String],
    correctAnswer: String,
    image: String,
    shuffledOptions: [String],
  }],
}, { timestamps: true });

const ExamForm = mongoose.model<IExamForm>('ExamForm', examFormSchema);
export default ExamForm;
