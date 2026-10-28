import {useState,useRef,useEffect} from 'react';
import {Music2,Pause,Play,Volume2,Minus,Plus} from 'lucide-react';
export function useZenMusic(){
 const audio=useRef<HTMLAudioElement|null>(null);
 const [playing,setPlaying]=useState(false);const [status,setStatus]=useState('');
 const [volume,setVolumeState]=useState(()=>{try{const saved=localStorage.getItem('unstuck.music.volume');const n=saved === null ? .25 : Number(saved);return Number.isFinite(n)?Math.min(1,Math.max(0,n)):.25;}catch{return .25;}});
 const volumeRef=useRef(volume);volumeRef.current=volume;
 const play=()=>{
  if(!audio.current){audio.current=new Audio('./audio/small-steps-zen.wav');audio.current.loop=true;audio.current.preload='none';audio.current.addEventListener('pause',()=>setPlaying(false));audio.current.addEventListener('error',()=>{setPlaying(false);setStatus('Music could not load. Try again.');});}
  audio.current.volume=volumeRef.current;
  void audio.current.play().then(()=>{setPlaying(true);setStatus('Zen music is playing.');}).catch(()=>{setPlaying(false);setStatus('Click Play zen music to allow audio.');});
 };
 const pause=()=>{audio.current?.pause();setPlaying(false);setStatus('Zen music is paused.');};
 const setVolume=(value:number)=>{const n=Math.min(1,Math.max(0,value));setVolumeState(n);setStatus(`Zen music volume ${Math.round(n*100)} percent.`);if(audio.current)audio.current.volume=n;try{localStorage.setItem('unstuck.music.volume',String(n));}catch{/* Audio still works. */}};
 useEffect(()=>()=>{audio.current?.pause();if(audio.current)audio.current.src='';audio.current=null;},[]);
 return {playing,play,pause,volume,setVolume,status};
}
export type ZenMusic=ReturnType<typeof useZenMusic>;
export function MusicControl({music}:{music:ZenMusic}){return <div className="music-control"><button className={`music-button ${music.playing?'playing':''}`} aria-label={music.playing?'Pause zen music':'Play zen music'} aria-pressed={music.playing} onClick={music.playing?music.pause:music.play}><Music2 size={15}/><span>Zen music</span>{music.playing?<Pause size={12}/>:<Play size={12}/>}</button><button className="volume-step" aria-label="Decrease zen volume" title="Volume down" disabled={music.volume===0} onClick={()=>music.setVolume(Math.max(0,Number((music.volume-.1).toFixed(2))))}><Minus size={13}/></button><details className="music-volume"><summary aria-label="Music volume" title="Music volume"><Volume2 size={15}/></summary><div><label htmlFor="zen-volume">Volume <span>{Math.round(music.volume*100)}%</span></label><input id="zen-volume" aria-label="Zen music volume" type="range" min={0} max={100} value={Math.round(music.volume*100)} onChange={e=>music.setVolume(Number(e.target.value)/100)}/><small>Small Steps · original ambient loop</small></div></details><button className="volume-step volume-up" aria-label="Increase zen volume" title="Volume up" disabled={music.volume===1} onClick={()=>music.setVolume(Math.min(1,Number((music.volume+.1).toFixed(2))))}><Plus size={13}/></button><span className="sr-only" role="status">{music.status}</span></div>;}
