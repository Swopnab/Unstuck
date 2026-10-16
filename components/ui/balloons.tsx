"use client";
import {forwardRef,useImperativeHandle,useRef,useState} from 'react';
import { PartyPopper } from 'lucide-react';
export type BalloonsHandle={launchAnimation:()=>void};
/** Public balloons-js adapter. The 21st wrapper itself requires registry authentication. */
export const Balloons=forwardRef<BalloonsHandle,{onStatus?:(message:string)=>void}>(({onStatus},ref)=>{
 useImperativeHandle(ref,()=>({launchAnimation:()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){onStatus?.('A little celebration for you. 🎈');return;}
  onStatus?.('Balloons launched!');
  void import('balloons-js').then(({balloons})=>balloons()).catch(()=>onStatus?.('The celebration could not load. Try again.'));
 }}),[onStatus]);return null;
});
Balloons.displayName='Balloons';
export function LaunchBalloons(){const ref=useRef<BalloonsHandle>(null);const [message,setMessage]=useState('');return <div className="balloon-control"><button className="balloons-button" aria-label="Launch balloons" onClick={()=>ref.current?.launchAnimation()}><PartyPopper size={15}/><span>Launch balloons</span></button><Balloons ref={ref} onStatus={setMessage}/><span className="sr-only" role="status">{message}</span></div>;}
