import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const updateProgress = async (level: number) => {
  if (!supabaseUrl) return;
  const { error } = await supabase
    .from('birthday_progress')
    .upsert({ id: 1, current_level: level });
  if (error) console.error('Error updating progress:', error);
};

export const getProgress = async () => {
  if (!supabaseUrl) return 1;
  const { data, error } = await supabase
    .from('birthday_progress')
    .select('current_level')
    .single();
  if (error) return 1;
  return data?.current_level || 1;
};
export const saveWish = async (wish: string) => {
  if (!supabaseUrl) return;
  const { error } = await supabase
    .from('birthday_wishes')
    .insert([{ wish: wish }]);
  if (error) console.error('Error saving wish:', error);
};
