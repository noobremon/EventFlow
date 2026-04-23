'use client';

import { useState, FormEvent } from 'react';
import { EventFormData } from '@/types';

interface Props {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
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

export default function EventForm({ initialData, onSubmit, loading = false, submitLabel = 'Create Event' }: Props) {
  const [form, setForm] = useState<EventFormData>({ ...defaultData, ...initialData });
  const [error, setError] = useState('');

  const handleChange = (field: keyof EventFormData, value: string | number | boolean) => {
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
        submissionData.dateTime = new Date(submissionData.dateTime).toISOString();
      }
      await onSubmit(submissionData);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || 'Something went wrong');
    }
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

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="event-submit-btn">
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
