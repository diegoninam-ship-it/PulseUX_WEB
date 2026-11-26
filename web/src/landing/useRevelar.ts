import { useEffect, useRef } from "react";

// Marca la sección con .lp-visible cuando entra en pantalla, para la animación de aparición.
// Si el navegador no tiene IntersectionObserver, la muestra de inmediato.
export function useRevelar<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("lp-visible");
      return;
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          el.classList.add("lp-visible");
          observador.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return ref;
}
