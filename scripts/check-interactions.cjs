// Run with: node scripts/check-interactions.cjs (no dependencies or network).
const assert = require('node:assert/strict');
const test = require('node:test');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = name => fs.readFileSync(path.join(__dirname, '../js', name), 'utf8');

function preferences({blocked = false, theme = null, url = 'https://example.com/?lang=de'} = {}) {
  const attributes = { lang: 'de' };
  const values = new Map([['theme-pref', theme]]);
  const events = {};
  const location = new URL(url);
  const root = {setAttribute:(k,v) => attributes[k]=v, getAttribute:k=>attributes[k]};
  const mq = {matches:false, addEventListener:(k,fn)=>events[k]=fn};
  const window = {matchMedia:()=>mq, dispatchEvent:()=>{}};
  const document = {documentElement:root, querySelector:()=>null};
  const localStorage = {
    getItem:key=>{if(blocked) throw Error('blocked'); return values.get(key);},
    setItem:(key,value)=>{if(blocked) throw Error('blocked'); values.set(key,value);}
  };
  vm.runInNewContext(source('theme.js'), {window, document, localStorage, location,
    navigator:{language:'de'}, URL, URLSearchParams, CustomEvent:class {},
    history:{state:null,replaceState:(_state,_title,href)=>{location.href=href;}}});
  return {window,root,attributes,location,mq,events};
}

test('switching language updates a shared URL, including its hash and other parameters',()=>{
  const p=preferences({url:'https://example.com/about.html?lang=de&source=test#main'});
  p.window.langPref.set('en');
  assert.equal(p.root.getAttribute('lang'),'en');
  assert.equal(p.location.searchParams.get('lang'),'en');
  assert.equal(p.location.searchParams.get('source'),'test');
  assert.equal(p.location.hash,'#main');
  assert.equal(preferences({url:p.location.href}).root.getAttribute('lang'),'en');
});

test('invalid stored theme falls back to system',()=>{
  const p=preferences({theme:'invalid'});
  assert.equal(p.attributes['data-theme'],'light');
  p.mq.matches=true; p.events.change();
  assert.equal(p.attributes['data-theme'],'dark');
});

test('explicit theme remains active when storage is blocked and OS theme changes',()=>{
  const p=preferences({blocked:true});
  p.window.themePref.set('dark');
  p.events.change();
  assert.equal(p.attributes['data-theme'],'dark');
  p.window.langPref.set('en');
  assert.equal(p.root.getAttribute('lang'),'en');
});

function contact() {
  const events={}; const windowEvents={}; const status={}; const button={disabled:true};
  const link={href:'mailto:rh@visualfacilitators.com'};
  const fields=['name','email','message'].map(name=>({
    name, value:'', validity:{valid:true}, events:{}, attributes:{},
    setCustomValidity(message){this.validity.valid=!message;},
    setAttribute(k,v){this.attributes[k]=v;}, removeAttribute(k){delete this.attributes[k];},
    addEventListener(k,fn){this.events[k]=fn;}, focus(){this.focused=true;}, reportValidity(){}
  }));
  const form={action:link.href, elements:{namedItem:name=>fields.find(f=>f.name===name)},
    querySelector:selector=>selector==='button[type="submit"]'?button:link,
    addEventListener:(key,fn)=>events[key]=fn};
  const document={documentElement:{lang:'de'},getElementById:id=>id==='contact-form'?form:status};
  const window={location:{href:'https://example.com/contact.html'},addEventListener:(key,fn)=>windowEvents[key]=fn};
  vm.runInNewContext(source('contact.js'),{document,window,encodeURIComponent});
  return {fields,status,button,link,window,document,windowEvents,submit:()=>events.submit({preventDefault(){}})};
}

test('blank input does not launch a mail app',()=>{
  const c=contact(); c.fields[0].value='   '; c.submit();
  assert.equal(c.fields[0].focused,true);
  assert.equal(c.window.location.href,'https://example.com/contact.html');
});

test('email draft safely encodes special characters and retains form values',()=>{
  const c=contact();
  c.fields[0].value=' Test & Name '; c.fields[1].value='test@example.com';
  c.fields[2].value='Grüße? & # = %\nNext line'; c.submit();
  const url=new URL(c.window.location.href);
  assert.equal(url.protocol,'mailto:');
  assert.equal(url.pathname,'rh@visualfacilitators.com');
  assert.equal(url.searchParams.get('subject'),'Anfrage über die Website von Test & Name');
  assert.ok(url.searchParams.get('body').includes('Grüße? & # = %\nNext line'));
  assert.equal(c.fields[2].value,'Grüße? & # = %\nNext line');
  assert.ok(c.status.textContent.includes('Bitte senden Sie die Nachricht dort ab'));
  assert.equal(c.link.href,c.window.location.href);
  c.document.documentElement.lang='en'; c.windowEvents.langchange();
  assert.ok(c.status.textContent.includes('Please send the message there'));
  c.fields[2].value='Edited'; c.fields[2].events.input();
  assert.equal(c.link.href,'mailto:rh@visualfacilitators.com');
  assert.equal(c.status.textContent,'');
});
