/* eslint-disable */
const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\tiffany\\.gemini\\antigravity-ide\\brain\\da8601bb-163e-4d75-a074-b92de5ce0710\\app_logo_master_1784120070727.png';
const destDir = path.join(__dirname, '../public/icons');

// 1. Create directory if not exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// 2. Define target icon files
const iconFiles = [
  'icon-72x72.png',
  'icon-96x96.png',
  'icon-128x128.png',
  'icon-144x144.png',
  'icon-152x152.png',
  'icon-192x192.png',
  'icon-384x384.png',
  'icon-512x512.png',
];

try {
  // 3. Copy files
  iconFiles.forEach((file) => {
    const destPath = path.join(destDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied master logo to: ${destPath}`);
  });
  
  // Also copy apple touch icon to public
  const appleTouchPath = path.join(__dirname, '../public/apple-touch-icon.png');
  fs.copyFileSync(srcPath, appleTouchPath);
  console.log(`Copied apple touch icon to: ${appleTouchPath}`);
  
  console.log('SUCCESS: All PWA icons have been initialized.');
} catch (err) {
  console.error('Failed to copy icons:', err);
}
