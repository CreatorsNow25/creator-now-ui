
import { supabase } from '@/integrations/supabase/client';

export const setupDatabase = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('setup-database');
    
    if (error) {
      console.error('Database setup error:', error);
      throw error;
    }
    
    console.log('Database setup completed:', data);
    return data;
  } catch (error) {
    console.error('Failed to setup database:', error);
    throw error;
  }
};
