import { Request, Response } from 'express';
import Submission from '../models/Submission.js';
import ExamForm from '../models/ExamForm.js';
import Student from '../models/Student.js';
import catchAsync from '../utils/catchAsync.js';
import CustomError from '../utils/CustomError.js';
import { getStartTime, deleteTimer } from '../services/redisService.js';

export const submitExam = catchAsync(async (req: Request, res: Response) => {
  const { studentId, examId, formId, answers } = req.body;

  // 1. Calculate Solving Time
  const startTime = await getStartTime(studentId, examId);
  const finishTime = Date.now();
  const solvingTime = startTime ? Math.floor((finishTime - startTime) / 1000) : 0;

  // 2. Clear Timer
  await deleteTimer(studentId, examId);

  // 3. Grade Exam
  const form = await ExamForm.findById(formId);
  if (!form) throw new CustomError('Form error', 400);

  let score = 0;
  const gradedAnswers = answers.map((ans: { questionId: string; selectedOption: string }) => {
    const question = form.questions.find(q => q.questionId.toString() === ans.questionId);
    const isCorrect = question ? question.correctAnswer === ans.selectedOption : false;
    if (isCorrect) score++;
    
    return {
      ...ans,
      isCorrect
    };
  });

  // 4. Create Submission
  const submission = await Submission.create({
    studentId,
    examId,
    formId,
    answers: gradedAnswers,
    score,
    totalQuestions: form.questions.length,
    solvingTime
  });

  res.status(201).json({
    status: 'success',
    data: submission
  });
});

export const getResults = catchAsync(async (req: Request, res: Response) => {
  const results = await Submission.find()
    .populate('studentId', 'name studentIdentifier')
    .populate('examId', 'title')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: { results }
  });
});
