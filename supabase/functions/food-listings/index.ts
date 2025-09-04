import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const method = req.method
    const url = new URL(req.url)
    const listingId = url.searchParams.get('id')

    if (method === 'GET') {
      // Get all food listings or specific listing
      let query = supabaseClient
        .from('food_listings')
        .select('*')
        .order('created_at', { ascending: false })

      if (listingId) {
        query = query.eq('id', listingId).single()
      }

      const { data, error } = await query

      if (error) throw error

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (method === 'POST') {
      // Create new food listing
      const body = await req.json()
      const { food_type, quantity, description, location, available_until, contact_info } = body

      if (!food_type || !quantity || !location || !available_until || !contact_info) {
        throw new Error('Missing required fields')
      }

      const { data, error } = await supabaseClient
        .from('food_listings')
        .insert({
          user_id: user.id,
          food_type,
          quantity,
          description,
          location,
          available_until,
          contact_info,
          status: 'available'
        })
        .select()
        .single()

      if (error) throw error

      // Log user activity
      await supabaseClient
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'donation_created',
          description: `Created donation listing for ${food_type}`,
          related_id: data.id,
          location
        })

      // Update impact metrics
      await updateImpactMetrics(supabaseClient, 'donations_completed', 1)

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (method === 'PUT') {
      // Update food listing
      if (!listingId) {
        throw new Error('Listing ID required for update')
      }

      const body = await req.json()
      const { status } = body

      const { data, error } = await supabaseClient
        .from('food_listings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', listingId)
        .eq('user_id', user.id) // Ensure user can only update their own listings
        .select()
        .single()

      if (error) throw error

      // Log activity based on status change
      if (status === 'reserved') {
        await supabaseClient
          .from('user_activities')
          .insert({
            user_id: user.id,
            activity_type: 'donation_reserved',
            description: `Reserved donation: ${data.food_type}`,
            related_id: data.id,
            location: data.location
          })

        await updateImpactMetrics(supabaseClient, 'meals_saved', estimateMealsFromQuantity(data.quantity))
      } else if (status === 'completed') {
        await supabaseClient
          .from('user_activities')
          .insert({
            user_id: user.id,
            activity_type: 'donation_completed',
            description: `Completed donation: ${data.food_type}`,
            related_id: data.id,
            location: data.location
          })

        await updateImpactMetrics(supabaseClient, 'users_helped', 1)
        await updateImpactMetrics(supabaseClient, 'waste_reduced', estimateWasteReduced(data.quantity))
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (method === 'DELETE') {
      // Delete food listing
      if (!listingId) {
        throw new Error('Listing ID required for deletion')
      }

      const { error } = await supabaseClient
        .from('food_listings')
        .delete()
        .eq('id', listingId)
        .eq('user_id', user.id) // Ensure user can only delete their own listings

      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Method not allowed')

  } catch (error) {
    console.error('Error in food-listings function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

// Helper function to update impact metrics
async function updateImpactMetrics(supabaseClient: any, metricType: string, increment: number) {
  try {
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current metric value
    const { data: currentMetric } = await supabaseService
      .from('impact_metrics')
      .select('*')
      .eq('metric_type', metricType)
      .eq('date', new Date().toISOString().split('T')[0])
      .single()

    if (currentMetric) {
      // Update existing metric
      await supabaseService
        .from('impact_metrics')
        .update({ 
          value: currentMetric.value + increment,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentMetric.id)
    } else {
      // Create new metric for today
      await supabaseService
        .from('impact_metrics')
        .insert({
          metric_type: metricType,
          value: increment,
          date: new Date().toISOString().split('T')[0]
        })
    }
  } catch (error) {
    console.error('Error updating impact metrics:', error)
  }
}

// Helper function to estimate meals from quantity string
function estimateMealsFromQuantity(quantity: string): number {
  const numbers = quantity.match(/\d+/g)
  if (!numbers) return 1

  const num = parseInt(numbers[0])
  
  if (quantity.toLowerCase().includes('lb') || quantity.toLowerCase().includes('pound')) {
    return Math.max(1, Math.floor(num * 2)) // Rough estimate: 1 lb = 2 meals
  } else if (quantity.toLowerCase().includes('serving')) {
    return num
  } else {
    return Math.max(1, Math.floor(num / 2)) // Conservative estimate
  }
}

// Helper function to estimate waste reduced in lbs
function estimateWasteReduced(quantity: string): number {
  const numbers = quantity.match(/\d+/g)
  if (!numbers) return 1

  const num = parseInt(numbers[0])
  
  if (quantity.toLowerCase().includes('lb') || quantity.toLowerCase().includes('pound')) {
    return num
  } else {
    return Math.max(1, Math.floor(num * 0.5)) // Conservative estimate
  }
}