'use client';

import { useState, FormEvent } from 'react';
import styles from './RegistrationForm.module.css';

interface Props {
  onSubmit: (data: { name: string; email: string }) => Promise<void>;
  disabled?: boolean;
  statusMessage?: string;
}

export default function RegistrationForm({ onSubmit, disabled = false, statusMessage }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim() });
      setSuccess('🎉 Registration successful! Check your email for confirmation.');
      setName('');
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (disabled) {
    return (
      <div className={styles.disabledContainer}>
        <div className={styles.disabledIcon}>
          {statusMessage === 'full' ? '🔒' : statusMessage === 'cancelled' ? '🚫' : '⏱️'}
        </div>
        <p className={styles.disabledText}>
          {statusMessage === 'full' && 'This event is at full capacity.'}
          {statusMessage === 'cancelled' && 'This event has been cancelled.'}
          {statusMessage === 'closed' && 'Registration for this event has closed.'}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Register for this Event</h3>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!success && (
        <form onSubmit={handleSubmit} className={styles.form} id="registration-form">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Your Name *</label>
            <input
              id="reg-name"
              className="form-input"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Your Email *</label>
            <input
              id="reg-email"
              className="form-input"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="reg-submit-btn" style={{ width: '100%' }}>
            {loading ? 'Registering...' : '🎟️ Register Now'}
          </button>
        </form>
      )}
    </div>
  );
}
