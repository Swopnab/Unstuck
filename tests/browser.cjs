// Fictional local fixtures only. See docs/BROWSER_CHECKS.md before running.
const {chromium}=require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const out=process.env.REVIEW_OUTPUT||path.join(__dirname,'screenshots');
const reports=[];
async function check(name,run){if(process.env.CHECK_FILTER&&!name.match(process.env.CHECK_FILTER))return;await run();reports.push({name,result:'passed'});console.log('PASS',name);}
async function shot(page,name){await fs.mkdir(out,{recursive:true});await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});}
async function noOverflow(page){
 const state=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,outside:[...document.querySelectorAll('body *')].map(e=>({tag:e.tagName,cls:String(e.className),right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})).filter(e=>e.right>innerWidth+1&&e.width>0).slice(0,8)}));
 assert.ok(state.scroll<=state.width+1,`page must fit viewport: ${JSON.stringify(state)}`);
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];ctx.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 const u=await ctx.newPage();
 await check('Unstuck assignment save, reload, explanation and calendar export',async()=>{
  await u.goto('http://127.0.0.1:5193/?demo=1#workspace');
  await u.getByRole('button',{name:'Add assignment',exact:true}).click();
  await u.getByLabel('Assignment name').fill('Fictional systems essay');await u.getByLabel('Course or project').fill('Example course');
  await u.getByLabel('Step 1 name').fill('Draft an outline');await u.getByRole('dialog').getByRole('button',{name:'Add assignment',exact:true}).click();
  await u.getByRole('status').filter({hasText:'Saved on this browser'}).waitFor();
  await u.reload();assert.ok(await u.evaluate(()=>JSON.parse(localStorage.getItem('unstuck.workspace.v1.demo')).assignments.some(a=>a.title==='Fictional systems essay')));
  await u.getByText('Why this step?',{exact:true}).click();await u.getByText(/Deadline:.*You chose/).waitFor();await shot(u,'unstuck-desktop');
  await u.getByRole('button',{name:'Your data',exact:true}).click();const download=u.waitForEvent('download');await u.getByRole('button',{name:'Download assignment deadlines (.ics)',exact:true}).click();const d=await download;assert.equal(d.suggestedFilename(),'unstuck-deadlines.ics');
 });
 await check('Unstuck recovery, timer reload and study history preserve associations',async()=>{
  await u.goto('http://127.0.0.1:5193/?demo=1#workspace');
  await u.getByRole('button',{name:'Today',exact:true}).click();
  if(!await u.evaluate(()=>localStorage.getItem('unstuck.workspace.v1.demo'))) {await u.getByRole('button',{name:'Reset my plan',exact:true}).click();await u.getByRole('button',{name:'Save this plan',exact:true}).click();await u.getByRole('status').filter({hasText:'Saved on this browser'}).waitFor();}
  const before=await u.evaluate(()=>JSON.parse(localStorage.getItem('unstuck.workspace.v1.demo')));
  await u.getByRole('button',{name:'Reset my plan',exact:true}).click();
  await u.getByRole('radio',{name:/Shorten optional polish/}).check();await shot(u,'unstuck-recovery');
  await u.getByRole('button',{name:'Save this plan',exact:true}).click();await u.getByRole('status').filter({hasText:'Saved on this browser'}).waitFor();
  const after=await u.evaluate(()=>JSON.parse(localStorage.getItem('unstuck.workspace.v1.demo')));
  assert.equal(after.assignments[0].due,before.assignments[0].due);
  for(let i=0;i<before.assignments[0].steps.length;i++)if(!before.assignments[0].steps[i].optional)assert.deepEqual(after.assignments[0].steps[i],before.assignments[0].steps[i]);
  await u.clock.install();await u.getByRole('button',{name:'Start this step',exact:true}).click();
  await u.getByRole('button',{name:'Pause',exact:true}).waitFor();await u.reload();await u.getByRole('button',{name:'Focus session',exact:false}).click();
  await u.getByRole('button',{name:'Pause',exact:true}).waitFor();await u.clock.fastForward(61000);
  await u.getByRole('button',{name:'Save focused time',exact:true}).click();await u.getByRole('status').filter({hasText:'Saved on this browser'}).waitFor();
  const stored=await u.evaluate(()=>JSON.parse(localStorage.getItem('unstuck.workspace.v1.demo')));
  assert.equal(stored.sessions.at(-1).source,'timer');assert.equal(stored.sessions.at(-1).minutes,1);assert.equal(stored.sessions.at(-1).assignmentId,before.assignments[0].id);
  await u.clock.resume();await u.getByRole('button',{name:'Your data',exact:true}).click();
 });
 await check('Unstuck two-tab edits require explicit conflict resolution',async()=>{
  const other=await ctx.newPage();await other.goto('http://127.0.0.1:5193/?demo=1#workspace');
  await other.getByRole('button',{name:'Already finished',exact:true}).click();await other.getByRole('status').filter({hasText:'Saved on this browser'}).waitFor();
  await u.getByRole('alert').filter({hasText:'Another tab changed'}).waitFor();
  assert.ok(await u.getByRole('button',{name:'Download assignment deadlines (.ics)',exact:true}).isDisabled());
  await u.getByRole('button',{name:'Use latest saved workspace',exact:true}).click();
  assert.equal(await u.getByRole('alert').count(),0);await other.close();
 });
 await check('Unstuck backup restoration keeps a pre-restore copy',async()=>{
  const before=await u.evaluate(()=>localStorage.getItem('unstuck.workspace.v1.demo'));
  const restored={version:1,assignments:[],sessions:[],dailyMinutes:40};
  await u.getByLabel('Import workspace file').setInputFiles({name:'fictional-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(restored))});
  await u.getByRole('button',{name:'Restore backup',exact:true}).click();await u.getByRole('button',{name:'Confirm',exact:true}).click();
  await u.getByRole('status').filter({hasText:'Saved on this browser'}).waitFor();
  assert.equal(await u.evaluate(()=>localStorage.getItem('unstuck.workspace.v1.demo.before-restore')),before);
  await u.reload();assert.equal(await u.evaluate(()=>JSON.parse(localStorage.getItem('unstuck.workspace.v1.demo')).dailyMinutes),40);
 });
 await check('Unstuck failed saves preserve persisted data and show an error',async()=>{
  const failure=await ctx.newPage();await failure.goto('http://127.0.0.1:5193/?demo=1#workspace');
  const before=await failure.evaluate(()=>localStorage.getItem('unstuck.workspace.v1.demo'));
  await failure.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='unstuck.workspace.v1.demo')throw new DOMException('Storage quota exceeded','QuotaExceededError');return original.call(this,k,v);};});
  await failure.getByRole('button',{name:'Add assignment',exact:true}).click();await failure.getByLabel('Assignment name').fill('Unsaved fixture');await failure.getByLabel('Course or project').fill('Synthetic');await failure.getByLabel('Step 1 name').fill('Outline');await failure.getByRole('dialog').getByRole('button',{name:'Add assignment',exact:true}).click();
  await failure.getByRole('alert').filter({hasText:'quota'}).waitFor();assert.equal(await failure.evaluate(()=>localStorage.getItem('unstuck.workspace.v1.demo')),before);await failure.close();
 });
 for(const [name,url] of [['Unstuck', 'http://127.0.0.1:5193/?demo=1#workspace']]) {
  await check(`${name} desktop, tablet and phone layouts`,async()=>{
   // Fresh contexts avoid leaking the timer's emulated clock or focus between visual cases.
   for(const [w,h] of [[390,844],[768,1024],[1440,1000]]){
    const layout=await browser.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});layout.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));const page=await layout.newPage();
    await page.goto(url);await page.waitForLoadState('networkidle');await noOverflow(page);await page.evaluate(()=>document.activeElement?.blur());await shot(page,`${name.toLowerCase()}-${w}`);await layout.close();
   }
  });
 }
 await check('Unstuck keyboard dialog navigation',async()=>{
  await u.goto('http://127.0.0.1:5193/?demo=1#workspace');await u.getByRole('button',{name:'Add assignment',exact:true}).click();await u.getByRole('dialog').waitFor();await u.keyboard.press('Escape');assert.equal(await u.getByRole('dialog').count(),0);
 });
 assert.deepEqual(errors,[],`Browser errors: ${errors.join('; ')}`);
 await fs.writeFile(path.join(out,'results.json'),JSON.stringify({fixture:'Fictional browser-local demo; Chromium viewport emulation; emulated timer clock',checks:reports,unhandledPageErrors:errors},null,2));
 await browser.close();console.log(JSON.stringify(reports));
})().catch(e=>{console.error(e);process.exit(1);});
