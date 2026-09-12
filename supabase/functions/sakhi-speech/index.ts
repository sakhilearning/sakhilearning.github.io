import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const PROD_ORIGIN = "https://sakhilearning.github.io";
const allowedKinds = new Set(["instruction", "character", "word", "story", "feedback"]);
const allowedProfiles = new Set(["sakhi", "ice", "ocean", "book", "luna"]);

function cors() {
  return {
    "Access-Control-Allow-Origin": PROD_ORIGIN,
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function originOK(req: Request) {
  return req.headers.get("origin") === PROD_ORIGIN;
}

function keyOK(req: Request) {
  const supplied = req.headers.get("apikey") || "";
  const legacy = Deno.env.get("SUPABASE_ANON_KEY") || "";
  if (legacy && supplied === legacy) return true;
  try {
    return Object.values(JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}"))
      .map(String)
      .includes(supplied);
  } catch {
    return false;
  }
}

Deno.serve(async (req: Request) => {
  const headers = cors();
  if (req.method === "OPTIONS") {
    return originOK(req)
      ? new Response("ok", { headers })
      : new Response("Forbidden", { status: 403, headers });
  }
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers });
  }
  if (!originOK(req)) {
    return Response.json({ error: "Origin not allowed" }, { status: 403, headers });
  }
  if (!keyOK(req)) {
    return Response.json({ error: "Invalid client key" }, { status: 401, headers });
  }

  try {
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    const voiceId = Deno.env.get("ELEVENLABS_VOICE_ID") || Deno.env.get("SAKHI_VOICE_ID");
    const modelId = Deno.env.get("ELEVENLABS_MODEL_ID") || "eleven_multilingual_v2";
    if (!apiKey || !voiceId) {
      return Response.json({ error: "TTS secrets are not configured" }, { status: 503, headers });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400, headers });
    }

    const kind = String(body?.kind || "instruction");
    if (!allowedKinds.has(kind)) {
      return Response.json({ error: "Unsupported narration kind" }, { status: 400, headers });
    }
    const requestedProfile = String(body?.profile || "sakhi");
    const profile = allowedProfiles.has(requestedProfile) ? requestedProfile : "sakhi";
    const text = String(body?.text || "").trim();
    if (!text || text.length > 800) {
      return Response.json({ error: "Text must be between 1 and 800 characters" }, { status: 400, headers });
    }

    const settings: Record<string, { stability: number; style: number; similarity_boost: number; speed: number }> = {
      sakhi: { stability: 0.50, style: 0, similarity_boost: 0.78, speed: 0.94 },
      ice: { stability: 0.60, style: 0.18, similarity_boost: 0.74, speed: 0.94 },
      ocean: { stability: 0.48, style: 0.32, similarity_boost: 0.76, speed: 0.94 },
      book: { stability: 0.62, style: 0.14, similarity_boost: 0.74, speed: 0.94 },
      luna: { stability: 0.45, style: 0.36, similarity_boost: 0.76, speed: 0.94 },
    };
    const s = settings[profile];
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            stability: s.stability,
            similarity_boost: s.similarity_boost,
            style: s.style,
            use_speaker_boost: true,
            speed: s.speed,
          },
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error("ElevenLabs error", response.status, detail);
      let providerError = "Provider rejected the request";
      try {
        const parsed = JSON.parse(detail);
        providerError = String(parsed?.detail?.message || parsed?.detail?.status || parsed?.message || providerError);
      } catch {
        providerError = detail || providerError;
      }
      return Response.json(
        { error: "Voice generation failed", status: response.status, provider_error: providerError.slice(0, 220) },
        { status: 502, headers },
      );
    }

    const audio = await response.arrayBuffer();
    if (audio.byteLength < 100) {
      return Response.json({ error: "Empty audio response" }, { status: 502, headers });
    }
    return new Response(audio, {
      status: 200,
      headers: {
        ...headers,
        "Content-Type": "audio/mpeg",
        "Cache-Control": kind === "story" ? "private, max-age=300" : "private, max-age=86400",
        "X-Sakhi-Voice-Provider": "elevenlabs",
      },
    });
  } catch (error) {
    console.error("sakhi-tts", error);
    return Response.json({ error: "Unexpected TTS error" }, { status: 500, headers });
  }
});
