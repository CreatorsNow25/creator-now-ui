
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create profiles table
    await supabaseClient.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
          full_name TEXT,
          avatar_url TEXT,
          role TEXT CHECK (role IN ('storyteller', 'creator')),
          is_online BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
        CREATE POLICY "Users can view all profiles" 
          ON public.profiles FOR SELECT 
          USING (true);

        DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
        CREATE POLICY "Users can update their own profile" 
          ON public.profiles FOR UPDATE 
          USING (auth.uid() = id);

        DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
        CREATE POLICY "Users can insert their own profile" 
          ON public.profiles FOR INSERT 
          WITH CHECK (auth.uid() = id);
      `
    })

    // Create conversations table
    await supabaseClient.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.conversations (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          storyteller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
          creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
          project_id UUID,
          project_title TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
        CREATE POLICY "Users can view their conversations" 
          ON public.conversations FOR SELECT 
          USING (auth.uid() = storyteller_id OR auth.uid() = creator_id);

        DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
        CREATE POLICY "Users can create conversations" 
          ON public.conversations FOR INSERT 
          WITH CHECK (auth.uid() = storyteller_id OR auth.uid() = creator_id);

        DROP POLICY IF EXISTS "Users can update their conversations" ON public.conversations;
        CREATE POLICY "Users can update their conversations" 
          ON public.conversations FOR UPDATE 
          USING (auth.uid() = storyteller_id OR auth.uid() = creator_id);
      `
    })

    // Create messages table
    await supabaseClient.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.messages (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
          sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
          file_url TEXT,
          file_name TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
        CREATE POLICY "Users can view messages in their conversations" 
          ON public.messages FOR SELECT 
          USING (
            EXISTS (
              SELECT 1 FROM public.conversations 
              WHERE conversations.id = messages.conversation_id 
              AND (conversations.storyteller_id = auth.uid() OR conversations.creator_id = auth.uid())
            )
          );

        DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
        CREATE POLICY "Users can send messages" 
          ON public.messages FOR INSERT 
          WITH CHECK (
            auth.uid() = sender_id AND
            EXISTS (
              SELECT 1 FROM public.conversations 
              WHERE conversations.id = messages.conversation_id 
              AND (conversations.storyteller_id = auth.uid() OR conversations.creator_id = auth.uid())
            )
          );
      `
    })

    // Create projects table
    await supabaseClient.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.projects (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          storyteller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
          creator_id UUID REFERENCES public.profiles(id),
          status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'posted', 'in_progress', 'pending_review', 'completed', 'cancelled')),
          budget DECIMAL,
          deadline DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Users can view relevant projects" ON public.projects;
        CREATE POLICY "Users can view relevant projects" 
          ON public.projects FOR SELECT 
          USING (
            auth.uid() = storyteller_id OR 
            auth.uid() = creator_id OR 
            status = 'posted'
          );

        DROP POLICY IF EXISTS "Storytellers can manage their projects" ON public.projects;
        CREATE POLICY "Storytellers can manage their projects" 
          ON public.projects FOR ALL 
          USING (auth.uid() = storyteller_id);

        DROP POLICY IF EXISTS "Creators can update assigned projects" ON public.projects;
        CREATE POLICY "Creators can update assigned projects" 
          ON public.projects FOR UPDATE 
          USING (auth.uid() = creator_id);
      `
    })

    // Create user profile trigger
    await supabaseClient.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, full_name, avatar_url, role)
          VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
            NEW.raw_user_meta_data->>'avatar_url',
            COALESCE(NEW.raw_user_meta_data->>'role', 'storyteller')
          );
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `
    })

    return new Response(
      JSON.stringify({ success: true, message: 'Database setup completed successfully' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Database setup error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
