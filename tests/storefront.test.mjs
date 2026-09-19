import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Window} from 'happy-dom';
import {artwork,svgArt} from '../src/art.js';
import {books} from '../src/data.js';

test('catalog artwork has unique closed-region identifiers and usable SVG',()=>{
 for(const book of books){assert.equal(book.previewPages.length,6);for(const kind of book.previewPages){const {regions}=artwork(kind);assert.equal(new Set(regions.map(r=>r.id)).size,regions.length);assert.ok(regions.length>=6);assert.match(svgArt(kind,{interactive:true}),/data-region=/);}}
});

test('storefront: browse, paint, undo, compare, persist, search and save favorites',async()=>{
 const window=new Window({url:'http://localhost:3000/',settings:{disableJavaScriptFileLoading:true,disableCSSFileLoading:true}});
 window.document.write(await readFile(new URL('../index.html',import.meta.url),'utf8'));
 for(const key of ['window','document','location','localStorage'])globalThis[key]=window[key];
 globalThis.matchMedia=()=>({matches:true});
 window.HTMLElement.prototype.showModal=function(){this.open=true;};
 window.HTMLElement.prototype.close=function(){this.open=false;};
 await import('../src/app.js');
 const $=s=>document.querySelector(s);
 assert.match($('h1').textContent,/Unbox a world/);
 assert.equal(document.querySelectorAll('.shelf-card').length,4);
 assert.equal(document.querySelectorAll('.fan-card').length,4);
 location.hash='/books';window.dispatchEvent(new window.Event('hashchange'));
 assert.equal(document.querySelectorAll('.book-card').length,4);
 $('[data-filter="Ocean"]').click();assert.equal(document.querySelectorAll('.book-card').length,1);
 assert.match($('#book-grid').textContent,/Ocean Days/);
 $('[data-filter="All books"]').click();
 $('[data-preview="cozy-critters"]').click();assert.equal($('#preview').open,true);
 $('[data-color="#91cde5"]').click();$('[data-region="head"]').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
 assert.equal($('[data-region="head"]').getAttribute('fill'),'#91cde5');
 $('#undo').click();assert.equal($('[data-region="head"]').getAttribute('fill'),'#ffffff');
 $('[data-region="head"]').dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 assert.equal($('[data-region="head"]').getAttribute('fill'),'#91cde5');
 $('#next-page').click();assert.match($('#page-status').textContent,/2 \/ 6/);
 $('#previous-page').click();assert.equal($('[data-region="head"]').getAttribute('fill'),'#91cde5');
 $('[data-mode="compare"]').click();assert.equal($('#comparison-control').hidden,false);
 assert.equal(document.querySelectorAll('#coloring-canvas [data-region]').length,0);
 $('[data-mode="color"]').click();$('#reset').click();assert.equal($('[data-region="head"]').getAttribute('fill'),'#ffffff');
 $('#undo').click();assert.equal($('[data-region="head"]').getAttribute('fill'),'#91cde5');
 $('#close-preview').click();assert.equal($('#preview').open,false);
 $('[data-wish="ocean-days"]').click();assert.equal($('#wish-count').textContent,'1');
 assert.deepEqual(JSON.parse(localStorage.getItem('homepilato-wishes')),['ocean-days']);
 $('#search-open').click();$('#search-input').value='ocean';$('#search-input').dispatchEvent(new window.Event('input'));
 assert.equal(document.querySelectorAll('#search-results a').length,1);
 assert.match($('#search-results').textContent,/Ocean Days/);
 $('#search-close').click();location.hash='/books/cozy-critters';window.dispatchEvent(new window.Event('hashchange'));
 assert.match($('h1').textContent,/Cozy Critters/);assert.equal(document.querySelectorAll('.inside-gallery button').length,6);
 assert.equal(document.querySelectorAll('a[href^="https://www.amazon"]').length,0);
 const {unmountMotion}=await import('../src/motion.js');unmountMotion();
 await window.happyDOM.abort();
});
