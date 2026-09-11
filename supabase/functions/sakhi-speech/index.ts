import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok',{headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'}});
  try {
    const { text } = await req.json();
    if (!text || String(text).length > 800) return new Response('Invalid text',{status:400});
    const key = Deno.env.get('ELEVENLABS_API_KEY');
    const voice = Deno.env.get('ELEVENLABS_VOICE_ID');
    const model = Deno.env.get('ELEVENLABS_MODEL_ID') || 'eleven_flash_v2_5';
    if (!key || !voice) return new Response('Speech secrets not configured',{status:503});
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`,{
      method:'POST',headers:{'xi-api-key':key,'Content-Type':'application/json','Accept':'audio/mpeg'},
      body:JSON.stringify({text:String(text),model_id:model,voice_settings:{stability:.58,similarity_boost:.78,style:.18,use_speaker_boost:true}})
    });
    if(!r.ok) return new Response(await r.text(),{status:r.status});
    return new Response(await r.arrayBuffer(),{headers:{'Content-Type':'audio/mpeg','Cache-Control':'private, max-age=86400','Access-Control-Allow-Origin':'*'}});
  } catch(e) { return new Response(String(e),{status:500}); }
});
