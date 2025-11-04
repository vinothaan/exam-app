import { User } from '../types';

// Mock authentication - Replace with your Neon.tech API calls
export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    // TODO: Replace with actual API call to your Neon database
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    
    // Mock users for demo
    const mockUsers: Record<string, User> = {
      'supervisor@test.com': {
        id: '1',
        email: 'supervisor@test.com',
        name: 'Admin User',
        role: 'supervisor',
        created_at: new Date().toISOString(),
      },
      'user@test.com': {
        id: '2',
        email: 'user@test.com',
        name: 'Test Student',
        role: 'user',
        created_at: new Date().toISOString(),
      },
    };

    const user = mockUsers[email];
    if (user && password === 'password123') {
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    return null;
  },

  async signup(email: string, password: string, name: string): Promise<User | null> {
    // TODO: Replace with actual API call to your Neon database
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      created_at: new Date().toISOString(),
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
