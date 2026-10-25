"""Vendor selected unmodified OpenMoji artwork with its license and hashes."""
import json, hashlib, urllib.request
from pathlib import Path
base='https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/'
target=Path(__file__).resolve().parents[1]/'assets/theme-media/math-stickers'
target.mkdir(parents=True,exist_ok=True)
def get(path):
    with urllib.request.urlopen(base+path,timeout=30) as response:return response.read()
data=json.loads(get('data/openmoji.json'))
selection={'dinosaur':'sauropod','trex':'T-Rex','horse':'horse','unicorn':'unicorn','princess':'princess','chair':'chair','toy':'teddy bear','wand':'magic wand','ring':'ring','mouse':'mouse','cat':'cat','fish':'fish','tropicalfish':'tropical fish','ball':'soccer ball','apple':'red apple','candy':'candy','cake':'shortcake','carrot':'carrot','clip':'paperclip','hat':'top hat','die':'game die','block':'brick','crayon':'crayon','seed':'seedling','butterfly':'butterfly','star':'star'}
manifest={'provider':'OpenMoji','source':'https://github.com/hfg-gmuend/openmoji','license':'CC BY-SA 4.0','license_url':'https://creativecommons.org/licenses/by-sa/4.0/','modified':False,'files':[]}
for name,annotation in selection.items():
    found=next((x for x in data if x['annotation'].lower()==annotation.lower()),None)
    if not found:raise RuntimeError('Missing OpenMoji annotation: '+annotation)
    code=found['hexcode'];asset=get('color/svg/'+code+'.svg')
    if b'<svg' not in asset or b'<script' in asset or b'<image' in asset:raise RuntimeError('Unexpected SVG: '+name)
    (target/(name+'.svg')).write_bytes(asset)
    manifest['files'].append({'name':name,'annotation':annotation,'hexcode':code,'file':name+'.svg','source':base+'color/svg/'+code+'.svg','sha256':hashlib.sha256(asset).hexdigest()})
(target/'LICENSE.txt').write_bytes(get('LICENSE.txt'))
(target/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(target/'ATTRIBUTION.md').write_text('All emojis in this directory designed by [OpenMoji](https://openmoji.org/) — the open-source emoji and icon project. License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).\n\nArtwork is redistributed unmodified. Original sources and hashes are listed in manifest.json. The license applies to these artwork files.\n')
print('Vendored',len(manifest['files']),'OpenMoji stickers with source attribution, license, and integrity hashes.')
