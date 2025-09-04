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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const method = req.method
    const url = new URL(req.url)
    const period = url.searchParams.get('period') || 'today'
    const metricType = url.searchParams.get('type')

    if (method === 'GET') {
      let dateFilter = new Date().toISOString().split('T')[0] // Today

      if (period === 'week') {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        dateFilter = weekAgo.toISOString().split('T')[0]
      } else if (period === 'month') {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        dateFilter = monthAgo.toISOString().split('T')[0]
      }

      let query = supabaseClient
        .from('impact_metrics')
        .select('*')
        .order('date', { ascending: false })

      if (period === 'today') {
        query = query.eq('date', dateFilter)
      } else {
        query = query.gte('date', dateFilter)
      }

      if (metricType) {
        query = query.eq('metric_type', metricType)
      }

      const { data, error } = await query

      if (error) throw error

      // Aggregate data for non-today periods
      if (period !== 'today' && data) {
        const aggregated = aggregateMetrics(data)
        return new Response(JSON.stringify(aggregated), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Get recent activities for dashboard
      const { data: activities } = await supabaseClient
        .from('user_activities')
        .select(`
          *,
          profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      const result = {
        metrics: data || [],
        recent_activities: activities || []
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Method not allowed')

  } catch (error) {
    console.error('Error in impact-metrics function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function aggregateMetrics(data: any[]) {
  const aggregated = new Map()

  data.forEach(metric => {
    const key = metric.metric_type
    if (aggregated.has(key)) {
      aggregated.set(key, {
        ...aggregated.get(key),
        value: aggregated.get(key).value + metric.value
      })
    } else {
      aggregated.set(key, { ...metric })
    }
  })

  return Array.from(aggregated.values())
}