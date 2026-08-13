import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import HeightWeightFields from "./HeightWeightFields";
import AgeGenderFields from "./AgeGenderFields";
import GoalField from "./GoalField";
import { useProfile, useSaveProfile } from "./useProfile";
import { profileToForm, resolveWeightKg } from "./units";
import { EMPTY_PROFILE_FORM, type ProfileFormState } from "./types";
import { logWeight } from "../progress/weightLog";
import LottieBurst from "../../components/LottieBurst";
import successCheckAnim from "../../assets/lottie/success-check.json";
import goalConfettiAnim from "../../assets/lottie/goal-confetti.json";
import "./ProfileFields.css";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const { profile, loading } = useProfile();
  const saveProfile = useSaveProfile();
  const [form, setForm] = useState<ProfileFormState>(EMPTY_PROFILE_FORM);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [successKey, setSuccessKey] = useState(0);
  const [milestoneKey, setMilestoneKey] = useState(0);

  // The shared store may already have this profile cached (e.g. the
  // dashboard just fetched it) — only seed the editable form once, the
  // first time loading finishes, so it doesn't clobber in-progress edits.
  useEffect(() => {
    if (loading || initialized) return;
    setForm((f) => profileToForm(profile, f));
    setInitialized(true);
  }, [loading, initialized, profile]);

  const patchForm = (patch: Partial<ProfileFormState>) => {
    setSaved(false);
    setForm((f) => ({ ...f, ...patch }));
  };

  const handleLogOut = async () => {
    await logOut();
    navigate("/welcome", { replace: true });
  };

  const handleSave = async () => {
    if (!user) return;
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      await saveProfile(form);
      setSaved(true);
      setSuccessKey((k) => k + 1);
      const newWeight = resolveWeightKg(form);
      if (newWeight != null) {
        const { milestoneHit } = logWeight(user.id, newWeight);
        if (milestoneHit) setMilestoneKey((k) => k + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that — try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page profile-page">
      <div className="page-header">
        <h1>Your profile</h1>
        <p>Used to personalize calorie estimates and recommendations.</p>
      </div>

      {loading || !initialized ? (
        <div className="empty-state">Loading…</div>
      ) : (
        <div className="stack profile-page__stack">
          <LottieBurst playKey={successKey} animationData={successCheckAnim} size={72} />
          <LottieBurst playKey={milestoneKey} animationData={goalConfettiAnim} size={220} />

          {error && <div className="auth-form__error">{error}</div>}
          {saved && <div className="profile-page__saved">Saved.</div>}

          <div className="card">
            <HeightWeightFields form={form} onChange={patchForm} />
          </div>
          <div className="card">
            <AgeGenderFields form={form} onChange={patchForm} />
          </div>
          <div className="card">
            <GoalField form={form} onChange={patchForm} />
          </div>

          <button type="button" className="btn btn-primary profile-page__save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>

          <div className="card profile-page__settings">
            <span className="eyebrow">Account settings</span>
            <div className="profile-page__setting-row">
              <span>Notifications</span>
              <button type="button" className="chip chip-neutral" disabled>
                Coming soon
              </button>
            </div>
            <div className="profile-page__setting-row">
              <span>Units</span>
              <select disabled defaultValue="metric" aria-label="Preferred units (coming soon)">
                <option value="metric">Metric (kg, cm)</option>
                <option value="imperial">Imperial (lb, ft/in)</option>
              </select>
            </div>
            <button type="button" className="btn btn-ghost profile-page__logout" onClick={handleLogOut}>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
