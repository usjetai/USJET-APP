const LIFT_CLASS = "usjet-site-lift";
const LIFT_MS = 2800;

function liftTargets(): HTMLElement[] {
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

/** Viewport lifts toward cockpit — pairs with earthquake + terminal boot. */
export function triggerSiteLift(): Promise<void> {
  if (typeof document === "undefined") {
    return Promise.resolve();
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return Promise.resolve();
  }

  const targets = liftTargets();
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
      for (const el of targets) {
        el.classList.remove(LIFT_CLASS);
      }
      resolve();
    };

    for (const el of targets) {
      el.classList.remove(LIFT_CLASS);
    }
    void document.body?.offsetWidth;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        for (const el of targets) {
          el.classList.add(LIFT_CLASS);
        }
      });
    });

    const primary = targets[0];
    const onEnd = (event: AnimationEvent) => {
      if (event.target !== primary) {
        return;
      }
      const name = event.animationName ?? "";
      if (!name.includes("usjet-site-liftoff")) {
        return;
      }
      primary.removeEventListener("animationend", onEnd);
      finish();
    };

    primary.addEventListener("animationend", onEnd);
    window.setTimeout(finish, LIFT_MS + 120);
  });
}
