import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  studentIdentifier: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
  },
  studentIdentifier: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
  },
}, { timestamps: true });

const Student = mongoose.model<IStudent>('Student', studentSchema);
export default Student;
