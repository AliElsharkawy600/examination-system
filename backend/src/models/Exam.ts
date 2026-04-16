import mongoose, { Document, Schema } from 'mongoose';

export interface IExam extends Document {
  title: string;
  duration: number; // in minutes
  totalQuestions: number;
  forms: mongoose.Types.ObjectId[]; // References to ExamForm
  createdAt: Date;
  updatedAt: Date;
}

const examSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Exam title is required'],
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  forms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamForm',
  }],
}, { timestamps: true });

const Exam = mongoose.model<IExam>('Exam', examSchema);
export default Exam;
