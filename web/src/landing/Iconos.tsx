// Iconos de línea de la landing. Usan currentColor para heredar los tokens de marca;
// nunca los colores de los botones del dispositivo (CONTEXT.md, sección 7).

type Props = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconoPulso({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M2 12h4l2.5-6 4 12 3-8 2 2H22" />
    </svg>
  );
}

export function IconoToque({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10" />
      <path d="M12 10V8.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M15 11v-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.6a5 5 0 0 1-3.9-1.9L4.3 15.4a1.5 1.5 0 0 1 2.3-1.9L9 16" />
      <path d="M5 4.5 3.5 3M17 4.5 18.5 3M11 2V1" />
    </svg>
  );
}

export function IconoLuz({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="11" r="4" />
      <path d="M12 2v2M12 18v4M4.2 4.2l1.4 1.4M18.4 4.2 17 5.6M2 11h2M20 11h2M9 21h6" />
    </svg>
  );
}

export function IconoPanel({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="4" width="18" height="14" rx="2.5" />
      <path d="M7 14v-3M11 14V8M15 14v-5M19 18v2M5 18v2" />
    </svg>
  );
}

export function IconoEscudo({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconoSinApp({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2M3 3l18 18" />
    </svg>
  );
}

export function IconoReloj({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2M10 2h4M19 5l1.5-1.5" />
    </svg>
  );
}

export function IconoFlecha({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
