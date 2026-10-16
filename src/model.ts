export type Energy = 'low'|'steady'|'high';
export type Step = {id:string; title:string; minutes:number; remaining:number; energy:Energy; optional:boolean; done:boolean; skipped?:boolean};
export type Assignment = {id:string;title:string;course:string;due:string;sample:boolean;steps:Step[]};
export type Session = {id:string;date:string;minutes:number;title:string;source:'timer'|'manual'|'import';assignmentId?:string};
export type Store = {version:1;assignments:Assignment[];sessions:Session[];dailyMinutes:number};
export const uid=()=>globalThis.crypto.randomUUID();
export function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function addDays(date:string,days:number){const d=new Date(`${date}T12:00:00`);d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function daysBetween(a:string,b:string){return Math.round((Date.parse(`${b}T00:00:00Z`)-Date.parse(`${a}T00:00:00Z`))/86400000);}
export function isDate(s:unknown):s is string {return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;}
export function dateLabel(s:string){return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric'}).format(new Date(s+'T12:00:00'));}
export function dueLabel(due:string,now=today()){const n=daysBetween(now,due);return n<0?`${Math.abs(n)}d overdue`:n===0?'Due today':n===1?'Due tomorrow':`Due ${dateLabel(due)}`;}
export const left=(a:Assignment)=>a.steps.reduce((n,s)=>n+(s.done?0:s.remaining),0);
export function samples():Store {const step=(title:string,minutes:number,energy:Energy='steady',optional=false):Step=>({id:uid(),title,minutes,remaining:minutes,energy,optional,done:false});return {version:1,dailyMinutes:60,sessions:[],assignments:[{id:uid(),title:'The future of sustainable cities',course:'Design seminar',due:addDays(today(),2),sample:true,steps:[step('Sketch a three-point outline',10,'low'),step('Find three supporting examples',25),step('Build the first slide draft',45,'high'),step('Polish transitions and visuals',20,'low',true)]},{id:uid(),title:'Chapter 4: a little at a time',course:'Psychology',due:addDays(today(),4),sample:true,steps:[step('Read pages 42–48',25,'low'),step('Write five key takeaways',15),step('Review with practice questions',25,'high')]},{id:uid(),title:'Make a portfolio that feels like you',course:'Personal project',due:addDays(today(),7),sample:true,steps:[step('Choose two projects to feature',10,'low'),step('Write the first case study',45),step('Refine the cover images',20,'steady',true)]}]};}
const ranks={low:0,steady:1,high:2};
export function recommend(assignments:Assignment[],time:number,energy:Energy,now=today()) {
 const candidates=assignments.map(a=>({assignment:a,step:a.steps.find(s=>!s.done)})).filter((x):x is {assignment:Assignment;step:Step}=>!!x.step);
 const fitting=candidates.filter(x=>ranks[x.step.energy]<=ranks[energy]);
 const pool=fitting.length?fitting:candidates;
 pool.sort((a,b)=>daysBetween(now,a.assignment.due)-daysBetween(now,b.assignment.due)||(Number(a.step.remaining>time)-Number(b.step.remaining>time))||a.step.remaining-b.step.remaining);
 const result=pool[0];if(!result)return null;
 return {...result,minutes:Math.min(time,result.step.remaining),chunk:result.step.remaining>time,energyMismatch:ranks[result.step.energy]>ranks[energy]};
}
export function recover(a:Assignment,mode:'keep'|'trim'|'drop'){return {...a,steps:a.steps.map(s=>s.optional&&!s.done?(mode==='drop'?{...s,done:true,remaining:0,skipped:true}:mode==='trim'?{...s,minutes:Math.max(1,Math.ceil(s.remaining/2)),remaining:Math.max(1,Math.ceil(s.remaining/2))}:s):s)};}
export function forecast(a:Assignment,daily:number,now=today()){const days=Math.max(0,daysBetween(now,a.due)+1);const capacity=days*daily;return {days,capacity,remaining:left(a),fits:left(a)<=capacity};}
export function activity(sessions:Session[]){const map=new Map<string,number>();for(const s of sessions)map.set(s.date,(map.get(s.date)||0)+s.minutes);return [...map].sort((a,b)=>a[0].localeCompare(b[0])).map(([date,count])=>({date,count}));}
export function validateStore(value:unknown):Store {
 if(!value||typeof value!=='object')throw Error('This file is not an Unstuck backup.');
 const v=value as Store;if(v.version!==1||!Array.isArray(v.assignments)||!Array.isArray(v.sessions)||v.assignments.length>200||v.sessions.length>10000)throw Error('Invalid backup format or too many records.');
 const text=(s:unknown,max=200):s is string=>typeof s==='string'&&s.length>0&&s.length<=max;
 const ids=new Set<string>();
 for(const a of v.assignments){if(!a||!text(a.id)||ids.has(a.id)||!text(a.title)||!text(a.course)||!isDate(a.due)||!Array.isArray(a.steps)||a.steps.length<1||a.steps.length>50||typeof a.sample!=='boolean')throw Error('An assignment has invalid fields.');ids.add(a.id);for(const s of a.steps){if(!s||!text(s.id)||ids.has(s.id)||!text(s.title)||!Number.isInteger(s.minutes)||s.minutes<1||s.minutes>1440||!Number.isInteger(s.remaining)||s.remaining<0||s.remaining>s.minutes||!Object.hasOwn(ranks,s.energy)||typeof s.done!=='boolean'||typeof s.optional!=='boolean'||(s.skipped!==undefined&&typeof s.skipped!=='boolean')||(s.done?s.remaining!==0:s.remaining===0))throw Error('A task has invalid fields.');ids.add(s.id);}}
 for(const s of v.sessions){if(!s||!text(s.id)||ids.has(s.id)||!isDate(s.date)||s.date>today()||!text(s.title)||!Number.isInteger(s.minutes)||s.minutes<1||s.minutes>1440||!['timer','manual','import'].includes(s.source))throw Error('A study session has invalid fields.');ids.add(s.id);}
 if(!Number.isInteger(v.dailyMinutes)||v.dailyMinutes<10||v.dailyMinutes>480)throw Error('Daily study time must be between 10 and 480 minutes.');return v;
}
export function importCSV(text:string):Session[]{const lines=text.trim().split(/\r?\n/);if(!/^date,minutes(?:,title)?$/i.test(lines.shift()?.trim()||''))throw Error('Use the header date,minutes,title.');if(lines.length>10000)throw Error('Import up to 10,000 sessions at once.');return lines.map((line,i)=>{const [date,raw,...title]=line.split(',');const minutes=Number(raw);if(!isDate(date)||date>today()||!Number.isInteger(minutes)||minutes<1||minutes>1440)throw Error(`Check the date and minutes on row ${i+2}.`);return {id:uid(),date,minutes,title:title.join(',').trim().slice(0,200)||'Imported study session',source:'import'};});}
