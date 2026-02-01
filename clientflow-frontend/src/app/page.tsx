'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './lib/supabaseClient';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    };

    check();
  }, [router]);

  return null;
}

