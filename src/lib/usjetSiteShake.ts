const SHAKE_CLASS = "usjet-site-shake";
const SHAKE_MS = 920;

function shakeTargets(): HTMLElement[] {
  const targets: HTMLElement[] = [];
  if (typeof document === "undefined") {
    return targets;
  }
  if (document.documentElement) {
    targets.push(document.documentElement);
  }
  const shell = document.getElementById("usjet-app-shell");
  if (shell) {
    targets.push(shell);
  }
  if (document.body) {
    targets.push(document.body);
  }
  return targets;
}

function clearShakeClass(targets: HTMLElement[]): void {
  for (const el of targets) {
    el.classList.remove(SHAKE_CLASS);
  }
}

/** Full-viewport earthquake — html + app shell + body (visible on mobile). */
export function triggerSiteEarthquake(): Promise<void> {
  if (typeof document === "undefined") {
    return Promise.resolve();
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return Promise.resolve();
  }

  const targets = shakeTargets();
  if (targets.length === 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      clearShakeClass(targets);
      resolve();
    };

    clearShakeClass(targets);
    void document.body?.offsetWidth;

    const armShake = () => {
      for (const el of targets) {
        el.classList.add(SHAKE_CLASS);
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(armShake);
    });

    const primary = targets[0];
    const onEnd = (event: AnimationEvent) => {
      if (event.target !== primary) {
        return;
      }
      const name = event.animationName ?? "";
      if (!name.includes("usjet-site-earthquake")) {
        return;
      }
      primary.removeEventListener("animationend", onEnd);
      finish();
    };

    primary.addEventListener("animationend", onEnd);
    window.setTimeout(finish, SHAKE_MS + 160);
  });
}
