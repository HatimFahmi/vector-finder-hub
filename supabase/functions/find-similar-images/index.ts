
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { pipeline } from '@huggingface/transformers'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    
    // Initialize the image classification pipeline
    const classifier = await pipeline(
      'image-classification',
      'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k',
      { device: 'webgpu' }
    );

    // Generate embeddings for the image
    const result = await classifier(imageUrl);
    
    // Connect to Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Query similar images using pgvector
    const { data: similarImages, error } = await supabaseClient.rpc('match_images', {
      query_embedding: result.embedding,
      match_threshold: 0.8,
      match_count: 9
    })

    if (error) throw error

    // Format the response
    const formattedResults = similarImages.map(img => ({
      url: img.url,
      similarity: img.similarity
    }))

    return new Response(
      JSON.stringify(formattedResults),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error processing image:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
