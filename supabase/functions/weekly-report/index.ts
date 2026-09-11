// Sakhi V3 weekly parent report. Deploy as a Supabase Edge Function.
// Secrets live in Supabase, never in the browser or repository:
// RESEND_API_KEY, SAKHI_WEEKLY_REPORT_CRON_SECRET, SAKHI_REPORT_FROM_EMAIL.
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const RESEND_KEY = Deno.env.get('RESEND_API_KEY') || '';
const CRON_SECRET = Deno.env.get('SAKHI_WEEKLY_REPORT_CRON_SECRET') || '';
const FROM_EMAIL = Deno.env.get('SAKHI_REPORT_FROM_EMAIL') || 'Sakhi Learning <onboarding@resend.dev>';

function esc(v: unknown) {
  return String(v ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
}
async function rest(path: string) {
  const r = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
    headers: { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY }
  });
  if (!r.ok) throw new Error('Supabase ' + r.status + ': ' + (await r.text()));
  return await r.json();
}
function domainLabel(id: string) {
  return ({reading:'Reading & Phonics',math:'Math',writing:'Writing',language:'Stories & Language',logic:'Puzzle Power',science:'Discovery Lab'} as Record<string,string>)[id] || id;
}
async function sendEmail(to: string, subject: string, html: string) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type':'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html })
  });
  if (!r.ok) throw new Error('Resend ' + r.status + ': ' + (await r.text()));
  return await r.json();
}

Deno.serve(async (req) => {
  try {
    if (!CRON_SECRET || req.headers.get('x-sakhi-cron-secret') !== CRON_SECRET) return new Response('Unauthorized', {status:401});
    if (!SUPABASE_URL || !SERVICE_KEY || !RESEND_KEY) return new Response('Weekly report secrets are not configured.', {status:503});
    const since = new Date(Date.now() - 7*86400000).toISOString();
    const profiles = await rest('learner_profiles?select=learner_id,display_name,weekly_report_email,weekly_report_enabled,plan_state&weekly_report_enabled=eq.true&weekly_report_email=not.is.null');
    const results: unknown[] = [];
    for (const p of profiles) {
      const id = encodeURIComponent(p.learner_id);
      const [sessions, attempts, skills] = await Promise.all([
        rest(`learning_sessions?select=session_id,started_at,completed_at,duration,status,plan_day_id,week&learner_id=eq.${id}&started_at=gte.${encodeURIComponent(since)}&order=started_at.asc`),
        rest(`learning_attempts?select=domain,skill_id,result,independent_success,hint_level_used,timestamp&learner_id=eq.${id}&timestamp=gte.${encodeURIComponent(since)}&order=timestamp.asc`),
        rest(`learner_skill_progress?select=skill_id,skill_name,domain,mastery_state,mastery_score,independent_accuracy,attempt_count,last_practiced_at&learner_id=eq.${id}&order=last_practiced_at.desc&limit=12`)
      ]);
      const doneSessions = sessions.filter((s: any) => s.status === 'COMPLETED' || (!s.status && s.completed_at));
      const practiceDays = new Set(doneSessions.map((s:any) => String(s.started_at || '').slice(0,10)).filter(Boolean)).size;
      const minutes = Math.round(doneSessions.reduce((n: number,s: any)=>n+(Number(s.duration)||0),0)/60);
      const correct = attempts.filter((a:any)=>a.result==='CORRECT').length;
      const independent = attempts.filter((a:any)=>a.independent_success).length;
      const hinted = attempts.filter((a:any)=>a.result==='CORRECT'&&!a.independent_success).length;
      const byDomain: Record<string,{n:number,c:number,i:number}> = {};
      for (const a of attempts) { const d = byDomain[a.domain] ||= {n:0,c:0,i:0}; d.n++; if(a.result==='CORRECT')d.c++; if(a.independent_success)d.i++; }
      const domainRows = Object.entries(byDomain).map(([k,d])=>`<tr><td>${esc(domainLabel(k))}</td><td>${d.c}/${d.n}</td><td>${d.i}/${d.n}</td></tr>`).join('') || '<tr><td colspan="3">No scored practice yet.</td></tr>';
      const developing = skills.filter((s:any)=>['LEARNING','DEVELOPING','REVIEW_NEEDED'].includes(s.mastery_state)).slice(0,3);
      const strong = skills.filter((s:any)=>['MOSTLY_MASTERED','MASTERED'].includes(s.mastery_state)).slice(0,3);
      const completedDays = Array.isArray(p.plan_state?.completed_day_ids) ? p.plan_state.completed_day_ids.length : 0;
      const learner = esc(p.display_name || 'Your learner');
      const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#39264f;line-height:1.5"><div style="max-width:680px;margin:auto;padding:24px"><h1 style="margin-bottom:4px">✨ ${learner}'s Sakhi week</h1><p style="color:#726780;margin-top:0">A simple evidence summary from the last 7 days.</p><table style="width:100%;border-collapse:collapse;background:#faf7fd;border-radius:16px"><tr><td style="padding:14px"><b>${practiceDays}</b><br>practice days</td><td style="padding:14px"><b>${minutes}</b><br>active minutes</td><td style="padding:14px"><b>${attempts.length}</b><br>questions/tasks</td><td style="padding:14px"><b>${completedDays}/130</b><br>plan days</td></tr></table><h2>How practice looked</h2><p><b>${correct}/${attempts.length || 0}</b> correct · <b>${independent}/${attempts.length || 0}</b> independent · <b>${hinted}</b> correct with support. Correctness and independence are shown separately so support is never hidden inside one score.</p><table style="width:100%;border-collapse:collapse"><thead><tr><th align="left">Trail</th><th align="left">Correct</th><th align="left">Independent</th></tr></thead><tbody>${domainRows}</tbody></table><h2>Growing strengths</h2><ul>${strong.length?strong.map((s:any)=>`<li>${esc(s.skill_name||s.skill_id)} — ${esc(String(s.mastery_state).toLowerCase().replaceAll('_',' '))}</li>`).join(''):'<li>Keep practicing; consolidated skills will appear here.</li>'}</ul><h2>Good next support</h2><ul>${developing.length?developing.map((s:any)=>`<li>${esc(s.skill_name||s.skill_id)} — ${esc(String(s.mastery_state).toLowerCase().replaceAll('_',' '))}</li>`).join(''):'<li>No recent skill is flagged for extra support.</li>'}</ul><p style="margin-top:28px;color:#726780;font-size:13px">Sakhi Learning Trails reports observable practice evidence, not an intelligence score or diagnosis.</p></div></body></html>`;
      const sent = await sendEmail(p.weekly_report_email, `${p.display_name || 'Sakhi'}'s weekly learning trail`, html);
      results.push({learner_id:p.learner_id,to:p.weekly_report_email,message_id:sent.id,attempts:attempts.length,sessions:doneSessions.length,practice_days:practiceDays});
    }
    return Response.json({ok:true,reports:results.length,results});
  } catch (e) {
    console.error(e);
    return Response.json({ok:false,error:e instanceof Error?e.message:String(e)},{status:500});
  }
});
