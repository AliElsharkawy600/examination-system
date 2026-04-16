import { Request, Response } from 'express';
import Question from '../models/Question.js';
import catchAsync from '../utils/catchAsync.js';
import CustomError from '../utils/CustomError.js';

export const getAllQuestions = catchAsync(async (req: Request, res: Response) => {
  const questions = await Question.find().sort('-createdAt');
  
  res.status(200).json({
    status: 'success',
    data: { questions }
  });
});

export const createQuestion = catchAsync(async (req: Request, res: Response) => {
  const { text, options, correctAnswer } = req.body;
  
  // Parse options if sent as stringified JSON (common from FormData)
  const parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;
  
  const questionData: any = {
    text,
    options: parsedOptions,
    correctAnswer
  };

  if (req.file) {
    questionData.image = `/uploads/${req.file.filename}`;
  }

  const newQuestion = await Question.create(questionData);

  res.status(201).json({
    status: 'success',
    data: { question: newQuestion }
  });
});

export const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
  const question = await Question.findByIdAndDelete(req.params.id);

  if (!question) {
    throw new CustomError('No question found with that ID', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
