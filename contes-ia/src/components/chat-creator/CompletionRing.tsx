import React, { useState, useEffect, useRef } from 'react';
import { RingWrap, RingPct, RingParticles } from './ChatStoryStyles';

interface Props { percentage: number; color: string; }
const R = 16, CIRC = 2 * Math.PI * R;
const P = [{ tx:'14px',ty:'-14px' },{ tx:'-12px',ty:'-16px' },{ tx:'16px',ty:'5px' },{ tx:'-14px',ty:'10px' }];

export const CompletionRing: React.FC<Props> = ({ percentage, color }) => {
  const [c, setC] = useState(false);
  const prev = useRef(percentage);
  const done = useRef(false);

  useEffect(() => {
    if (prev.current < 70 && percentage >= 70 && !done.current) {
      done.current = true; setC(true);
      const t = setTimeout(() => setC(false), 800);
      return () => clearTimeout(t);
    }
    prev.current = percentage;
  }, [percentage]);

  return (
    <RingWrap $celebrating={c}>
      <svg width="42" height="42" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="21" cy="21" r={R} fill="none" stroke="var(--border-color, rgba(0,0,0,0.06))" strokeWidth="3.5" />
        <circle cx="21" cy="21" r={R} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={CIRC - (percentage / 100) * CIRC}
          style={{ transition: 'stroke-dashoffset 600ms ease-out, stroke 400ms ease' }} />
      </svg>
      <RingPct>{percentage}%</RingPct>
      {c && <RingParticles>{P.map((p,i) => <span key={i} style={{ '--tx':p.tx,'--ty':p.ty,top:'50%',left:'50%',animationDelay:`${i*50}ms` } as React.CSSProperties} />)}</RingParticles>}
    </RingWrap>
  );
};
