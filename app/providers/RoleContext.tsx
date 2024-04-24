'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/app/api/createClient';

// Context type
type RoleContextType = {
  role: number | null;
  setRole: (role: number | null) => void;
  isLoading: boolean;
};

// Create the context
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Provider component
export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<number | null>(1); // Initialize with default role
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessionAndRole() {
      setLoading(true);
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw new Error(`Error fetching session: ${sessionError.message}`);

        if (sessionData?.session?.user) {
          const user = sessionData.session.user;
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role_id')
            .eq('user_id', user.id)
            .maybeSingle();

          if (roleError || !roleData) throw new Error(`Error fetching user role: ${roleError?.message}`);
          setRole(roleData.role_id);
        } else {
          throw new Error('User is not defined');
        }
      } catch (error: any) {
        console.error(error.message);
        setRole(1); // Assign default role of 1 on any error
      } finally {
        setLoading(false);
      }
    }

    fetchSessionAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setRole(null);  // Reset role initially
        fetchSessionAndRole();  // Refetch role when auth state changes
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook to use the role context
export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
