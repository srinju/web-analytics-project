'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from './lib/auth';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        router.push('/dashboard');
      } else {
        router.push('/api/auth/signin');
      }
    };
    
    checkSession();
  }, [router]);

  return <div>Loading...</div>; // You can show a loading spinner or message here
}
