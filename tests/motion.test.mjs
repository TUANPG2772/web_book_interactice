import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {Window} from 'happy-dom';
import {carouselState,mountMotion,unmountMotion} from '../src/motion.js';
import {bookCarousel,motionHero,fanJourney,unboxing,genreExplorer} from '../src/home.js';
import {books} from '../src/data.js';
import {svgArt} from '../src/art.js';
const cover=b=>`<div class="book-cover"><img src="${b.coverImage}" alt="${b.title}"></div>`;
const dom=()=>{const win=new Window({url:'http://localhost:3000/',settings:{disableJavaScriptFileLoading:true,disableCSSFileLoading:true}});for(const key of ['window','document','location','localStorage'])globalThis[key]=win[key];globalThis.matchMedia=()=>({matches:false});return win;};

test('carousel limits remain valid at the start, end, and when all cards fit',()=>{
 assert.deepEqual(carouselState(0,800,1500),{max:700,previous:false,next:true,progress:0});
 assert.deepEqual(carouselState(700,800,1500),{max:700,previous:true,next:false,progress:1});
 assert.deepEqual(carouselState(0,1600,1500),{max:0,previous:false,next:false,progress:0});
});

test('carousel keyboard, drag click suppression, and route cleanup work without animation libraries',async()=>{
 const win=dom();document.body.innerHTML='<main id="main">'+bookCarousel(books,cover)+'</main>';
 const rail=document.querySelector('.book-rail');Object.defineProperty(rail,'clientWidth',{value:600});Object.defineProperty(rail,'scrollWidth',{value:1500});mountMotion();
 const next=document.querySelector('[data-carousel-next]');next.click();assert.equal(rail.scrollLeft,316);
 rail.dispatchEvent(new win.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(rail.scrollLeft,632);
 next.click();assert.equal(rail.scrollLeft,900);assert.equal(next.disabled,true);
 rail.dispatchEvent(new win.PointerEvent('pointerdown',{button:0,pointerType:'mouse',clientX:300,bubbles:true}));
 win.dispatchEvent(new win.PointerEvent('pointermove',{clientX:380,bubbles:true}));win.dispatchEvent(new win.PointerEvent('pointerup',{bubbles:true}));
 assert.equal(rail.scrollLeft,820);let clicks=0;document.addEventListener('click',()=>clicks++);document.querySelector('.shelf-cover').click();assert.equal(clicks,0); // drag must not open a preview
 unmountMotion();const before=rail.scrollLeft;rail.dispatchEvent(new win.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));assert.equal(rail.scrollLeft,before);
 await win.happyDOM.abort();
});

test('all catalog covers, runtime libraries, and the local display font are bundled',async()=>{
 for(const book of books)await access(new URL('../'+book.coverImage,import.meta.url));
 for(const file of ['assets/vendor/gsap.min.js','assets/vendor/ScrollTrigger.min.js','assets/vendor/lenis.min.js','assets/fonts/archivo-black-latin-400-normal.woff2'])await access(new URL('../'+file,import.meta.url));
});

test('real GSAP/ScrollTrigger runtime mounts and tears down all motion sections',async()=>{
 const win=dom();globalThis.matchMedia=q=>({matches:q.includes('pointer: fine'),addEventListener(){},removeEventListener(){}});
 document.body.innerHTML='<header class="header"></header><main id="main">'+motionHero(books,cover)+bookCarousel(books,cover)+fanJourney(svgArt)+unboxing(books,cover)+genreExplorer(books,cover)+'</main>';
 win.eval(await readFile(new URL('../assets/vendor/gsap.min.js',import.meta.url),'utf8'));
 win.eval(await readFile(new URL('../assets/vendor/ScrollTrigger.min.js',import.meta.url),'utf8'));
 win.eval(await readFile(new URL('../assets/vendor/lenis.min.js',import.meta.url),'utf8'));
 try{
 mountMotion();assert.ok(document.documentElement.classList.contains('motion-ready'));assert.ok(win.ScrollTrigger.getAll().length>6);
 document.querySelector('[data-genre]').dispatchEvent(new win.PointerEvent('pointerenter'));
 assert.equal(document.querySelectorAll('.genre-floater-cover.active').length,4);
 document.querySelector('.split-button').dispatchEvent(new win.PointerEvent('pointerenter'));
 unmountMotion();assert.equal(win.ScrollTrigger.getAll().length,0);assert.equal(document.querySelectorAll('.button-letter').length,0);assert.equal(document.documentElement.classList.contains('motion-ready'),false);
 }finally{unmountMotion();win.gsap.ticker.sleep();win.ScrollTrigger.disable();await win.happyDOM.abort();}
});
