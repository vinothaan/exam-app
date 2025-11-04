import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Clock, Flag, AlertCircle, CheckCircle } from 'lucide-react';
import { Exam, ExamAttempt } from '../../types';
import { toast } from 'sonner@2.0.3';

interface ExamTakingProps {
  exam: Exam;
  onComplete: (attempt: ExamAttempt) => void;
  onExit: () => void;
}

export function ExamTaking({ exam, onComplete, onExit }: ExamTakingProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(exam.duration_minutes * 60); // in seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-submit warning
  useEffect(() => {
    if (timeRemaining === 300) { // 5 minutes
      toast.warning('Only 5 minutes remaining!');
    }
    if (timeRemaining === 60) { // 1 minute
      toast.error('Only 1 minute remaining!');
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleMarkForReview = () => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(currentQuestionIndex)) {
      newMarked.delete(currentQuestionIndex);
    } else {
      newMarked.add(currentQuestionIndex);
    }
    setMarkedForReview(newMarked);
  };

  const calculateScore = () => {
    let score = 0;
    exam.questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        score += question.marks;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    const percentage = (score / exam.total_marks) * 100;
    const timeTaken = exam.duration_minutes - Math.floor(timeRemaining / 60);

    const attempt: ExamAttempt = {
      id: `attempt_${Date.now()}`,
      exam_id: exam.id,
      user_id: '2',
      answers,
      score,
      total_marks: exam.total_marks,
      percentage,
      time_taken_minutes: timeTaken,
      status: 'completed',
      started_at: new Date(Date.now() - timeTaken * 60000).toISOString(),
      completed_at: new Date().toISOString(),
    };

    // TODO: Save to your Neon database
    // await fetch('/api/attempts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(attempt)
    // });

    onComplete(attempt);
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = exam.questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{exam.title}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeRemaining < 300 ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300' : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'}`}>
                <Clock className="h-5 w-5" />
                <span className="text-lg">{formatTime(timeRemaining)}</span>
              </div>
              <Button variant="outline" onClick={() => setShowExitDialog(true)}>
                Exit
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Question Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    {currentQuestion.subject} • {currentQuestion.topic}
                  </p>
                  <p className="text-lg">{currentQuestion.question_text}</p>
                </div>
                <div className="text-sm text-gray-600">
                  {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={handleAnswerChange}
              >
                <div className="space-y-3">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <div
                      key={option}
                      className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        answers[currentQuestion.id] === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem value={option} id={`option-${option}`} />
                      <Label htmlFor={`option-${option}`} className="flex-1 cursor-pointer">
                        <span className="mr-2">{option}.</span>
                        {currentQuestion[`option_${option.toLowerCase()}` as keyof typeof currentQuestion]}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleMarkForReview}
                >
                  <Flag className={`h-4 w-4 mr-2 ${markedForReview.has(currentQuestionIndex) ? 'fill-current text-orange-600' : ''}`} />
                  {markedForReview.has(currentQuestionIndex) ? 'Marked' : 'Mark for Review'}
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  {currentQuestionIndex === exam.questions.length - 1 ? (
                    <Button onClick={() => setShowSubmitDialog(true)}>
                      Submit Exam
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>
                      {answers[currentQuestion.id] ? 'Next' : 'Skip'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Palette */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Question Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {exam.questions.map((_, index) => {
                  const isAnswered = answers[exam.questions[index].id];
                  const isMarked = markedForReview.has(index);
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`
                        aspect-square rounded-lg text-sm transition-colors
                        ${isCurrent ? 'ring-2 ring-blue-500' : ''}
                        ${isAnswered && !isMarked ? 'bg-green-500 text-white' : ''}
                        ${isMarked && isAnswered ? 'bg-orange-500 text-white' : ''}
                        ${isMarked && !isAnswered ? 'bg-orange-200 text-orange-700' : ''}
                        ${!isAnswered && !isMarked ? 'bg-gray-200 text-gray-700' : ''}
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span>Marked ({markedForReview.size})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span>Not Answered ({unansweredCount})</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>• All questions are mandatory</p>
              <p>• Each question carries {exam.questions[0]?.marks} mark(s)</p>
              <p>• No negative marking</p>
              <p>• Use Mark for Review to revisit</p>
              <p>• Auto-submit on time expiry</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2 my-4">
                <p>Are you sure you want to submit the exam?</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Answered:</span>
                    <span className="text-green-600">{answeredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Not Answered:</span>
                    <span className="text-red-600">{unansweredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marked for Review:</span>
                    <span className="text-orange-600">{markedForReview.size}</span>
                  </div>
                </div>
                {unansweredCount > 0 && (
                  <p className="text-sm text-orange-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    You have {unansweredCount} unanswered questions
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Answers</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will not be saved. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Exam</AlertDialogCancel>
            <AlertDialogAction onClick={onExit}>Exit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
