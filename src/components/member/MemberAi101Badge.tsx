import { Link } from "react-router-dom";
import { Award } from "lucide-react";
import { useEffect, useState } from "react";
import {
  bindAi101BadgeToCustomer,
  readAi101Badge,
  type Ai101BadgeRecord,
} from "../../lib/ai101QuizStorage";

type MemberAi101BadgeProps = {
  customerId: string;
};

export default function MemberAi101Badge({ customerId }: MemberAi101BadgeProps) {
  const [badge, setBadge] = useState<Ai101BadgeRecord | null>(() => readAi101Badge(customerId));

  useEffect(() => {
    const bound = bindAi101BadgeToCustomer(customerId);
    setBadge(bound ?? readAi101Badge(customerId));
  }, [customerId]);

  if (!badge) {
    return (
      <div className="member-ai101-badge member-ai101-badge--locked">
        <Award size={18} aria-hidden />
        <div>
          <p className="member-ai101-badge__label">AI 101 badge</p>
          <p className="member-ai101-badge__copy">
            Not earned yet. Complete the{" "}
            <Link to="/ai-101#ai101-quiz" className="member-ai101-badge__link">
              one-on-one quiz
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="member-ai101-badge member-ai101-badge--earned" role="status">
      <Award size={20} aria-hidden />
      <div>
        <p className="member-ai101-badge__label">AI 101 complete</p>
        <p className="member-ai101-badge__copy">
          Passed {badge.score}/{badge.total} ·{" "}
          {new Date(badge.passedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
