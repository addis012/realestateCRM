import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Get demo role from localStorage for role switching demo
  const demoRole = typeof window !== 'undefined' ? localStorage.getItem('demo-role') : null;
  const queryParams = demoRole ? `?role=${demoRole}` : '';
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user", demoRole],
    queryFn: () => fetch(`/api/auth/user${queryParams}`).then(res => res.json()),
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
