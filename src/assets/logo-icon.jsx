export default function LogoIcon({ className = "size-8" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="8"
        className="fill-white/10 stroke-white/70"
        strokeWidth="1.5"
        strokeDasharray="3 2.5"
      />
      <path
        d="M10 22V10l6 8.5L22 10v12"
        className="stroke-amber-300"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
