const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/main.ts'], // Adjust the entry point as needed
  bundle: true,
  outfile: 'main.js', // Adjust the output file as needed
  platform: 'node', // or 'browser' depending on your target
  target: 'esnext', // Adjust the target as needed
  sourcemap: true, // Optional: include sourcemaps
  minify: true, // Optional: minify the output
  external: ['obsidian'], // Mark 'obsidian' as external
}).catch(() => process.exit(1)); 