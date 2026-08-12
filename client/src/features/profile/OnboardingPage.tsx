import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ChevronLeftIcon, ChevronRightIcon } from "../../components/icons";
import OnboardingProfileFields from "./OnboardingProfileFields";
import GoalField from "./GoalField";
import { saveProfile } from "./profileApi";
import { EMPTY_PROFILE_FORM, type ProfileFormState } from "./types";
import profileSetupIllustration from "../../assets/illustrations/profile-setup.svg";
import "./ProfileFields.css";
import "./OnboardingPage.css";

const STEPS = [
  {
    title: "Let's complete your profile",
    subtext: "It will help us to know more about you!",
    illustration: profileSetupIllustration,
    showProgress: false,
    render: OnboardingProfileFields,
  },
  { title: "What's your goal?", showProgress: true, render: GoalField },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ProfileFormState>(EMPTY_PROFILE_FORM);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const patchForm = (patch: Partial<ProfileFormState>) => setForm((f) => ({ ...f, ...patch }));

  const skip = () => navigate("/home", { replace: true });

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    if (!user) return skip();
    setError("");
    setSubmitting(true);
    try {
      await saveProfile(user.id, form);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that — try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const current = STEPS[step];
  const StepFields = current.render;
  const isLastStep = step === STEPS.length - 1;
  const nextLabel = submitting ? "Saving…" : isLastStep ? "Finish" : "Next";

  return (
    <div className="onboarding">
      <div className="onboarding__top">
        {step > 0 ? (
          <button type="button" className="onboarding__back" onClick={() => setStep((s) => s - 1)} aria-label="Back">
            <ChevronLeftIcon width={22} height={22} />
          </button>
        ) : (
          <span />
        )}
        <button type="button" className="onboarding__skip" onClick={skip}>
          Skip for now
        </button>
      </div>

      {current.showProgress && (
        <div className="onboarding__progress">
          {STEPS.map((_, i) => (
            <span key={i} className="onboarding__progress-seg" data-filled={i <= step} />
          ))}
        </div>
      )}

      <div className="onboarding__body">
        {current.illustration && (
          <div className="onboarding__illustration-wrap">
            <div className="onboarding__blob" aria-hidden="true" />
            <img className="onboarding__illustration" src={current.illustration} alt="" />
          </div>
        )}

        {current.showProgress && (
          <span className="eyebrow">
            Step {step + 1} of {STEPS.length}
          </span>
        )}
        <h1 className={"onboarding__title" + (current.illustration ? " onboarding__title--sans" : "")}>
          {current.title}
        </h1>
        {current.subtext && <p className="onboarding__subtext">{current.subtext}</p>}

        {error && <div className="auth-form__error">{error}</div>}

        <StepFields form={form} onChange={patchForm} />
      </div>

      <button type="button" className="btn btn-primary onboarding__next" onClick={handleNext} disabled={submitting}>
        {nextLabel}
        {!submitting && !isLastStep && <ChevronRightIcon width={18} height={18} />}
      </button>
    </div>
  );
}
