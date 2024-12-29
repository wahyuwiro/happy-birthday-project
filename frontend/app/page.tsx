'use client';

import UserList from '@/components/UserList';

import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession(); // You can also check `status` for loading states
  console.log('info :',{
    session: session,
    status : status
  });

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
