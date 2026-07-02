import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from '@/app/(auth)/login/page';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { RoleGuard } from '@/shared/components/guards/RoleGuard';

// Mock the Auth Store
vi.mock('@/features/auth/store/useAuthStore', () => ({
  useAuthStore: vi.fn()
}));

const mockLogin = vi.fn();

describe('Authentication & Route Guards', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
  });

  describe('Login Flow', () => {
    it('renders login form correctly', () => {
      (useAuthStore as unknown as any).mockReturnValue({
        login: mockLogin,
        isLoading: false,
        isAuthenticated: false,
        isHydrated: true,
        user: null
      });

      render(
        <QueryClientProvider client={queryClient}>
          <LoginPage />
        </QueryClientProvider>
      );
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it.skip('submits credentials to store', async () => {
      (useAuthStore as unknown as any).mockReturnValue({
        login: mockLogin,
        isLoading: false,
        isAuthenticated: false,
        isHydrated: true,
        user: null
      });

      render(<LoginPage />);
      
      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'password123');
      await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });
  });

  describe('RBAC Route Guards', () => {
    it('blocks unauthorized users and shows loading when hydrating', () => {
      (useAuthStore as unknown as any).mockReturnValue({
        isAuthenticated: false,
        isHydrated: false,
        user: null
      });

      render(
        <RoleGuard allowedRoles={["Employer"]}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('allows authorized users to view content', () => {
      (useAuthStore as unknown as any).mockReturnValue({
        isAuthenticated: true,
        isHydrated: true,
        user: { role: 'Employer' }
      });

      render(
        <RoleGuard allowedRoles={["Employer"]}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});
