import React from 'react'

const SystemGauge = ({ value, label }) => {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const startAngle = -225
  const endAngle = 45
  const range = endAngle - startAngle
  const percentage = Math.min(Math.max(value, 0), 100) / 100
  const strokeDashoffset = circumference * (1 - percentage);

  const getColor = (value) => {
    if (value >= 80) return 'var(--danger)'
    if (value >= 60) return 'var(--warning)'
    return 'var(--success)'
  }

  return (
    <div className="gauge-container">
      <svg viewBox="0 0 100 100" className="gauge">
        <path
          fill="none"
          stroke="var(--bg-primary)"
          strokeWidth="8"
          d={`
            M ${50 + radius * Math.cos((startAngle * Math.PI) / 180)},
              ${50 + radius * Math.sin((startAngle * Math.PI) / 180)}
            A ${radius},${radius} 0 ${Math.abs(range) <= 180 ? 0 : 1} 1
              ${50 + radius * Math.cos((endAngle * Math.PI) / 180)},
              ${50 + radius * Math.sin((endAngle * Math.PI) / 180)}
          `}
        />
        <path
          fill="none"
          stroke={getColor(value)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(${startAngle}, 50, 50)`}
          d={`
            M ${50 + radius},50
            A ${radius},${radius} 0 1 1 ${50 - radius},50
          `}
        />
        <text
          x="50"
          y="60"
          textAnchor="middle"
          fill="var(--text-primary)"
          fontSize="20"
        >
          {Math.round(value)}%
        </text>
      </svg>
      <div className="gauge-label">{label}</div>
    </div>
  )
}

export default SystemGauge
