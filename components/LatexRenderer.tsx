
import React, { useEffect, useRef } from 'react';

interface LatexRendererProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

declare global {
  interface Window {
    katex: any;
  }
}

const LatexRenderer: React.FC<LatexRendererProps> = ({ formula, displayMode = false, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && window.katex) {
      try {
        window.katex.render(formula, containerRef.current, {
          throwOnError: false,
          displayMode: displayMode,
          trust: true,
          strict: false
        });
      } catch (e) {
        console.error("KaTeX rendering error:", e);
        containerRef.current.textContent = formula;
      }
    }
  }, [formula, displayMode]);

  return <div ref={containerRef} className={`${className} inline-block`} />;
};

export default LatexRenderer;
