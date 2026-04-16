import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  studentId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  formId: mongoose.Types.ObjectId;
  answers: Array<{
    questionId: mongoose.Types.ObjectId;
    selectedOption: string;
    isCorrect: boolean;
  }>;
  score: number;
  totalQuestions: number;
  solvingTime: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema: Schema = new Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamForm',
    required: true,
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    selectedOption: String,
    isCorrect: Boolean,
  }],
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  solvingTime: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Submission = mongoose.model<ISubmission>('Submission', submissionSchema);
export default Submission;
