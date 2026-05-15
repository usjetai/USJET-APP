import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import {
  BLOG_CADENCE_START_LABEL,
  BLOG_CADENCE_TOTAL_DAYS,
  getBlogCadenceDay,
  getHoursUntilNextBlogDrop,
  isBlogCadenceActive,
} from "../../lib/usa250BlogCadence";
import { getDaysUntilUsa250 } from "../../lib/usa250Countdown";

export default function UsjetBlogCadenceBanner() {
  const [cadenceDay, setCadenceDay] = useState(() => getBlogCadenceDay());
  const [hoursNext, setHoursNext] = useState(() => getHoursUntilNextBlogDrop());
  const [days250, setDays250] = useState(() => getDaysUntilUsa250());

  useEffect(() => {
    const tick = () => {
      setCadenceDay(getBlogCadenceDay());
      setHoursNext(getHoursUntilNextBlogDrop());
      setDays250(getDaysUntilUsa250());
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const active = isBlogCadenceActive();

  return (
    <div className="usjet-blog-cadence" role="status" aria-live="polite">
      <p className="usjet-blog-cadence__live">
        <Radio size={14} className="usjet-blog-cadence__pulse" aria-hidden />
        <span>{active ? "Daily operator log · live cadence" : "Operator log archive"}</span>
      </p>
      <p className="usjet-blog-cadence__march">
        Day <strong>{cadenceDay}</strong> of <strong>{BLOG_CADENCE_TOTAL_DAYS}</strong> — runway to USA 250
        <span className="usjet-blog-cadence__sep"> · </span>
        T-minus <strong>{days250}</strong> days to the 250th
      </p>
      <p className="usjet-blog-cadence__next">
        Cadence began {BLOG_CADENCE_START_LABEL} (50 days before July 4, 2026). Next dispatch in ~
        <strong>{hoursNext}</strong> hour{hoursNext === 1 ? "" : "s"} · posts continue daily through the
        semiquincentennial.
      </p>
    </div>
  );
}
