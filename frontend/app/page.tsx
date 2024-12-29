'use client';

import UserList from '@/components/UserList';
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import React, { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load

    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Welcome to the Happy Birthday User Management</h1>
      <p className="mb-4">
        This application allows you to manage user, create, edit, and delete user effortlessly and also send a happy birthday message to user.
      </p>
      <UserList />
    </div>
  );
}
