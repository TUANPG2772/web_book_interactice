import {copyFile,mkdir} from 'node:fs/promises';
for(const dir of ['assets/vendor','assets/fonts'])await mkdir(dir,{recursive:true});
for(const [from,to] of [
 ['node_modules/gsap/dist/gsap.min.js','assets/vendor/gsap.min.js'],
 ['node_modules/gsap/dist/ScrollTrigger.min.js','assets/vendor/ScrollTrigger.min.js'],
 ['node_modules/lenis/dist/lenis.min.js','assets/vendor/lenis.min.js'],
 ['node_modules/lenis/LICENSE','assets/vendor/LENIS-LICENSE.txt'],
 ['node_modules/@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff2','assets/fonts/archivo-black-latin-400-normal.woff2'],
 ['node_modules/@fontsource/archivo-black/LICENSE','assets/fonts/OFL.txt']
])await copyFile(from,to);
console.log('Local motion libraries and open-license display font prepared.');
