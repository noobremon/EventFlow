'use client';

import { useState, FormEvent } from 'react';

interface Props {
  onSubmit: (data: { name: string; email: string }) => Promise<void>;
  disabled?: boolean;
  statusMessage?: string;
  registrationMode?: string;
}

export default function RegistrationForm({ onSubmit, disabled = false, statusMessage, registrationMode = 'open' }: Props) {
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
      if (registrationMode === 'shortlisted') {
        setSuccess('🎉 Registration successful! You will get a confirmation once the organizer accepts the request.');
      } else {
        setSuccess('🎉 Registration successful! Check your email for confirmation.');
      }
      setName('');
      setEmail('');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (disabled) {
    return (
      <div className="card space-y-3 p-6 text-center">
        <div className="text-4xl">
          {statusMessage === 'full' ? '🔒' : statusMessage === 'cancelled' ? '🚫' : '⏱️'}
        </div>
        <p className="text-sm text-slate-600">
          {statusMessage === 'full' && 'This event is at full capacity.'}
          {statusMessage === 'cancelled' && 'This event has been cancelled.'}
          {statusMessage === 'closed' && 'Registration for this event has closed.'}
        </p>
      </div>
    );
  }

  return (
    <div className="card space-y-4 p-5 sm:p-6">
      <h3 className="text-lg font-bold text-slate-900">Register for this Event</h3>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-4" id="registration-form">
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

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} id="reg-submit-btn">
            {loading ? 'Registering...' : '🎟️ Register Now'}
          </button>
        </form>
      )}
    </div>
  );
}
