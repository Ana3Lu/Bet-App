import 'react-native-url-polyfill/auto';

//import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupabaseClientOptions } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

let options: SupabaseClientOptions<'public'> = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
};

if (typeof window === 'undefined') {
  // Estamos en Node → sin AsyncStorage
  options.auth!.storage = undefined;
} else {
  // Estamos en RN → importa AsyncStorage
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  options.auth!.storage = AsyncStorage;
}

/*export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});*/

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

