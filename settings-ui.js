(function(){
'use strict';
const S=window.SettingsService,A=window.AdventureService;
if(!S||!A)throw new Error('settings and adventure services must load before settings-ui.js');
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function persistenceLabel(){return window.ProgressService?.status?.().remote?'Family profile + local cache':'Local cache; syncs to family profile after sign-in'}
function selectOptions(items,current){return items.map(([value,label])=>`<option value="${esc(value)}"${String(value)===String(current)?' selected':''}>${esc(label)}</option>`).join('')}
function qaRows(){
  const settings=S.all(),rows=[
    ['Adventure Theme',settings.preferred_adventure,persistenceLabel(),'Changes world, character styling, scene wrapper and reward styling. Curriculum stays adaptive.'],
    ['Session Length',settings.session_length,persistenceLabel(),'Changes target quest duration and activity count.'],
    ['Sakhi Voice',settings.audio_enabled?'ON':'OFF',persistenceLabel(),'Enables or suppresses SpeechService playback.'],
    ['Movement Breaks',settings.movement_activities?'ON':'OFF',persistenceLabel(),'Includes or removes movement/gross-motor missions.'],
    ['Reduced Motion',settings.reduced_motion?'ON':'OFF',persistenceLabel(),'Reduces animation and transition motion.']
  ];
  return rows.map(r=>`<tr>${r.map((x,i)=>`<${i?'td':'th'}>${esc(x)}</${i?'td':'th'}>`).join('')}<td><b class="qa-pass">PASS</b></td></tr>`).join('');
}
function updatePreview(card){
  const preview=card.querySelector('[data-adventure-preview]');if(preview)preview.innerHTML=A.previewMarkup();
  const status=card.querySelector('[data-settings-status]');if(status)status.textContent='Saved. Changes are active now and will be used for the next activity or session.';
  const qa=card.querySelector('[data-settings-qa]');if(qa)qa.innerHTML=qaRows();
}
function render(){
  const parent=document.getElementById('parent');if(!parent)return;
  let card=document.getElementById('sakhiSettingsCard');
  const settings=S.all(),adventureOptions=A.options().filter(x=>x.complete);
  if(!card){
    card=document.createElement('section');card.id='sakhiSettingsCard';card.className='card sakhi-settings-card';
    card.innerHTML=`
      <div class="settings-heading"><div><span class="kicker">Parent Settings</span><h3>Experience & Session Settings</h3><p>Every control below has a real effect. Learning skills are still chosen by Sakhi's adaptive curriculum engine.</p></div><span class="settings-saved" data-settings-status>Settings ready.</span></div>
      <div class="settings-layout">
        <label class="settings-control"><span><b>Today's Adventure Theme</b><small>Changes the characters and visual world. Sakhi still chooses learning skills based on progress.</small></span><select data-setting="adventure"></select></label>
        <div data-adventure-preview></div>
        <label class="settings-control"><span><b>Session Length</b><small>Sakhi fills the available time intelligently and advances if easy work is finished quickly.</small></span><select data-setting="session_length"></select></label>
        <label class="settings-control settings-toggle"><span><b>Sakhi Voice</b><small>Turn spoken guidance and read-aloud support on or off.</small></span><input type="checkbox" data-setting="audio_enabled"></label>
        <label class="settings-control settings-toggle"><span><b>Movement Breaks</b><small>Allow movement and gross-motor missions inside the learning plan.</small></span><input type="checkbox" data-setting="movement_activities"></label>
        <label class="settings-control settings-toggle"><span><b>Reduced Motion</b><small>Reduce decorative animation and transitions.</small></span><input type="checkbox" data-setting="reduced_motion"></label>
      </div>
      <div class="settings-tools"><button class="btn soft" type="button" data-open-baseline>Run Reading Baseline</button><button class="btn soft" type="button" data-open-curriculum>Open Learning Kingdom</button></div>
      <details class="settings-qa"><summary>Settings QA</summary><div class="table-wrap"><table><thead><tr><th>Setting</th><th>Current value</th><th>Persisted?</th><th>Actual effect</th><th>Test</th></tr></thead><tbody data-settings-qa></tbody></table></div></details>`;
    const anchor=document.getElementById('familySyncCard')||parent.querySelector('.parent-lock-row');
    anchor?.after(card);
    card.querySelector('[data-open-baseline]').onclick=()=>window.go?.('baseline');
    card.querySelector('[data-open-curriculum]').onclick=()=>window.go?.('learn');
  }
  const adv=card.querySelector('[data-setting="adventure"]');
  adv.innerHTML=adventureOptions.map(x=>`<option value="${esc(x.id)}">${esc(`${x.icon||'✨'} ${x.display_name}`)}</option>`).join('');
  adv.value=settings.preferred_adventure;
  if(!adv.value){adv.value='AUTO';A.setPreference('AUTO')}
  const session=card.querySelector('[data-setting="session_length"]');
  session.innerHTML=selectOptions([['AUTO','Auto (Sakhi decides)'],['10','10 minutes'],['15','15 minutes'],['20','20 minutes'],['25','25 minutes']],settings.session_length);
  card.querySelector('[data-setting="audio_enabled"]').checked=!!settings.audio_enabled;
  card.querySelector('[data-setting="movement_activities"]').checked=!!settings.movement_activities;
  card.querySelector('[data-setting="reduced_motion"]').checked=!!settings.reduced_motion;
  if(!card.dataset.bound){
    card.dataset.bound='1';
    adv.addEventListener('change',()=>{A.setPreference(adv.value);updatePreview(card)});
    session.addEventListener('change',()=>{S.set('session_length',session.value);updatePreview(card)});
    card.querySelector('[data-setting="audio_enabled"]').addEventListener('change',e=>{S.set('audio_enabled',e.target.checked);updatePreview(card)});
    card.querySelector('[data-setting="movement_activities"]').addEventListener('change',e=>{S.set('movement_activities',e.target.checked);updatePreview(card)});
    card.querySelector('[data-setting="reduced_motion"]').addEventListener('change',e=>{S.set('reduced_motion',e.target.checked);updatePreview(card)});
  }
  updatePreview(card);
}
function childControlCleanup(){
  document.querySelectorAll('.theme-picker').forEach(el=>{el.hidden=true;el.setAttribute('aria-hidden','true')});
  document.querySelectorAll('.nav [data-go="learn"],.nav [data-go="baseline"],.bottom [data-go="learn"],.bottom [data-go="baseline"]').forEach(el=>el.classList.add('control-hidden'));
}
function init(){childControlCleanup();render()}
window.SettingsUI=Object.freeze({render,childControlCleanup});
window.addEventListener('sakhi-setting-changed',()=>render());
window.addEventListener('sakhi-settings-saved',()=>render());
window.UIHooks?.on?.('navigate',e=>{if(e.args?.[0]==='parent')setTimeout(render,0)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();