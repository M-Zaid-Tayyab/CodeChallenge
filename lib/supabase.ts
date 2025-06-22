import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { storage } from '../storage';

const EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const createStorage = () => {
  if (Platform.OS === 'web') {
    const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
    if (isLocalStorageAvailable) {
      return {
        setItem: (key: string, value: string) => {
          localStorage.setItem(key, value);
        },
        getItem: (key: string) => {
          return localStorage.getItem(key);
        },
        removeItem: (key: string) => {
          localStorage.removeItem(key);
        },
      };
    }
  } else {
    return {
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      getItem: (key: string) => {
        const value = storage.getString(key);
        return value === undefined ? null : value;
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
    };
  }
};

export const supabase = createClient(EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    storage: createStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});