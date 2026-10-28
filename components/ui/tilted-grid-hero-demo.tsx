import { TiltedGridHero } from './tilted-grid-hero';
export const STUDY_IMAGES=[
 {src:'./images/study-1.jpg',alt:'Open notebook and a calm workspace'},
 {src:'./images/study-2.jpg',alt:'Books lining a library'},
 {src:'./images/study-3.jpg',alt:'A laptop ready for focused work'},
 {src:'./images/study-4.jpg',alt:'A peaceful green landscape'},
 {src:'./images/study-5.jpg',alt:'Books ready to explore'},
];
export default function TiltedGridHeroDemo(){return <TiltedGridHero images={STUDY_IMAGES} className="h-[560px] w-full rounded-lg border border-border bg-background"><div className="relative z-10 flex h-full flex-col items-center justify-between py-12 text-center"><h1 className="text-4xl">Small steps. A fresh start.</h1><p>A little focus, one step at a time.</p></div></TiltedGridHero>;}
