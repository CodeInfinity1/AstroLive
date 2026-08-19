import './ScoreRing.css';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  fontSize?: string;
  label?: string;
  showPercentage?: boolean;
}

export default function ScoreRing({ 
  score, 
  size = 120, 
  strokeWidth = 6, 
  fontSize = '1.8rem',
  label,
  showPercentage = true 
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;
  const remaining = circumference - progress;
  
  // Color based on score
  let color: string;
  if (score >= 75) color = '#5BC07A';
  else if (score >= 50) color = '#E8A849';
  else if (score >= 30) color = '#D4845A';
  else color = '#E85A6B';

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${remaining}`}
          style={{
            transition: 'stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      <div className="score-ring-label" style={{ fontSize }}>
        <span style={{ color }}>{score}</span>
        {showPercentage && <span className="score-ring-percent">%</span>}
        {label && <span className="score-ring-sublabel">{label}</span>}
      </div>
    </div>
  );
}
