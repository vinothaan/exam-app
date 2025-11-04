import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Trophy, Clock, Target, TrendingUp, CheckCircle, XCircle, Home } from 'lucide-react';
import { Exam, ExamAttempt } from '../../types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface ExamResultsProps {
  exam: Exam;
  attempt: ExamAttempt;
  onGoHome: () => void;
  onRetake: () => void;
}

export function ExamResults({ exam, attempt, onGoHome, onRetake }: ExamResultsProps) {
  const isPassed = attempt.percentage >= exam.passing_marks;
  const correctAnswers = exam.questions.filter(q => attempt.answers[q.id] === q.correct_answer).length;
  const incorrectAnswers = Object.keys(attempt.answers).length - correctAnswers;
  const skipped = exam.questions.length - Object.keys(attempt.answers).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Result Header */}
        <Card className={isPassed ? 'border-green-500 dark:border-green-700' : 'border-red-500 dark:border-red-700'}>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${isPassed ? 'bg-green-100 dark:bg-green-950' : 'bg-red-100 dark:bg-red-950'}`}>
                {isPassed ? (
                  <Trophy className="h-10 w-10 text-green-600 dark:text-green-400" />
                ) : (
                  <Target className="h-10 w-10 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <h2 className={isPassed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {isPassed ? 'Congratulations!' : 'Keep Practicing!'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {isPassed ? 'You have passed the exam' : 'You need more practice'}
                </p>
              </div>
              <div className="text-5xl">{attempt.percentage.toFixed(1)}%</div>
              <Progress value={attempt.percentage} className="max-w-md mx-auto" />
              <p className="text-gray-600 dark:text-gray-400">
                {attempt.score} out of {attempt.total_marks} marks • Passing: {exam.passing_marks}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Correct</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-2xl">{correctAnswers}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Incorrect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-2xl">{incorrectAnswers}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Skipped</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-gray-600" />
                <span className="text-2xl">{skipped}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Time Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-2xl">{attempt.time_taken_minutes}m</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Accuracy</span>
                <span className="text-sm">{((correctAnswers / exam.questions.length) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(correctAnswers / exam.questions.length) * 100} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Completion Rate</span>
                <span className="text-sm">{((Object.keys(attempt.answers).length / exam.questions.length) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(Object.keys(attempt.answers).length / exam.questions.length) * 100} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Time Efficiency</span>
                <span className="text-sm">{((attempt.time_taken_minutes / exam.duration_minutes) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(attempt.time_taken_minutes / exam.duration_minutes) * 100} />
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {exam.questions.map((question, index) => {
                const userAnswer = attempt.answers[question.id];
                const isCorrect = userAnswer === question.correct_answer;
                const wasSkipped = !userAnswer;

                return (
                  <AccordionItem key={question.id} value={`question-${index}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm text-gray-600">Q{index + 1}</span>
                        {wasSkipped ? (
                          <Badge variant="secondary">Skipped</Badge>
                        ) : isCorrect ? (
                          <Badge className="bg-green-100 text-green-700">Correct</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700">Incorrect</Badge>
                        )}
                        <span className="text-sm truncate text-left">{question.question_text}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <p className="text-sm">{question.question_text}</p>
                        
                        <div className="space-y-2">
                          {['A', 'B', 'C', 'D'].map((option) => {
                            const optionKey = `option_${option.toLowerCase()}` as keyof typeof question;
                            const isUserAnswer = userAnswer === option;
                            const isCorrectAnswer = question.correct_answer === option;
                            
                            return (
                              <div
                                key={option}
                                className={`p-3 rounded-lg border ${
                                  isCorrectAnswer
                                    ? 'border-green-500 bg-green-50'
                                    : isUserAnswer
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">
                                    {option}. {String(question[optionKey])}
                                  </span>
                                  {isCorrectAnswer && (
                                    <Badge className="bg-green-100 text-green-700 ml-auto">Correct Answer</Badge>
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <Badge className="bg-red-100 text-red-700 ml-auto">Your Answer</Badge>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {question.explanation && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm mb-1">Explanation:</p>
                            <p className="text-sm text-gray-700">{question.explanation}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{question.subject}</span>
                          <span>•</span>
                          <span>{question.topic}</span>
                          <span>•</span>
                          <span>{question.marks} marks</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center pb-8">
          <Button variant="outline" onClick={onGoHome} size="lg">
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
          <Button onClick={onRetake} size="lg">
            <TrendingUp className="h-4 w-4 mr-2" />
            Retake Exam
          </Button>
        </div>
      </div>
    </div>
  );
}
