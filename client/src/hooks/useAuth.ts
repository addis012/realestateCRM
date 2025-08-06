import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Get demo role from localStorage for role switching demo
  const demoRole = typeof window !== 'undefined' ? localStorage.getItem('demo-role') : null;
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user", demoRole],
    retry: false,
  });

  // Apply demo role override if set
  const userWithRole = user && demoRole ? { ...user, role: demoRole } : user;

  return {
    user: userWithRole,
    isLoading,
    isAuthenticated: !!user,
  };
}
