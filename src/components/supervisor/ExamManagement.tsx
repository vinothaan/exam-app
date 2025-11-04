import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Plus, Edit, Trash2, Clock, Target, FileText } from 'lucide-react';
import { mockExams, mockQuestions } from '../../lib/mockData';
import { Exam, Question } from '../../types';
import { toast } from 'sonner@2.0.3';

export function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [filterSubject, setFilterSubject] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Banking',
    duration_minutes: 60,
    passing_marks: 40,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    is_active: true,
  });

  const subjects = ['Banking', 'Quantitative Aptitude', 'English Language', 'Reasoning Ability', 'Computer Knowledge'];

  const handleAddExam = () => {
    const questions = mockQuestions.filter(q => selectedQuestions.includes(q.id));
    const total_marks = questions.reduce((sum, q) => sum + q.marks, 0);

    const newExam: Exam = {
      id: `exam_${Date.now()}`,
      ...formData,
      total_marks,
      questions,
      created_by: '1',
      created_at: new Date().toISOString(),
    };

    if (editingExam) {
      setExams(exams.map(e => e.id === editingExam.id ? { ...newExam, id: editingExam.id } : e));
      toast.success('Exam updated successfully');
    } else {
      setExams([...exams, newExam]);
      toast.success('Exam created successfully');
    }

    // TODO: Send to your Neon database
    // await fetch('/api/exams', {
    //   method: editingExam ? 'PUT' : 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newExam)
    // });

    resetForm();
    setIsAddDialogOpen(false);
    setEditingExam(null);
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description,
      subject: exam.subject,
      duration_minutes: exam.duration_minutes,
      passing_marks: exam.passing_marks,
      difficulty: exam.difficulty,
      is_active: exam.is_active,
    });
    setSelectedQuestions(exam.questions.map(q => q.id));
    setIsAddDialogOpen(true);
  };

  const handleDeleteExam = (id: string) => {
    setExams(exams.filter(e => e.id !== id));
    toast.success('Exam deleted successfully');
    
    // TODO: Send to your Neon database
    // await fetch(`/api/exams/${id}`, { method: 'DELETE' });
  };

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: 'Banking',
      duration_minutes: 60,
      passing_marks: 40,
      difficulty: 'medium',
      is_active: true,
    });
    setSelectedQuestions([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredQuestions = filterSubject === 'all' 
    ? mockQuestions 
    : mockQuestions.filter(q => q.subject === filterSubject);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Exam Management</h2>
          <p className="text-gray-600 mt-1">Create and manage examinations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingExam(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingExam ? 'Edit Exam' : 'Create New Exam'}</DialogTitle>
              <DialogDescription>
                {editingExam ? 'Update the exam details' : 'Fill in the details to create a new exam'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Details */}
              <div className="space-y-4">
                <h3 className="text-sm">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Exam Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., SBI PO Prelims Mock Test 1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the exam"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select value={formData.difficulty} onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label>Passing Marks (%)</Label>
                    <Input
                      type="number"
                      value={formData.passing_marks}
                      onChange={(e) => setFormData({ ...formData, passing_marks: parseInt(e.target.value) })}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label>Active (visible to students)</Label>
                  </div>
                </div>
              </div>

              {/* Question Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm">Select Questions ({selectedQuestions.length} selected)</h3>
                  <Select value={filterSubject} onValueChange={setFilterSubject}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-lg max-h-96 overflow-y-auto">
                  <div className="divide-y">
                    {filteredQuestions.map((question) => (
                      <div key={question.id} className="p-3 hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedQuestions.includes(question.id)}
                            onCheckedChange={() => toggleQuestionSelection(question.id)}
                          />
                          <div className="flex-1">
                            <p className="text-sm mb-1">{question.question_text}</p>
                            <div className="flex gap-2 text-xs text-gray-600">
                              <span>{question.subject}</span>
                              <span>•</span>
                              <span>{question.topic}</span>
                              <span>•</span>
                              <Badge className={getDifficultyColor(question.difficulty)}>
                                {question.difficulty}
                              </Badge>
                              <span>•</span>
                              <span>{question.marks} marks</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); setEditingExam(null); }}>
                  Cancel
                </Button>
                <Button onClick={handleAddExam} disabled={selectedQuestions.length === 0}>
                  {editingExam ? 'Update' : 'Create'} Exam
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Exams Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <Card key={exam.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{exam.title}</CardTitle>
                  <CardDescription className="mt-1">{exam.description}</CardDescription>
                </div>
                <Badge className={getDifficultyColor(exam.difficulty)}>
                  {exam.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{exam.duration_minutes} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="h-4 w-4" />
                  <span>{exam.total_marks} marks • {exam.passing_marks}% to pass</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>{exam.questions.length} questions</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Badge variant={exam.is_active ? 'default' : 'secondary'}>
                  {exam.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditExam(exam)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteExam(exam.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {exams.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No exams created yet</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Exam
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
