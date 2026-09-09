(function(){
'use strict';
const registry={
  t:{phoneme_id:'phoneme_t',grapheme:'t',ipa:'t',audio_asset:'./assets/audio/phonemes/phoneme_t.ogg',source:'Wikimedia Commons — Voiceless alveolar plosive [t]',source_url:'https://commons.wikimedia.org/wiki/File:Voiceless_alveolar_plosive.ogg',license:'CC BY-SA 3.0 / GFDL',source_verified:true,pedagogical_validation:'SOURCE_VERIFIED',notes:'Isolated voiceless alveolar stop source. No browser-TTS fallback is permitted.'},
  p:{phoneme_id:'phoneme_p',grapheme:'p',ipa:'p',audio_asset:'./assets/audio/phonemes/phoneme_p.ogg',source:'Wikimedia Commons — Voiceless bilabial plosive [p]',source_url:'https://commons.wikimedia.org/wiki/File:Voiceless_bilabial_plosive.ogg',license:'CC BY-SA 3.0 / GFDL',source_verified:true,pedagogical_validation:'SOURCE_VERIFIED',notes:'Isolated voiceless bilabial stop source. No browser-TTS fallback is permitted.'}
};
window.SAKHI_PHONEME_REGISTRY=Object.freeze(registry);
window.SAKHI_PHONEME_AUDIO=Object.freeze(Object.fromEntries(Object.entries(registry).filter(([,v])=>v.audio_asset).map(([k,v])=>[k,v.audio_asset])));
})();
