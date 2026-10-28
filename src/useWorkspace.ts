import {useEffect,useRef,useState} from 'react';
import {type Store,samples,validateStore} from './model';
export const DEMO=typeof window!=='undefined' && new URLSearchParams(window.location.search).get('demo')==='1';
export const WORKSPACE_KEY='unstuck.workspace.v1'+(DEMO?'.demo':'');
export const RESTORE_BACKUP_KEY=WORKSPACE_KEY+'.before-restore';
function read(){
 let raw:string|null|undefined;
 try {raw=localStorage.getItem(WORKSPACE_KEY);return {raw,data:raw?validateStore(JSON.parse(raw)):samples(),error:''};}
 catch {return {raw,data:{version:1,assignments:[],sessions:[],dailyMinutes:60} as Store,error:'Saved data could not be read. It has been kept. Export this tab or restore a valid backup in Your data.'};}
}
export function downloadText(name:string,text:string,type='application/json'){
 const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export default function useWorkspace(){
 const [initial]=useState(read);const [data,setData]=useState(initial.data);const base=useRef(initial.raw);
 const [error,setError]=useState(initial.error);const [conflict,setConflict]=useState(false);const [dirty,setDirty]=useState(false);const [saved,setSaved]=useState(false);
 const wantsBackup=useRef(!!initial.error);const blocked=useRef(false);
 const commit=(next:Store|((d:Store)=>Store),backup=false)=>{
  if(blocked.current)return;
  wantsBackup.current ||= backup;setData(next);setDirty(true);setSaved(false);
 };
 useEffect(()=>{
  const changed=(event:StorageEvent)=>{if((event.key===WORKSPACE_KEY||event.key===null)&&event.storageArea===localStorage){blocked.current=true;setConflict(true);setSaved(false);setError('Another tab changed the saved workspace. Export this tab before choosing the latest saved version.');}};
  window.addEventListener('storage',changed);return()=>window.removeEventListener('storage',changed);
 },[]);
 useEffect(()=>{
  if(!dirty||conflict)return;
  let cancelled=false;
  const save=()=>{
   if(cancelled||blocked.current)return;
   try {
    const current=localStorage.getItem(WORKSPACE_KEY);
    if(base.current===undefined)throw Error('The original record could not be read. Export a copy before restoring it explicitly.');
    if(current!==base.current){blocked.current=true;setConflict(true);throw Error('A newer workspace was saved in another tab. Export this tab, then load the latest version.');}
    if(wantsBackup.current&&current!==null)localStorage.setItem(RESTORE_BACKUP_KEY,current);
    const raw=JSON.stringify(validateStore(data));localStorage.setItem(WORKSPACE_KEY,raw);base.current=raw;wantsBackup.current=false;setDirty(false);setSaved(true);setError('');
   }catch(e){setError(e instanceof Error?e.message:'Changes could not be saved. Export a backup before closing.');}
  };
  if(navigator.locks)navigator.locks.request(WORKSPACE_KEY,save).catch(()=>setError('Saving could not be confirmed. Export this tab.'));
  else setError('This browser cannot coordinate safe saves across tabs. Changes remain in this tab. Export a backup or use a browser with Web Locks support.');
  return()=>{cancelled=true;};
 },[data,dirty,conflict]);
 const loadLatest=()=>{const latest=read();if(latest.raw===undefined||latest.error){setError(latest.error);return false;}base.current=latest.raw;setData(latest.data);setDirty(false);setSaved(false);blocked.current=false;setConflict(false);setError('');return true;};
 return {data,commit,error,conflict,loadLatest,saved,dirty};
}
