import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function textResponse(body:string,status=200){return new Response(body,{status,headers:{...corsHeaders,'Content-Type':'text/plain; charset=utf-8'}});}

serve(async (req) => {
  if (req.method === 'OPTIONS') return textResponse('ok');
  if (req.method !== 'POST') return textResponse('Method not allowed',405);
  try {
    let payload:any;
    try { payload = await req.json(); } catch { return textResponse('Invalid JSON',400); }
    const text = String(payload?.text || '').trim();
    if (!text || text.length > 800) return textResponse('Invalid text',400);

    const key = Deno.env.get('ELEVENLABS_API_KEY');
    const voice = Deno.env.get('ELEVENLABS_VOICE_ID');
    const model = Deno.env.get('ELEVENLABS_MODEL_ID') || 'eleven_multilingual_v2';
    if (!key || !voice) return textResponse('Speech secrets not configured',503);

    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`,{
      method:'POST',
      headers:{'xi-api-key':key,'Content-Type':'application/json','Accept':'audio/mpeg'},
      body:JSON.stringify({
        text,
        model_id:model,
        voice_settings:{
          stability:0.50,
          similarity_boost:0.78,
          style:0,
          use_speaker_boost:true,
          speed:0.94
        }
      })
    });
    if(!r.ok) return textResponse((await r.text()).slice(0,1000),r.status);
    const audio = await r.arrayBuffer();
    if(audio.byteLength < 100) return textResponse('Empty audio response',502);
    return new Response(audio,{status:200,headers:{...corsHeaders,'Content-Type':'audio/mpeg','Cache-Control':'private, max-age=86400','X-Sakhi-Voice-Provider':'elevenlabs'}});
  } catch(e) {
    console.error('sakhi-speech',e);
    return textResponse('Speech service error',500);
  }
});
