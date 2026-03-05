import React from 'react';
import { SVG_TOKENS } from './tokens';
import { SVG } from './constants';

interface SvgIconProps {
  token: string;
  size?: number;
  selected?: boolean;
  className?: string;
}

export const SvgIcon: React.FC<SvgIconProps> = ({ token, size = 64, selected = false, className }) => {
  const data = SVG_TOKENS[token];
  if (!data) return null;

  return (
    <svg
      viewBox={SVG.VIEW_BOX}
      width={size}
      height={size}
      fill="none"
      strokeLinecap={SVG.LINECAP}
      strokeLinejoin={SVG.LINEJOIN}
      className={className}
      aria-hidden="true"
      style={{
        transition: 'transform 0.3s ease, filter 0.3s ease',
        transform: selected ? 'scale(1.08)' : 'scale(1)',
        filter: selected ? 'drop-shadow(0 2px 8px rgba(255,153,153,0.35))' : 'none',
      }}
    >
      {data.elements.map((el, i) => {
        const { type, attrs } = el;
        const props: Record<string, unknown> = { key: i };
        for (const [k, v] of Object.entries(attrs)) {
          // Convert camelCase attrs for React
          const reactKey = k === 'strokeWidth' ? 'strokeWidth'
            : k === 'strokeDasharray' ? 'strokeDasharray'
            : k === 'strokeLinecap' ? 'strokeLinecap'
            : k;
          props[reactKey] = v;
        }
        return React.createElement(type, props);
      })}
    </svg>
  );
};
