import { ReactNode, useEffect, useState } from 'react';
import { authService } from '../lib/auth';
import { User } from '../types';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'supervisor' | 'user';
  onUnauthorized: () => void;
}

export function AuthGuard({ children, requiredRole, onUnauthorized }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser) {
      onUnauthorized();
      setLoading(false);
      return;
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      onUnauthorized();
      setLoading(false);
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [requiredRole, onUnauthorized]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
