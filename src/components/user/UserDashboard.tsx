import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { BookOpen, Target, Trophy, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { mockAttempts, mockExams } from '../../lib/mockData';

export function UserDashboard() {
  const userId = '2'; // Current user ID
  const userAttempts = mockAttempts.filter(a => a.user_id === userId);
  const completedExams = userAttempts.filter(a => a.status === 'completed').length;
  const averageScore = userAttempts.length > 0
    ? userAttempts.reduce((sum, a) => sum + a.percentage, 0) / userAttempts.length
    : 0;
  const totalTimeSpent = userAttempts.reduce((sum, a) => sum + a.time_taken_minutes, 0);

  const subjectProgress = [
    { subject: 'Banking Awareness', completed: 3, total: 5, score: 72 },
    { subject: 'Quantitative Aptitude', completed: 2, total: 5, score: 65 },
    { subject: 'English Language', completed: 1, total: 5, score: 78 },
    { subject: 'Reasoning Ability', completed: 2, total: 5, score: 68 },
  ];

  const recentActivity = [
    { exam: 'SBI PO Prelims Mock 1', score: 85, date: '2 days ago', status: 'passed' },
    { exam: 'IBPS Clerk Practice', score: 72, date: '5 days ago', status: 'passed' },
    { exam: 'RRB Banking Test', score: 38, date: '1 week ago', status: 'failed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2>My Dashboard</h2>
        <p className="text-gray-600 mt-1">Track your progress and performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Exams Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{completedExams}</div>
            <p className="text-xs text-gray-600 mt-1">Out of {mockExams.length} available</p>
            <Progress value={(completedExams / mockExams.length) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Average Score</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-gray-600 mt-1">Overall performance</p>
            <Progress value={averageScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalTimeSpent}m</div>
            <p className="text-xs text-gray-600 mt-1">Total time spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Success Rate</CardTitle>
            <Trophy className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {userAttempts.length > 0 
                ? ((userAttempts.filter(a => a.percentage >= 40).length / userAttempts.length) * 100).toFixed(0)
                : 0}%
            </div>
            <p className="text-xs text-gray-600 mt-1">Pass rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjectProgress.map((subject, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm">{subject.subject}</p>
                  <p className="text-xs text-gray-600">
                    {subject.completed}/{subject.total} tests completed • Avg: {subject.score}%
                  </p>
                </div>
                <span className={`text-sm ${subject.score >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                  {subject.score}%
                </span>
              </div>
              <Progress value={(subject.completed / subject.total) * 100} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${activity.status === 'passed' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {activity.status === 'passed' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Target className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{activity.exam}</p>
                    <p className="text-xs text-gray-600">{activity.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${activity.status === 'passed' ? 'text-green-600' : 'text-red-600'}`}>
                    {activity.score}%
                  </p>
                  <p className="text-xs text-gray-600 capitalize">{activity.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Banking Awareness</span>
                <span className="text-sm text-green-600">Strong</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">English Language</span>
                <span className="text-sm text-green-600">Strong</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Areas to Improve</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Quantitative Aptitude</span>
                <span className="text-sm text-orange-600">Needs Practice</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Reasoning Ability</span>
                <span className="text-sm text-orange-600">Needs Practice</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
