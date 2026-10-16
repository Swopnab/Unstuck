import { useState } from 'react';
import { ArrowUpRight, ArrowRight, Sprout, Pause, Play, Sparkles, Compass, Heart, ChartNoAxesCombined } from 'lucide-react';
import { TiltedGridHero } from '@/components/ui/tilted-grid-hero';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { LaunchBalloons } from '@/components/ui/balloons';
import { STUDY_IMAGES } from '@/components/ui/tilted-grid-hero-demo';

export function Logo() {
  return <span className="brand"><span className="brand-mark"><Sprout size={23} strokeWidth={1.8}/></span>unstuck<span className="brand-period">.</span></span>;
}

const CONTEXT = [
  { number: '01', label: 'THE PROBLEM', title: 'Big assignments leave small decisions unresolved.', text: 'What should you do first? What fits between classes? What can you adjust after missing a study session? Those decisions can make an assignment harder to start.' },
  { number: '02', label: 'THE PEOPLE', title: 'Students with a full life around their coursework.', text: 'Unstuck is for students balancing deadlines, limited study time, and changing energy. Use it to plan coursework, prepare for an exam, or move a personal project forward.' },
  { number: '03', label: 'THE EXPERIENCE', title: 'Start with what fits your day.', text: 'Choose your available time and energy. Get one suggested step and an explanation, focus on it, then adjust optional work if your plan slips. Your saved study minutes become a record of progress.' },
];

const EXAMPLE_STEPS = [
  { Icon: Compass, number: '01', title: 'Make the assignment smaller', text: 'Add your presentation and deadline. Break it into an outline, supporting examples, a slide draft, and optional polish.' },
  { Icon: Heart, number: '02', title: 'Find a step that fits now', text: 'Choose 25 minutes and low energy. Start with a short outline, read why it was suggested, and use the focus timer to begin.' },
  { Icon: ChartNoAxesCombined, number: '03', title: 'Keep a way back into the work', text: 'Save your focused minutes. If a session slips, preview a lighter plan by shortening optional polish. Your deadline stays fixed.' },
];

export default function Welcome({ onEnter }: { onEnter: () => void }) {
  const [paused, setPaused] = useState(false);
  return <div className="welcome">
    <nav className="landing-nav" aria-label="Welcome">
      <Logo/>
      <div><LaunchBalloons/><a href="#how-it-works">How it works</a><button className="button dark" onClick={onEnter}>Open my workspace <ArrowUpRight size={17}/></button></div>
    </nav>
    <main id="main">
      <TiltedGridHero images={STUDY_IMAGES} className={`landing-hero ${paused ? 'motion-paused' : ''}`} tileHeight={29} axis={60} curve={65} speed={5} fade={15}>
        <div className="hero-copy">
          <span className="eyebrow"><span className="little-dot"/> A CALMER STUDY PLANNER FOR STUDENTS</span>
          <h1>Small steps.<br/><em>A fresh start.</em></h1>
          <p>Unstuck helps students break big assignments into small steps,<br className="desktop-break"/> choose what fits right now, and restart when plans change.</p>
        </div>
        <div className="hero-actions"><button className="button dark large" onClick={onEnter}>Find my next step <ArrowRight size={18}/></button><span>No account needed. Your pace, your space.</span></div>
        <button className="motion-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'Play image animation' : 'Pause image animation'}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button>
      </TiltedGridHero>

      <section className="landing-context" aria-labelledby="context-title">
        <div className="context-intro">
          <span className="eyebrow">WHAT IS UNSTUCK?</span>
          <h2 id="context-title">A clear next step<br/>when coursework<br/><em>feels overwhelming.</em></h2>
          <p>A study workspace for the moment you need to begin—or begin again. Turn an assignment into a manageable action, make room to focus, and see the effort you’ve recorded.</p>
          <div className="context-uses" aria-label="Ways to use Unstuck"><span>Coursework</span><span>Exam preparation</span><span>Personal projects</span></div>
        </div>
        <div className="context-notes">
          {CONTEXT.map(item => <article className="context-note" key={item.number}>
            <span className="context-number" aria-hidden="true">{item.number}</span>
            <div><span className="eyebrow">{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></div>
          </article>)}
        </div>
      </section>

      <section className="scroll-showcase" aria-label="Workspace preview">
        <ContainerScroll titleComponent={<><span className="eyebrow">FROM A DEADLINE TO A DOABLE ACTION</span><h2 className="scroll-title">A workspace that asks<br/><em>what fits today.</em></h2><p className="scroll-caption">Add your work. Choose your time and energy. Find a place to start.</p></>}>
          <div className="preview-frame"><img src="/images/workspace-preview.jpg" alt="Example Unstuck workspace suggesting a ten-minute outline step, with time and energy controls and clearly labeled example assignments" loading="lazy"/></div>
        </ContainerScroll>
      </section>

      <section className="landing-details" id="how-it-works" aria-labelledby="example-title">
        <div className="intro-line"><span className="eyebrow">HOW YOU WOULD USE IT</span><h2 id="example-title">A big assignment.<br/><em>A smaller way in.</em></h2></div>
        <div className="example-situation"><span className="eyebrow">AN EXAMPLE DAY</span><p>You have a presentation due Friday, 25 minutes between classes, and a little less energy than you’d hoped.</p></div>
        <div className="feature-grid">
          {EXAMPLE_STEPS.map(({ Icon, number, title, text }) => <article key={number}>
            <div className="feature-top"><Icon size={22}/><span>{number}</span></div><h3>{title}</h3><p>{text}</p>
          </article>)}
        </div>
      </section>

      <section className="closing-note"><Sparkles size={18}/><div><p>Make the next decision<br/><strong>a little easier.</strong></p><span className="closing-context">Your records stay in this browser. Export a backup whenever you need.</span></div><button className="text-button" onClick={onEnter}>Find my next step <ArrowRight size={17}/></button></section>
    </main>
    <footer className="landing-footer"><Logo/><span>A calmer corner of student life.</span><span>Saved on this browser.</span></footer>
  </div>;
}
