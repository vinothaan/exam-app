import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users, BookOpen, FileQuestion, TrendingUp, Clock, Award } from 'lucide-react';
import { mockStatistics } from '../../lib/mockData';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

export function SupervisorDashboard() {
  const stats = mockStatistics;

  const chartConfig = {
    avg_score: {
      label: 'Average Score',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Monitor system performance and student analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total_users}</div>
            <p className="text-xs text-gray-600 mt-1">Active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total_exams}</div>
            <p className="text-xs text-gray-600 mt-1">Available tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total_questions}</div>
            <p className="text-xs text-gray-600 mt-1">Question bank</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.average_score}%</div>
            <p className="text-xs text-gray-600 mt-1">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subject-wise Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
            <CardDescription>Average scores across different subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.subject_wise_performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="subject" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avg_score" fill="var(--color-avg_score)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Attempts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Exam Attempts</CardTitle>
            <CardDescription>Latest student submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recent_attempts.map((attempt, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Award className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm">{attempt.user_name}</p>
                      <p className="text-xs text-gray-600">{attempt.exam_title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${attempt.score >= 70 ? 'text-green-600' : attempt.score >= 40 ? 'text-orange-600' : 'text-red-600'}`}>
                      {attempt.score}%
                    </p>
                    <p className="text-xs text-gray-600">{attempt.completed_at}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Subject Statistics</CardTitle>
          <CardDescription>Comprehensive performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Subject</th>
                  <th className="text-left p-3">Average Score</th>
                  <th className="text-left p-3">Total Attempts</th>
                  <th className="text-left p-3">Performance</th>
                </tr>
              </thead>
              <tbody>
                {stats.subject_wise_performance.map((subject, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{subject.subject}</td>
                    <td className="p-3">{subject.avg_score}%</td>
                    <td className="p-3">{subject.attempts}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${subject.avg_score}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{subject.avg_score}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
