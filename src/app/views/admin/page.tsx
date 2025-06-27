'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import AdminBookManager from '../../components/AdminBookManager';

export default function AdminPage() {
  const { userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userProfile) {
      router.push('/views/auth/login');
      return;
    }
    if (!userProfile.is_admin) {
      router.push('/');
    }
  }, [userProfile, router]);

  if (!userProfile || !userProfile.is_admin) {
    return <div className="p-4 text-center text-gray-700">Redirecting...</div>;
  }

  return <AdminBookManager />;
}