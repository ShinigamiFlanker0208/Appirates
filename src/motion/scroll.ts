import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered on the client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollRevealOptions = {
  selector: string;
  container?: HTMLElement | null;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  triggerConfig?: ScrollTrigger.Vars;
};

export const createScrollReveal = ({
  selector,
  container,
  from = { opacity: 0, y: 80, scale: 0.96 },
  to = { opacity: 1, y: 0, scale: 1, ease: "power3.out" },
  triggerConfig,
}: ScrollRevealOptions) => {
  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
      gsap.fromTo(
        el,
        from,
        {
          ...to,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 40%",
            scrub: 0.5,
            ...triggerConfig,
          },
        }
      );
    });
  }, container || undefined);

  return () => ctx.revert();
};

export const createPinnedSection = (
  pinSelector: string | HTMLElement,
  opts: Omit<ScrollTrigger.Vars, "trigger" | "pin"> & { trigger: HTMLElement | string }
) => {
  const st = ScrollTrigger.create({
    pin: pinSelector as any,
    ...opts,
  });
  return () => st.kill();
};

type ShipProgressDetail = {
  percent: number;
  scale: number;
  yOffset: number;
};

export const createShipController = (
  trigger: HTMLElement | null,
  mapper: (self: ScrollTrigger) => ShipProgressDetail
) => {
  if (!trigger) return () => {};

  const st = ScrollTrigger.create({
    trigger,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      const detail = mapper(self);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("setShipProgress", { detail })
        );
      }
    },
  });

  return () => {
    st.kill();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("resetShipProgress"));
    }
  };
};

