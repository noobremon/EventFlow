'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Event, EventFormData } from '@/types';
import EventForm from '@/components/EventForm';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadingCSV, setDownloadingCSV] = useState(false);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${eventId}`);
      setEvent(data.data);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvent();
    }, 0);
    return () => clearTimeout(timer);
  }, [eventId]);

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
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      alert(message || 'Failed to update status');
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

  const handleDownloadCSV = async () => {
    setDownloadingCSV(true);
    try {
      const response = await api.get(`/events/${eventId}/export-csv`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${event?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'event'}-attendees.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: unknown) {
      alert('Failed to download CSV');
    } finally {
      setDownloadingCSV(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><div className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div></div>;
  }

  if (error || !event) {
    return (
      <div className="card p-10 text-center">
        <p className="alert alert-error">{error || 'Event not found'}</p>
        <Link href="/dashboard" className="btn btn-secondary mt-4">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/event/${event.slug}`
    : `/event/${event.slug}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/dashboard" className="btn btn-ghost -ml-3 mb-2">
            ← Back
          </Link>
          <h1 className="page-title">{event.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className={`badge badge-${event.status}`}>{event.status}</span>
            <span className="text-sm text-slate-600">
              {event.registeredCount} / {event.capacity} registered
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
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
        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-semibold text-slate-700">Public URL:</span>
          <code className="overflow-x-auto rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-700">{publicUrl}</code>
          <button className="btn btn-sm btn-secondary" onClick={copyPublicUrl} id="copy-url-btn">
            {copySuccess ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
      )}

      {editMode ? (
        <div className="mx-auto max-w-4xl">
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
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card space-y-5 p-5 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-900">Event Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                <span className="font-medium text-slate-600">📅 Date & Time</span>
                <span>{new Date(event.dateTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                <span className="font-medium text-slate-600">{event.isOnline ? '🌐 Online' : '📍 Venue'}</span>
                <span>{event.isOnline ? (event.onlineLink || 'Link not set') : (event.venue || 'TBD')}</span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                <span className="font-medium text-slate-600">🎟️ Registration Mode</span>
                <span style={{ textTransform: 'capitalize' }}>{event.registrationMode}</span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                <span className="font-medium text-slate-600">👥 Capacity</span>
                <span>{event.registeredCount} / {event.capacity}</span>
              </div>
            </div>
            {event.description && (
              <>
                <h4 className="text-sm font-semibold text-slate-700">Description</h4>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{event.description}</p>
              </>
            )}
          </div>

          <div className="card space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Attendees</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadCSV}
                  disabled={downloadingCSV}
                  className="btn btn-secondary btn-sm"
                  id="download-csv-btn"
                >
                  {downloadingCSV ? 'Downloading...' : '⬇️ CSV'}
                </button>
                <Link href={`/dashboard/events/${event._id}/attendees`} className="btn btn-primary btn-sm" id="manage-attendees-link">
                  Manage →
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="block text-xl font-bold text-slate-900">{event.registeredCount}</span>
                <span className="text-xs text-slate-600">Registered</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="block text-xl font-bold text-slate-900">{event.capacity - event.registeredCount}</span>
                <span className="text-xs text-slate-600">Spots Left</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="block text-xl font-bold text-slate-900">{Math.round((event.registeredCount / event.capacity) * 100)}%</span>
                <span className="text-xs text-slate-600">Capacity</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
