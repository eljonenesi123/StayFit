import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import BackButton from "../../components/BackButton";
import HeightWeightFields from "./HeightWeightFields";
import AgeGenderFields from "./AgeGenderFields";
import GoalField from "./GoalField";
import { getProfile, saveProfile } from "./profileApi";
import { profileToForm } from "./units";
import { EMPTY_PROFILE_FORM, type ProfileFormState } from "./types";
import "./ProfileFields.css";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState<ProfileFormState>(EMPTY_PROFILE_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getProfile(user.id)
      .then((profile) => {
        if (!cancelled) setForm((f) => profileToForm(profile, f));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Couldn't load your profile.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const patchForm = (patch: Partial<ProfileFormState>) => {
    setSaved(false);
    setForm((f) => ({ ...f, ...patch }));
  };

  const handleSave = async () => {
    if (!user) return;
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      await saveProfile(user.id, form);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that — try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page profile-page">
      <BackButton />
      <div className="page-header profile-page__header">
        <h1>Your profile</h1>
        <p>Used to personalize calorie estimates and recommendations.</p>
      </div>

      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : (
        <div className="stack">
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
        </div>
      )}
    </div>
  );
}
