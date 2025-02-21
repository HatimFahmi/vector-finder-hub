
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImage(file: File) {
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const filePath = `${timestamp}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (error) throw error;
  return data.path;
}

export async function getSimilarImages(imageUrl: string) {
  const { data, error } = await supabase.functions.invoke('find-similar-images', {
    body: { imageUrl },
  });

  if (error) throw error;
  return data;
}
