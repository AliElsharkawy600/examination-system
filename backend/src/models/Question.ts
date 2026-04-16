import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  text: string;
  options: string[];
  correctAnswer: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema: Schema = new Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
  },
  options: {
    type: [String],
    validate: {
      validator: function (v: string[]) {
        return v.length === 4;
      },
      message: 'A question must have exactly 4 options',
    },
    required: true,
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
  },
  image: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const Question = mongoose.model<IQuestion>('Question', questionSchema);
export default Question;
