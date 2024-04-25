'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/api/createClient';
import AdminDashboard from "@/components/admin/Dashboard";
import UserDashboard from "@/components/user/Dashboard";
import { RoleProvider, useRole } from './providers/RoleContext';

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  const { role } = useRole()

  useEffect(() => {
    async function checkUser() {
      setLoading(true);
      const { data: userData, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error.message);
        router.replace('/login');
      } else if (!userData.user) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    }
    checkUser();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (role === 2) {
    return <AdminDashboard />;
  } else {
    return <UserDashboard />;
  }
}
