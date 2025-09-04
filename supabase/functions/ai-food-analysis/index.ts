import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FoodAnalysisResult {
  food_name: string;
  category: string;
  freshness: 'excellent' | 'good' | 'fair' | 'poor';
  estimated_expiry: string;
  nutritional_value: string;
  donation_suitability: 'excellent' | 'good' | 'not_recommended';
  confidence: number;
  analysis_data: any;
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

    const { imageData } = await req.json()
    
    if (!imageData) {
      throw new Error('No image data provided')
    }

    console.log('Starting AI food analysis for user:', user.id)

    // Initialize Hugging Face
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Convert base64 to blob for analysis
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '')
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))

    // Use image classification to identify the food
    const classificationResult = await hf.imageClassification({
      data: imageBuffer,
      model: 'google/vit-base-patch16-224'
    })

    console.log('Classification result:', classificationResult)

    // Process the classification results to determine food properties
    const topResult = classificationResult[0]
    const confidence = Math.round(topResult.score * 100)
    
    // Enhanced food analysis based on classification
    const analysisResult = analyzeFoodProperties(topResult.label, confidence)
    
    // Save analysis to database
    const { data: savedAnalysis, error: dbError } = await supabaseClient
      .from('food_analysis')
      .insert({
        user_id: user.id,
        food_name: analysisResult.food_name,
        category: analysisResult.category,
        freshness: analysisResult.freshness,
        estimated_expiry: analysisResult.estimated_expiry,
        nutritional_value: analysisResult.nutritional_value,
        donation_suitability: analysisResult.donation_suitability,
        confidence: analysisResult.confidence,
        analysis_data: {
          classification_results: classificationResult,
          top_prediction: topResult
        }
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Continue even if DB save fails
    }

    // Log user activity
    await supabaseClient
      .from('user_activities')
      .insert({
        user_id: user.id,
        activity_type: 'food_scanned',
        description: `Scanned ${analysisResult.food_name} with ${confidence}% confidence`,
        related_id: savedAnalysis?.id
      })
      .catch(console.error)

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in AI food analysis:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function analyzeFoodProperties(label: string, confidence: number): FoodAnalysisResult {
  const labelLower = label.toLowerCase()
  
  // Determine food category
  let category = 'Other'
  if (labelLower.includes('fruit') || ['apple', 'banana', 'orange', 'berry', 'grape'].some(f => labelLower.includes(f))) {
    category = 'Fruit'
  } else if (labelLower.includes('vegetable') || ['carrot', 'broccoli', 'lettuce', 'tomato', 'potato'].some(v => labelLower.includes(v))) {
    category = 'Vegetables'
  } else if (labelLower.includes('bread') || labelLower.includes('bakery') || labelLower.includes('pastry')) {
    category = 'Bakery'
  } else if (labelLower.includes('meat') || labelLower.includes('chicken') || labelLower.includes('beef')) {
    category = 'Meat'
  } else if (labelLower.includes('dairy') || labelLower.includes('milk') || labelLower.includes('cheese')) {
    category = 'Dairy'
  }

  // Determine freshness based on confidence and food type
  let freshness: 'excellent' | 'good' | 'fair' | 'poor'
  if (confidence > 85) {
    freshness = 'excellent'
  } else if (confidence > 70) {
    freshness = 'good'
  } else if (confidence > 50) {
    freshness = 'fair'
  } else {
    freshness = 'poor'
  }

  // Determine expiry based on category
  let estimatedExpiry: string
  switch (category) {
    case 'Fruit':
      estimatedExpiry = '3-7 days'
      break
    case 'Vegetables':
      estimatedExpiry = '5-10 days' 
      break
    case 'Bakery':
      estimatedExpiry = '1-3 days'
      break
    case 'Meat':
      estimatedExpiry = '1-2 days'
      break
    case 'Dairy':
      estimatedExpiry = '3-5 days'
      break
    default:
      estimatedExpiry = '2-5 days'
  }

  // Determine nutritional value
  let nutritionalValue: string
  switch (category) {
    case 'Fruit':
      nutritionalValue = 'High in vitamins, fiber, and antioxidants'
      break
    case 'Vegetables':
      nutritionalValue = 'Rich in vitamins, minerals, and fiber'
      break
    case 'Bakery':
      nutritionalValue = 'Carbohydrates and energy'
      break
    case 'Meat':
      nutritionalValue = 'High protein and essential amino acids'
      break
    case 'Dairy':
      nutritionalValue = 'Calcium, protein, and vitamins'
      break
    default:
      nutritionalValue = 'Varied nutritional content'
  }

  // Determine donation suitability
  let donationSuitability: 'excellent' | 'good' | 'not_recommended'
  if (freshness === 'excellent' || freshness === 'good') {
    donationSuitability = 'excellent'
  } else if (freshness === 'fair') {
    donationSuitability = 'good'
  } else {
    donationSuitability = 'not_recommended'
  }

  // Clean up the food name
  const foodName = label.split(',')[0].trim().replace(/^(a |an |the )/i, '')
    .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return {
    food_name: foodName,
    category,
    freshness,
    estimated_expiry: estimatedExpiry,
    nutritional_value: nutritionalValue,
    donation_suitability: donationSuitability,
    confidence,
    analysis_data: { processed_label: label }
  }
}