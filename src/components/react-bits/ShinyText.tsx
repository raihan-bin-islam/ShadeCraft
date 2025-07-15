import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = "" }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`
      text-slate-600/60 dark:text-slate-950/60
      bg-[linear-gradient(120deg,_rgba(0,0,0,0)_40%,_rgba(0,0,0,0.6)_50%,_rgba(0,0,0,0)_60%)] dark:bg-[linear-gradient(120deg,_rgba(255,255,255,0)_40%,_rgba(255,255,255,0.8)_50%,_rgba(255,255,255,0)_60%)]
      bg-[length:200%_100%]
      bg-clip-text
      inline-block
      ${disabled ? "" : "animate-shine"}
      ${className}
    `}
      style={{
        WebkitBackgroundClip: "text",
        animationDuration: animationDuration,
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         shine: {
//           '0%': { 'background-position': '100%' },
//           '100%': { 'background-position': '-100%' },
//         },
//       },
//       animation: {
//         shine: 'shine 5s linear infinite',
//       },
//     },
//   },
//   plugins: [],
// };
