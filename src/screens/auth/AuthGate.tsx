// src/screens/AuthGate.tsx
import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AuthGate({ navigation }: { navigation: any }) {
  useEffect(() => {
    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;

      if (accessToken) {
        // Optionally: fetch profile from Go backend here
        navigation.replace('Home');
      } else {
        navigation.replace('SignIn');
      }
    };

    restoreSession();
  }, []);

  return null; // or a splash screen spinner if you want
}
