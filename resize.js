const sharp = require('sharp');
sharp('public/pixeleatedme.png')
  .resize({ width: 700 })
  .webp({ quality: 80 })
  .toFile('public/pixeleatedme.webp')
  .then(info => console.log('Successfully resized:', info))
  .catch(err => console.error('Error:', err));
