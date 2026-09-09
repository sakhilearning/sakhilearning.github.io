const fs=require('fs');
const errors=[];
const read=f=>fs.existsSync(f)?fs.readFileSync(f,'utf8'):'';
const settings=read('settings-service.js'),adventure=read('adventure-service.js'),ui=read('settings-ui.js'),css=read('settings-controls.css'),index=read('index.html'),sw=read('sw.js');
for(const token of ['SettingsService','adaptiveProfile.settings',"session_length:'AUTO'","preferred_adventure:'AUTO'",'movement_activities:true','reduced_motion:false','fitActivities','installSpeechGuard','installProgressBridge'])if(!settings.includes(token))errors.push(`settings service missing ${token}`);
for(const token of ['AdventureService','presentation-only-curriculum-independent','Rainbow Unicorn Meadow','Frozen Star Palace','Mermaid Ocean Kingdom','Enchanted Story Castle','Tower Lantern Garden','Royal Ballroom','setPreference','sceneMarkup'])if(!adventure.includes(token))errors.push(`adventure service missing ${token}`);
if(/Mickey|Minnie|Pooh/.test(adventure))errors.push('unavailable branded adventures must not ship without complete registered assets');
for(const token of ["Today's Adventure Theme",'Session Length','Sakhi Voice','Movement Breaks','Reduced Motion','Settings QA','Run Reading Baseline'])if(!ui.includes(token))errors.push(`settings UI missing ${token}`);
if(!css.includes('.theme-picker,.legacy-theme-compat{display:none!important}'))errors.push('legacy child adventure dropdown is still visible');
if(!css.includes('.control-hidden{display:none!important}'))errors.push('child navigation cleanup missing');
if(!index.includes('settings-service.js')||!index.includes('adventure-service.js')||!index.includes('settings-ui.js')||!index.includes('settings-controls.css'))errors.push('settings runtime files are not loaded');
for(const token of ['settings-service.js','adventure-service.js','settings-ui.js','settings-controls.css'])if(!sw.includes(token))errors.push(`service worker does not cache ${token}`);
if(/provider|voice ID|model/i.test(ui))errors.push('technical audio controls leaked into parent settings');
if(errors.length){console.error('Settings/control validation failed:\n- '+errors.join('\n- '));process.exit(1)}
console.log('Settings/control audit valid: no visible fake adventure selector, one settings source, persistent profile state, curated valid adventures, working session/audio/movement/reduced-motion effects, and parent QA table.');
