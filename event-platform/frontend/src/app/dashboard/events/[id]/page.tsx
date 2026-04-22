'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Event, EventFormData } from '@/types';
import EventForm from '@/components/EventForm';
import styles from './page.module.css';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${eventId}`);
      setEvent(data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: EventFormData) => {
    setUpdating(true);
    try {
      const { data: res } = await api.put(`/events/${eventId}`, data);
      setEvent(res.data);
      setEditMode(false);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to ${newStatus === 'published' ? 'publish' : 'cancel'} this event?`)) return;
    setStatusLoading(true);
    try {
      const { data } = await api.patch(`/events/${eventId}/status`, { status: newStatus });
      setEvent(data.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const copyPublicUrl = () => {
    if (!event) return;
    const url = `${window.location.origin}/event/${event.slug}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  if (error || !event) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <p className="alert alert-error">{error || 'Event not found'}</p>
        <Link href="/dashboard" className="btn btn-secondary" style={{ marginTop: 16 }}>
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/event/${event.slug}`
    : `/event/${event.slug}`;

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <Link href="/dashboard" className="btn btn-ghost" style={{ marginBottom: 8, marginLeft: -12 }}>
            ← Back
          </Link>
          <h1 className="page-title">{event.title}</h1>
          <div className={styles.metaRow}>
            <span className={`badge badge-${event.status}`}>{event.status}</span>
            <span className={styles.metaText}>
              {event.registeredCount} / {event.capacity} registered
            </span>
          </div>
        </div>
        <div className={styles.headerActions}>
          {event.status === 'draft' && (
            <button
              className="btn btn-success"
              onClick={() => handleStatusChange('published')}
              disabled={statusLoading}
              id="publish-event-btn"
            >
              🚀 Publish
            </button>
          )}
          {event.status !== 'cancelled' && (
            <button
              className="btn btn-danger"
              onClick={() => handleStatusChange('cancelled')}
              disabled={statusLoading}
              id="cancel-event-btn"
            >
              Cancel Event
            </button>
          )}
          {event.status !== 'cancelled' && (
            <button
              className="btn btn-secondary"
              onClick={() => setEditMode(!editMode)}
              id="edit-event-btn"
            >
              {editMode ? '✕ Cancel Edit' : '✏️ Edit'}
            </button>
          )}
        </div>
      </div>

      {/* Public URL */}
      {event.status === 'published' && (
        <div className={styles.publicUrlBar}>
          <span className={styles.urlLabel}>Public URL:</span>
          <code className={styles.urlCode}>{publicUrl}</code>
          <button className="btn btn-sm btn-secondary" onClick={copyPublicUrl} id="copy-url-btn">
            {copySuccess ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
      )}

      {editMode ? (
        <div className="card" style={{ maxWidth: 700 }}>
          <EventForm
            initialData={{
              title: event.title,
              description: event.description,
              dateTime: event.dateTime.slice(0, 16),
              venue: event.venue,
              isOnline: event.isOnline,
              onlineLink: event.onlineLink,
              capacity: event.capacity,
              registrationMode: event.registrationMode,
            }}
            onSubmit={handleUpdate}
            loading={updating}
            submitLabel="Save Changes"
          />
        </div>
      ) : (
        <div className={styles.infoGrid}>
          <div className="card">
            <h3 className={styles.sectionTitle}>Event Details</h3>
            <div className={styles.detailList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>📅 Date & Time</span>
                <span>{new Date(event.dateTime).toLocaleString()}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>{event.isOnline ? '🌐 Online' : '📍 Venue'}</span>
                <span>{event.isOnline ? (event.onlineLink || 'Link not set') : (event.venue || 'TBD')}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>🎟️ Registration Mode</span>
                <span style={{ textTransform: 'capitalize' }}>{event.registrationMode}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>👥 Capacity</span>
                <span>{event.registeredCount} / {event.capacity}</span>
              </div>
            </div>
            {event.description && (
              <>
                <h4 className={styles.descLabel}>Description</h4>
                <p className={styles.description}>{event.description}</p>
              </>
            )}
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 className={styles.sectionTitle} style={{ margin: 0 }}>Attendees</h3>
              <Link href={`/dashboard/events/${event._id}/attendees`} className="btn btn-primary btn-sm" id="manage-attendees-link">
                Manage →
              </Link>
            </div>
            <div className={styles.attendeeStats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{event.registeredCount}</span>
                <span className={styles.statLabel}>Registered</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{event.capacity - event.registeredCount}</span>
                <span className={styles.statLabel}>Spots Left</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{Math.round((event.registeredCount / event.capacity) * 100)}%</span>
                <span className={styles.statLabel}>Capacity</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
