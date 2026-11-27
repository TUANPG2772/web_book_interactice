import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Window} from 'happy-dom';
import {artwork,svgArt} from '../src/art.js';
import {books,visibleBooks} from '../src/data.js';

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
 assert.equal(document.querySelectorAll('.shelf-card').length,visibleBooks.length);
 assert.equal(document.querySelectorAll('.fan-card').length,4);assert.equal(new Set(books.map(b=>b.id)).size,books.length);assert.ok(!document.querySelector('.book-track').innerHTML.includes('undefined'));
 location.hash='/books';window.dispatchEvent(new window.Event('hashchange'));
 assert.equal(document.querySelectorAll('.book-card').length,visibleBooks.length);
 $('[data-filter="K-pop & Fantasy"]').click();assert.equal(document.querySelectorAll('.book-card').length,1);
 assert.match($('#book-grid').textContent,/K-Pop Warrior/);
 assert.ok(!$('#book-grid').textContent.includes('K-Pop Chibi Coloring Book'));
 assert.ok(!$('#book-grid').textContent.includes('K-Pop Aesthetic Coloring Book'));
  $('[data-filter="All books"]').click();
 assert.equal(document.querySelectorAll('.book-card').length,8);
 for(const id of ['k-pop-chibi-coloring-book','k-pop-aesthetic-coloring-book']){
   assert.equal(document.querySelector('.book-title[href="#/books/'+id+'"]'),null);
 }
 assert.equal(document.querySelectorAll('[data-genre]').length,0,'Homepage genres are not rendered on catalog page');

 $('[data-preview="how-to-draw-everything-chibi"]').click();assert.equal($('#preview').open,true);
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
 $('[data-wish="k-pop-warrior-coloring-book"]').click();assert.equal($('#wish-count').textContent,'1');
 assert.deepEqual(JSON.parse(localStorage.getItem('homepilato-wishes')),['k-pop-warrior-coloring-book']);
 $('#search-open').click();$('#search-input').value='Warrior';$('#search-input').dispatchEvent(new window.Event('input'));
 assert.equal(document.querySelectorAll('#search-results a').length,1);
 assert.match($('#search-results').textContent,/K-Pop Warrior/);
 $('#search-input').value='Aesthetic';$('#search-input').dispatchEvent(new window.Event('input'));
 assert.equal(document.querySelectorAll('#search-results a').length,0);
 $('#search-input').value='K-pop Chibi';$('#search-input').dispatchEvent(new window.Event('input'));
 assert.equal(document.querySelectorAll('#search-results a').length,0);
  $('#search-close').click();location.hash='/books/how-to-draw-everything-chibi';window.dispatchEvent(new window.Event('hashchange'));
 assert.match($('h1').textContent,/How to Draw Everything Chibi/);assert.equal(document.querySelectorAll('.inside-gallery button').length,6);
 assert.equal(document.querySelectorAll('a[href^="https://www.amazon"]').length,books.find(b=>b.id==='how-to-draw-everything-chibi').amazonUrl?1:0);
 for(const b of visibleBooks){location.hash='/books/'+b.id;window.dispatchEvent(new window.Event('hashchange'));assert.ok(document.querySelector('.book-description').textContent.includes(b.closing));assert.equal(document.querySelectorAll('a[href^="https://www.amazon"]').length,b.amazonUrl?1:0);assert.ok(document.querySelector('.product-copy').textContent.includes(b.countLabel));assert.match(document.querySelector('.interior-notice').textContent,/not pages from this book/);assert.equal(document.querySelector('.product-cover img').getAttribute('width'),String(b.coverWidth));}
 location.hash='/books/k-pop-chibi-coloring-book';window.dispatchEvent(new window.Event('hashchange'));
 assert.match(document.querySelector('#main').textContent,/Book not found/);
 location.hash='/books/k-pop-aesthetic-coloring-book';window.dispatchEvent(new window.Event('hashchange'));
 assert.match(document.querySelector('#main').textContent,/Book not found/);
 location.hash='';window.dispatchEvent(new window.Event('hashchange'));
 assert.equal(document.querySelectorAll('.shelf-card').length,8);
 assert.equal(document.querySelector('.shelf-title[href="#/books/how-to-draw-kawaii"]').textContent,'How to Draw Kawaii');
 assert.equal(document.querySelectorAll('[data-genre]').length,8);
 const links=[...document.querySelectorAll('[data-genre]')];
 for(const [id,label] of [
 ['how-to-draw-everything-ocean','Ocean wonders'],
 ['how-to-draw-fashion','Fashion & style'],
 ['how-to-draw-kawaii','Kawaii cuties']
 ]){
   const link=links.find(node=>node.getAttribute('data-genre')===id);
   assert.ok(link,'New genre link for '+id);
   assert.ok(link.textContent.includes(label));
   assert.equal(document.querySelectorAll('[data-genre-cover="'+id+'"]').length,4);
 }
 assert.equal(document.querySelectorAll('[data-genre-cover="k-pop-chibi-coloring-book"]').length,0);
 assert.equal(document.querySelectorAll('[data-genre-cover="k-pop-aesthetic-coloring-book"]').length,0);
 location.hash='/wishlist';window.dispatchEvent(new window.Event('hashchange'));
 assert.equal(document.querySelectorAll('.book-card').length,1,'Only published wishlist items appear');
  const fashion=books.find(b=>b.id==='how-to-draw-fashion');
 assert.ok(fashion,'Fashion book should be present');
 assert.equal(fashion.title,'How to Draw Fashion');
 assert.match(fashion.fullTitle,/50 Stylish Clothes, Shoes, Bags & Accessories/);
 assert.equal(fashion.projectCount,50);assert.equal(fashion.stepsPerProject,16);
 assert.equal(fashion.coverWidth,842);assert.equal(fashion.coverHeight,842);
 assert.equal(books.findIndex(b=>b.id==='how-to-draw-fashion')+1,books.findIndex(b=>b.id==='k-pop-chibi-coloring-book'));
 assert.ok((await readFile(new URL('../assets/covers/how-to-draw-fashion.webp',import.meta.url))).length>100000);
 location.hash='/books';window.dispatchEvent(new window.Event('hashchange'));
 assert.equal(document.querySelector('.book-title[href="#/books/how-to-draw-kawaii"]').textContent,'How to Draw Kawaii ↗');
 const fashionCard=document.querySelector('.book-title[href="#/books/how-to-draw-fashion"]');
 assert.ok(fashionCard);assert.equal(fashionCard.textContent.trim(),'How to Draw Fashion ↗');
 location.hash='/books/how-to-draw-fashion';window.dispatchEvent(new window.Event('hashchange'));
 assert.equal(document.querySelector('.product-copy h1').textContent,fashion.fullTitle);
 assert.equal(document.querySelector('.product-cover img').getAttribute('src'),fashion.coverImage);
 assert.match(document.querySelector('.book-description').textContent,/finished color example/);
 assert.ok(document.querySelector('.fashion-spotlight'));
 assert.equal(document.querySelectorAll('.inside-gallery button').length,6);
 location.hash='/books/k-pop-warrior-coloring-book';window.dispatchEvent(new window.Event('hashchange'));
 assert.equal(document.querySelector('.fashion-spotlight'),null);
 location.hash='/books/how-to-draw-kawaii';window.dispatchEvent(new window.Event('hashchange'));
 const kawaii=books.find(b=>b.id==='how-to-draw-kawaii');
 assert.ok(kawaii,'Kawaii should be added as a separate title');
 assert.equal(books.length,10);
 assert.equal(visibleBooks.length,8);
 for(const id of ['k-pop-chibi-coloring-book','k-pop-aesthetic-coloring-book']){
   assert.equal(books.find(b=>b.id===id).hidden,true,'Book is retained but unpublished');
   assert.equal(visibleBooks.some(b=>b.id===id),false);
 }

 assert.equal(kawaii.title,'How to Draw Kawaii');
 assert.equal(kawaii.fullTitle,'How to Draw Kawaii: 50 Cute Animals, Food & Fantasy Characters to Draw in 16 Steps for Kids Ages 8–12');
 assert.equal(visibleBooks.findIndex(b=>b.id==='how-to-draw-kawaii')+1,visibleBooks.findIndex(b=>b.id==='cozy-love-valentines-coloring-book'));
 assert.equal(books.findIndex(b=>b.id==='how-to-draw-kawaii')+1,books.findIndex(b=>b.id==='cozy-love-valentines-coloring-book'));
 assert.equal(books.at(-1).id,'cool-car-wheels-coloring-book');
 assert.equal(document.querySelector('.product-copy h1').textContent,kawaii.fullTitle);
 assert.equal(kawaii.projectCount,50);assert.equal(kawaii.stepsPerProject,16);
 assert.equal(kawaii.previewPages.length,6);
 assert.equal(kawaii.coverWidth,1254);assert.equal(kawaii.coverHeight,1254);
 assert.ok(document.querySelector('.kawaii-lesson'));
 assert.equal(document.querySelectorAll('.kawaii-step-list span').length,16);
 assert.match(document.querySelector('.kawaii-lesson').textContent,/Written instructions/);
 assert.match(document.querySelector('.kawaii-lesson').textContent,/Bonus coloring pages/);
 location.hash='/books/how-to-draw-everything-chibi';window.dispatchEvent(new window.Event('hashchange'));
 assert.equal(document.querySelector('.kawaii-lesson'),null,'Kawaii-only content must not appear for other books');
 assert.equal(books.find(b=>b.id==='how-to-draw-everything-chibi').pageCount,undefined);
 assert.equal(books.find(b=>b.id==='how-to-draw-vehicles').pageCount,undefined);

 const {unmountMotion}=await import('../src/motion.js');unmountMotion();
 await window.happyDOM.abort();
});
