'use client';

import { useState, FormEvent } from 'react';
import { EventFormData } from '@/types';
import styles from './EventForm.module.css';

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
      await onSubmit(form);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} id="event-form">
      {error && <div className="alert alert-error">{error}</div>}

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
          className="form-input"
          placeholder="Tell attendees about your event..."
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={5}
          maxLength={5000}
        />
      </div>

      <div className={styles.row}>
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

      <div className={styles.toggleGroup}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={form.isOnline}
            onChange={(e) => handleChange('isOnline', e.target.checked)}
            id="event-is-online"
          />
          <span className={styles.toggleSlider}></span>
          <span className={styles.toggleLabel}>Online Event</span>
        </label>
      </div>

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

      <div className={styles.formActions}>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="event-submit-btn">
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
