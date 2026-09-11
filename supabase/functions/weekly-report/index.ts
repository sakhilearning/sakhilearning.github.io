import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
serve(async () => new Response(JSON.stringify({ok:true,note:'Connect this function to your Sakhi learner summary view and preferred email provider. Keep provider keys in Supabase secrets.'}),{headers:{'Content-Type':'application/json'}}));
