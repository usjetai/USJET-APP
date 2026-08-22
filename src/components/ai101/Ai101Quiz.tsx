import { useMemo, useState, type FormEvent } from "react";
import { Award, CheckCircle2 } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  AI101_QUIZ_PASS_SCORE,
  AI101_QUIZ_QUESTIONS,
  AI101_QUIZ_TOTAL,
} from "../../data/ai101Quiz";
import { useMemberAuth } from "../../context/MemberAuthContext";
import {
  hasPassedAi101,
  readAi101Badge,
  saveAi101BadgePass,
} from "../../lib/ai101QuizStorage";

export default function Ai101Quiz() {
  const { session } = useMemberAuth();
  const customerId = session?.active ? session.customerId : null;

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [badge, setBadge] = useState(() => readAi101Badge(customerId));

  const allAnswered = useMemo(
    () => AI101_QUIZ_QUESTIONS.every((question) => typeof answers[question.id] === "number"),
    [answers],
  );

  const alreadyPassed = Boolean(badge) || hasPassedAi101(customerId);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!allAnswered) return;

    let nextScore = 0;
    for (const question of AI101_QUIZ_QUESTIONS) {
      if (answers[question.id] === question.correctIndex) nextScore += 1;
    }
    setScore(nextScore);
    setSubmitted(true);

    if (nextScore >= AI101_QUIZ_PASS_SCORE) {
      const record = saveAi101BadgePass(nextScore, customerId);
      setBadge(record);
    }
  };

  const onRetry = () => {
    setSubmitted(false);
    setScore(null);
    setAnswers({});
  };

  return (
    <section id="ai101-quiz" className="ai101-quiz scroll-mt-28 sm:scroll-mt-32" aria-labelledby="ai101-quiz-heading">
      <GlassEffectContainer className="ai101-quiz__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <header className="ai101-quiz__header">
          <p className="ai101-quiz__kicker">Graduation check</p>
          <h2 id="ai101-quiz-heading" className="ai101-quiz__title">
            Ten questions — pass for your badge
          </h2>
          <p className="ai101-quiz__lede">
            Score at least {AI101_QUIZ_PASS_SCORE}/{AI101_QUIZ_TOTAL} to earn the AI 101 badge. Hardware checkout does not
            require it.
          </p>
        </header>

        {alreadyPassed && badge ? (
          <div className="ai101-quiz__passed" role="status">
            <Award size={22} aria-hidden />
            <div>
              <p className="ai101-quiz__passed-title">AI 101 badge earned</p>
              <p className="ai101-quiz__passed-copy">
                Score {badge.score}/{badge.total} ·{" "}
                {new Date(badge.passedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                . Saved in this browser.
              </p>
            </div>
          </div>
        ) : null}

        <form className="ai101-quiz__form" onSubmit={onSubmit}>
          <ol className="ai101-quiz__list">
            {AI101_QUIZ_QUESTIONS.map((question, index) => (
              <li key={question.id} className="ai101-quiz__item">
                <p className="ai101-quiz__prompt">
                  <span className="ai101-quiz__num">{index + 1}.</span> {question.prompt}
                </p>
                <div className="ai101-quiz__choices" role="radiogroup" aria-label={`Question ${index + 1}`}>
                  {question.choices.map((choice, choiceIndex) => {
                    const selected = answers[question.id] === choiceIndex;
                    const showResult = submitted;
                    const isCorrect = choiceIndex === question.correctIndex;
                    return (
                      <label
                        key={choice}
                        className={[
                          "ai101-quiz__choice",
                          selected ? "ai101-quiz__choice--selected" : "",
                          showResult && isCorrect ? "ai101-quiz__choice--correct" : "",
                          showResult && selected && !isCorrect ? "ai101-quiz__choice--wrong" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={choiceIndex}
                          checked={selected}
                          disabled={alreadyPassed && Boolean(badge)}
                          onChange={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [question.id]: choiceIndex,
                            }))
                          }
                        />
                        <span>{choice}</span>
                      </label>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>

          {!alreadyPassed || !badge ? (
            <div className="ai101-quiz__actions">
              <button
                type="submit"
                className="ai101-quiz__submit btn-glass-prominent glass-effect-interactive"
                disabled={!allAnswered}
              >
                Submit answers
              </button>
              {!allAnswered ? (
                <p className="ai101-quiz__hint">Answer all ten questions to submit.</p>
              ) : null}
            </div>
          ) : null}
        </form>

        {submitted && score !== null ? (
          <div
            className={[
              "ai101-quiz__result",
              score >= AI101_QUIZ_PASS_SCORE ? "ai101-quiz__result--pass" : "ai101-quiz__result--fail",
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            {score >= AI101_QUIZ_PASS_SCORE ? (
              <>
                <CheckCircle2 size={20} aria-hidden />
                <p>
                  Passed — {score}/{AI101_QUIZ_TOTAL}. Your AI 101 badge is saved in this browser.
                </p>
              </>
            ) : (
              <div className="ai101-quiz__fail-row">
                <p>
                  Score {score}/{AI101_QUIZ_TOTAL}. You need {AI101_QUIZ_PASS_SCORE} to pass. Review the lesson, then try
                  again.
                </p>
                <button type="button" className="ai101-quiz__retry btn-glass glass-effect-interactive" onClick={onRetry}>
                  Try again
                </button>
              </div>
            )}
          </div>
        ) : null}
      </GlassEffectContainer>
    </section>
  );
}
