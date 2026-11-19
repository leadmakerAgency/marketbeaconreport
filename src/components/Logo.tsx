export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" fill="#FFC72C" />
      <path d="M9 31V10h3.6L20 20.2 27.4 10H31v21h-3.8V16.6L20 26.4l-7.2-9.8V31z" fill="#0A2A8C" />
    </svg>
  );
}

export function Logo() {
  return (
    <a className="brand" href="/" aria-label="Market Beacon Report home">
      <LogoMark />
      <span className="rule" aria-hidden="true" />
      <span className="wordmark">
        Market<small>Beacon Report</small>
      </span>
    </a>
  );
}
