/** @type {import('next').NextConfig} */

const nextConfig = {
    
}

module.exports = nextConfig

// next.config.js

// const CopyPlugin = require('copy-webpack-plugin');

// module.exports = {
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.plugins.push(
//         new CopyPlugin({
//           patterns: [
//             { from: 'node_modules/tinymce/skins', to: 'public/tinymce/skins' },
//             { from: 'node_modules/tinymce/themes', to: 'public/tinymce/themes' },
//             { from: 'node_modules/tinymce/icons', to: 'public/tinymce/icons' },
//           ],
//         })
//       );
//     }

//     return config;
//   },
// };
