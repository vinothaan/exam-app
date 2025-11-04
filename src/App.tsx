import { useState, useEffect } from 'react';
import { User, Exam, ExamAttempt } from './types';
import { authService } from './lib/auth';

// Theme Components
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';

// Auth Components
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';

// Supervisor Components
import { SupervisorDashboard } from './components/supervisor/SupervisorDashboard';
import { QuestionManagement } from './components/supervisor/QuestionManagement';
import { ExamManagement } from './components/supervisor/ExamManagement';

// User Components
import { UserDashboard } from './components/user/UserDashboard';
import { ExamList } from './components/user/ExamList';
import { ExamTaking } from './components/user/ExamTaking';
import { ExamResults } from './components/user/ExamResults';
import { AttendedExams } from './components/user/AttendedExams';

// UI Components
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { 
  LayoutDashboard, 
  FileQuestion, 
  BookOpen, 
  LogOut, 
  GraduationCap,
  ClipboardList,
  Menu,
  X
} from 'lucide-react';

type AuthView = 'login' | 'signup';
type SupervisorView = 'dashboard' | 'questions' | 'exams';
type UserView = 'dashboard' | 'exams' | 'attended' | 'taking' | 'results';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [supervisorView, setSupervisorView] = useState<SupervisorView>('dashboard');
  const [userView, setUserView] = useState<UserView>('dashboard');
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setAuthView('login');
    setSupervisorView('dashboard');
    setUserView('dashboard');
  };

  const handleStartExam = (exam: Exam) => {
    setCurrentExam(exam);
    setUserView('taking');
  };

  const handleCompleteExam = (attempt: ExamAttempt) => {
    setCurrentAttempt(attempt);
    setUserView('results');
  };

  const handleViewResults = (exam: Exam, attempt: ExamAttempt) => {
    setCurrentExam(exam);
    setCurrentAttempt(attempt);
    setUserView('results');
  };

  const handleRetakeExam = () => {
    if (currentExam) {
      setUserView('taking');
      setCurrentAttempt(null);
    }
  };

  // Auth Views
  if (!user) {
    if (authView === 'login') {
      return (
        <ThemeProvider>
          <LoginPage 
            onLogin={handleLogin} 
            onSwitchToSignup={() => setAuthView('signup')} 
          />
          <Toaster />
        </ThemeProvider>
      );
    }
    return (
      <ThemeProvider>
        <SignupPage 
          onSignup={handleLogin} 
          onSwitchToLogin={() => setAuthView('login')} 
        />
        <Toaster />
      </ThemeProvider>
    );
  }

  // User Taking Exam
  if (user.role === 'user' && userView === 'taking' && currentExam) {
    return (
      <ThemeProvider>
        <ExamTaking 
          exam={currentExam} 
          onComplete={handleCompleteExam}
          onExit={() => setUserView('exams')}
        />
        <Toaster />
      </ThemeProvider>
    );
  }

  // User Viewing Results
  if (user.role === 'user' && userView === 'results' && currentExam && currentAttempt) {
    return (
      <ThemeProvider>
        <ExamResults 
          exam={currentExam}
          attempt={currentAttempt}
          onGoHome={() => setUserView('dashboard')}
          onRetake={handleRetakeExam}
        />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Main Dashboard Layout
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg">Bank Exam Prep</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {user.role === 'supervisor' ? 'Supervisor Panel' : 'Student Portal'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="hidden md:block text-right mr-2">
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <aside className={`
              ${isMobileMenuOpen ? 'block' : 'hidden'} md:block
              w-full md:w-64 space-y-2
            `}>
              <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 p-2">
              {user.role === 'supervisor' ? (
                <>
                  <Button
                    variant={supervisorView === 'dashboard' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      setSupervisorView('dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant={supervisorView === 'questions' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      setSupervisorView('questions');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <FileQuestion className="h-4 w-4 mr-2" />
                    Questions
                  </Button>
                  <Button
                    variant={supervisorView === 'exams' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      setSupervisorView('exams');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Exams
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={userView === 'dashboard' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      setUserView('dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant={userView === 'exams' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      setUserView('exams');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Available Exams
                  </Button>
                  <Button
                    variant={userView === 'attended' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      setUserView('attended');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Attended Exams
                  </Button>
                </>
              )}
            </div>
          </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 p-6">
                {user.role === 'supervisor' ? (
                  <>
                    {supervisorView === 'dashboard' && <SupervisorDashboard />}
                    {supervisorView === 'questions' && <QuestionManagement />}
                    {supervisorView === 'exams' && <ExamManagement />}
                  </>
                ) : (
                  <>
                    {userView === 'dashboard' && <UserDashboard />}
                    {userView === 'exams' && <ExamList onStartExam={handleStartExam} />}
                    {userView === 'attended' && <AttendedExams onViewDetails={handleViewResults} />}
                  </>
                )}
              </div>
            </main>
          </div>
        </div>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}
