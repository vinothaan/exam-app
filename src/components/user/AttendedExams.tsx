import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Calendar, Clock, Target, Trophy, TrendingUp, Eye } from 'lucide-react';
import { mockAttempts, mockExams } from '../../lib/mockData';
import { ExamAttempt, Exam } from '../../types';

interface AttendedExamsProps {
  onViewDetails: (exam: Exam, attempt: ExamAttempt) => void;
}

export function AttendedExams({ onViewDetails }: AttendedExamsProps) {
  const userId = '2';
  const userAttempts = mockAttempts.filter(a => a.user_id === userId && a.status === 'completed');

  const attemptsWithExam = userAttempts.map(attempt => {
    const exam = mockExams.find(e => e.id === attempt.exam_id);
    return { attempt, exam };
  }).filter(item => item.exam) as Array<{ attempt: ExamAttempt; exam: Exam }>;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (percentage: number, passingMarks: number) => {
    if (percentage >= passingMarks) {
      return <Badge className="bg-green-100 text-green-700">Passed</Badge>;
    }
    return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Attended Exams</h2>
        <p className="text-gray-600 mt-1">Review your past exam performances</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{userAttempts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {userAttempts.length > 0
                ? (userAttempts.reduce((sum, a) => sum + a.percentage, 0) / userAttempts.length).toFixed(1)
                : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-600" />
              <span className="text-2xl">
                {userAttempts.filter(a => a.percentage >= 40).length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Best Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-2xl">
                {userAttempts.length > 0
                  ? Math.max(...userAttempts.map(a => a.percentage)).toFixed(1)
                  : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attempts List */}
      {attemptsWithExam.length > 0 ? (
        <div className="space-y-4">
          {attemptsWithExam.map(({ attempt, exam }) => (
            <Card key={attempt.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <CardDescription className="mt-1">{exam.description}</CardDescription>
                  </div>
                  {getScoreBadge(attempt.percentage, exam.passing_marks)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Score Display */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Your Score</p>
                    <p className={`text-3xl ${getScoreColor(attempt.percentage)}`}>
                      {attempt.percentage.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {attempt.score} / {attempt.total_marks} marks
                    </p>
                  </div>
                  <div className="w-32 h-32">
                    <svg className="transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke={attempt.percentage >= 70 ? '#10b981' : attempt.percentage >= 40 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="12"
                        strokeDasharray={`${(attempt.percentage / 100) * 339.292} 339.292`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p>{formatDate(attempt.completed_at || attempt.started_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Time Taken</p>
                      <p>{attempt.time_taken_minutes} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Questions</p>
                      <p>{exam.questions.length} total</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Passing</p>
                      <p>{exam.passing_marks}%</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Performance</span>
                    <span className={getScoreColor(attempt.percentage)}>
                      {attempt.percentage >= exam.passing_marks ? 'Above passing marks' : 'Below passing marks'}
                    </span>
                  </div>
                  <Progress value={attempt.percentage} />
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onViewDetails(exam, attempt)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Detailed Results
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">No exams attended yet</p>
            <p className="text-sm text-gray-500">Start taking exams to see your performance here</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
