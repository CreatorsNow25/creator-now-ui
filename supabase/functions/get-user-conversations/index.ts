
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

    const { user_id } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    console.log('Fetching conversations for user:', user_id)

    // Get conversations where user is either storyteller or creator
    const { data: conversations, error } = await supabaseClient
      .from('conversations')
      .select(`
        *,
        storyteller_profile:storyteller_id(full_name, avatar_url, role, is_online),
        creator_profile:creator_id(full_name, avatar_url, role, is_online)
      `)
      .or(`storyteller_id.eq.${user_id},creator_id.eq.${user_id}`)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching conversations:', error)
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

    // Transform the data to include participant_profile for easier frontend handling
    const transformedConversations = conversations?.map(conv => {
      const isStoryteller = conv.storyteller_id === user_id
      const participantProfile = isStoryteller ? conv.creator_profile : conv.storyteller_profile
      
      return {
        ...conv,
        participant_profile: participantProfile,
        storyteller_profile: conv.storyteller_profile,
        creator_profile: conv.creator_profile
      }
    }) || []

    console.log('Returning conversations:', transformedConversations)

    return new Response(
      JSON.stringify(transformedConversations),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Function error:', error)
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
