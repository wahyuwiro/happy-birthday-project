// hooks/useRedirectIfNoSession.ts
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useRedirectIfNoSession = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load

    if (!session) {
      // Redirect to signin page if no session is available
      router.push('/auth/signin');
    }
  }, [session, status, router]);
};

export default useRedirectIfNoSession;
