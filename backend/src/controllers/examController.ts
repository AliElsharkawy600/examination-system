import { Request, Response } from 'express';
import Exam from '../models/Exam.js';
import ExamForm from '../models/ExamForm.js';
import Question from '../models/Question.js';
import Student, { IStudent } from '../models/Student.js';
import catchAsync from '../utils/catchAsync.js';
import CustomError from '../utils/CustomError.js';
import { shuffle } from '../services/shuffleService.js';
import { startTimer } from '../services/redisService.js';

export const createExam = catchAsync(async (req: Request, res: Response) => {
  const { title, duration, questionIds } = req.body;

  if (!questionIds || questionIds.length === 0) {
    throw new CustomError('At least one question is required', 400);
  }

  // 1. Fetch questions
  const questions = await Question.find({ _id: { $in: questionIds } });
  
  // 2. Create Exam
  const exam = await Exam.create({
    title,
    duration,
    totalQuestions: questions.length
  });

  // 3. Generate 4 Forms
  const formIds: any[] = [];
  for (let i = 1; i <= 4; i++) {
    const shuffledQuestions = shuffle(questions).map(q => ({
      questionId: q._id,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      image: q.image,
      shuffledOptions: shuffle(q.options)
    }));

    const form = await ExamForm.create({
      examId: exam._id,
      formNumber: i,
      questions: shuffledQuestions
    });
    formIds.push(form._id);
  }

  // 4. Update Exam with form references
  exam.forms = formIds;
  await exam.save();

  res.status(201).json({
    status: 'success',
    data: { exam }
  });
});

export const getExams = catchAsync(async (req: Request, res: Response) => {
  const exams = await Exam.find().sort('-createdAt');
  res.status(200).json({
    status: 'success',
    data: { exams }
  });
});

export const startExam = catchAsync(async (req: Request, res: Response) => {
  const { examId } = req.params;
  const { studentName, studentIdentifier } = req.query;

  if (!studentName || !studentIdentifier) {
    throw new CustomError('Student name and ID are required', 400);
  }

  // 1. Find or create student
  const qStudentName = studentName as string;
  const qStudentIdentifier = studentIdentifier as string;

  let student = await Student.findOne({ studentIdentifier: qStudentIdentifier });
  if (!student) {
    student = await Student.create({ name: qStudentName, studentIdentifier: qStudentIdentifier });
  }

  // 2. Get Exam
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new CustomError('Exam not found', 404);
  }

  // 3. Randomize Form assignment
  const randomFormIndex = Math.floor(Math.random() * exam.forms.length);
  const formId = exam.forms[randomFormIndex];
  
  const form = await ExamForm.findById(formId);
  if (!form) throw new CustomError('Form loading failed', 500);

  // 4. Start Timer in Redis
  const startTime = await startTimer(student._id.toString(), exam._id.toString(), exam.duration * 60);

  res.status(200).json({
    status: 'success',
    data: {
      examId: exam._id,
      formId: form._id,
      studentId: student._id,
      title: exam.title,
      duration: exam.duration,
      startTime,
      questions: form.questions.map(q => ({
        questionId: q.questionId,
        text: q.text,
        image: q.image,
        shuffledOptions: q.shuffledOptions
      }))
    }
  });
});
