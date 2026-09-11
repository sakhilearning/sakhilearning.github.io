const { execFileSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const files = [
  'supabase-config.js',
  'sakhi-cloud.js',
  'sakhi-curriculum.js',
  'sakhi-themes.js',
  'sakhi-content.js',
  'sakhi-activities.js',
  'sakhi-plan.js',
  'sakhi-trails.js',
  'sakhi-presentation.js',
  'sakhi-progress.js',
  'sakhi-adaptive.js',
  'sakhi-audio.js',
  'sakhi-art.js',
  'sakhi-templates.js',
  'sakhi-app.js',
  'sw.js'
];

for (const file of files) {
  execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'inherit' });
}
console.log(`Syntax check passed: ${files.length} JavaScript files`);
