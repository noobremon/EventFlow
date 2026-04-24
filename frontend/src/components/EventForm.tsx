'use client';

import { useEffect, useState, FormEvent } from 'react';
import { EventFormData } from '@/types';

interface Props {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
  autosaveKey?: string;
}

const defaultData: EventFormData = {
  title: '',
  description: '',
  dateTime: '',
  venue: '',
  isOnline: false,
  onlineLink: '',
  capacity: 50,
  registrationMode: 'open',
};

const toIsoFromDatetimeLocal = (value: string) => {
  const localDateTimeMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (localDateTimeMatch) {
    const [, year, month, day, hour, minute] = localDateTimeMatch;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute)
    ).toISOString();
  }

  // Fallback for already-normalized ISO values.
  return new Date(value).toISOString();
};

const restoreDraft = (rawDraft: string | null): Partial<EventFormData> | null => {
  if (!rawDraft) return null;

  try {
    const parsed = JSON.parse(rawDraft) as Partial<EventFormData>;
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      title: typeof parsed.title === 'string' ? parsed.title : undefined,
      description: typeof parsed.description === 'string' ? parsed.description : undefined,
      dateTime: typeof parsed.dateTime === 'string' ? parsed.dateTime : undefined,
      venue: typeof parsed.venue === 'string' ? parsed.venue : undefined,
      isOnline: typeof parsed.isOnline === 'boolean' ? parsed.isOnline : undefined,
      onlineLink: typeof parsed.onlineLink === 'string' ? parsed.onlineLink : undefined,
      capacity: typeof parsed.capacity === 'number' ? parsed.capacity : undefined,
      registrationMode:
        parsed.registrationMode === 'open' || parsed.registrationMode === 'shortlisted'
          ? parsed.registrationMode
          : undefined,
    };
  } catch {
    return null;
  }
};

export default function EventForm({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = 'Create Event',
  autosaveKey,
}: Props) {
  const initialFormState: EventFormData = { ...defaultData, ...initialData };
  const [form, setForm] = useState<EventFormData>(initialFormState);
  const [error, setError] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState('');

  useEffect(() => {
    if (!autosaveKey || typeof window === 'undefined') return;

    const draft = restoreDraft(localStorage.getItem(autosaveKey));
    if (!draft) return;

    setForm((prev) => ({ ...prev, ...draft }));
    setAutosaveStatus('Recovered unsaved draft');
  }, [autosaveKey]);

  useEffect(() => {
    if (!autosaveKey || !hasInteracted || typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      localStorage.setItem(autosaveKey, JSON.stringify(form));
      setAutosaveStatus('Draft autosaved');
    }, 500);

    return () => clearTimeout(timer);
  }, [autosaveKey, form, hasInteracted]);

  const handleChange = (field: keyof EventFormData, value: string | number | boolean) => {
    if (!hasInteracted) setHasInteracted(true);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!form.dateTime) {
      setError('Date and time are required');
      return;
    }
    if (form.capacity < 1) {
      setError('Capacity must be at least 1');
      return;
    }

    try {
      const submissionData = { ...form };
      if (submissionData.dateTime) {
        submissionData.dateTime = toIsoFromDatetimeLocal(submissionData.dateTime);
      }
      await onSubmit(submissionData);
      if (autosaveKey && typeof window !== 'undefined') {
        localStorage.removeItem(autosaveKey);
        setAutosaveStatus('');
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || 'Something went wrong');
    }
  };

  const handleClearDraft = () => {
    if (!autosaveKey || typeof window === 'undefined') return;

    localStorage.removeItem(autosaveKey);
    setForm(initialFormState);
    setHasInteracted(false);
    setError('');
    setAutosaveStatus('Draft cleared');
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} id="event-form">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card p-5 sm:p-6">
        <h3 className="mb-4 text-base font-bold text-slate-900">Basic Information</h3>
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label" htmlFor="event-title">Event Title *</label>
            <input
              id="event-title"
              className="form-input"
              type="text"
              placeholder="e.g., React Meetup 2026"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              maxLength={200}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="event-description">Description</label>
            <textarea
              id="event-description"
              className="form-input min-h-32"
              placeholder="Tell attendees about your event..."
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={5}
              maxLength={5000}
            />
            <span className="form-hint">Explain agenda, audience, and key takeaways.</span>
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <h3 className="mb-4 text-base font-bold text-slate-900">Schedule & Capacity</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="form-group">
            <label className="form-label" htmlFor="event-datetime">Date & Time *</label>
            <input
              id="event-datetime"
              className="form-input"
              type="datetime-local"
              value={form.dateTime}
              onChange={(e) => handleChange('dateTime', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="event-capacity">Capacity *</label>
            <input
              id="event-capacity"
              className="form-input"
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 1)}
              required
            />
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <h3 className="mb-4 text-base font-bold text-slate-900">Location & Registration Settings</h3>
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              type="checkbox"
              checked={form.isOnline}
              onChange={(e) => handleChange('isOnline', e.target.checked)}
              id="event-is-online"
              className="size-4 accent-indigo-600"
            />
            <span className="text-sm font-medium text-slate-700">Online Event</span>
          </label>

          {form.isOnline ? (
            <div className="form-group">
              <label className="form-label" htmlFor="event-online-link">Meeting Link</label>
              <input
                id="event-online-link"
                className="form-input"
                type="url"
                placeholder="https://zoom.us/j/..."
                value={form.onlineLink}
                onChange={(e) => handleChange('onlineLink', e.target.value)}
              />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label" htmlFor="event-venue">Venue</label>
              <input
                id="event-venue"
                className="form-input"
                type="text"
                placeholder="Enter venue address"
                value={form.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="event-registration-mode">Registration Mode</label>
            <select
              id="event-registration-mode"
              className="form-input"
              value={form.registrationMode}
              onChange={(e) => handleChange('registrationMode', e.target.value)}
            >
              <option value="open">Open — Attendees are registered instantly</option>
              <option value="shortlisted">Shortlisted — Organizer approves each attendee</option>
            </select>
            <span className="form-hint">
              {form.registrationMode === 'open'
                ? 'Anyone can register and is immediately confirmed.'
                : 'Registrations go to "Pending" until you approve them.'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500" aria-live="polite">
            {autosaveStatus}
          </span>
          {autosaveKey && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleClearDraft}
            >
              Clear saved draft
            </button>
          )}
        </div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="event-submit-btn">
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
