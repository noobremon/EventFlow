'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { RSVP, Event } from '@/types';
import AttendeeTable from '@/components/AttendeeTable';

export default function AttendeesPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [attendees, setAttendees] = useState<RSVP[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  const fetchAttendees = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (statusFilter) queryParams.set('status', statusFilter);

      const { data } = await api.get(`/rsvps/event/${eventId}?${queryParams.toString()}`);
      setAttendees(data.data.attendees);
      setEvent(data.data.event);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || 'Failed to load attendees');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAttendees();
    }, 0);
    return () => clearTimeout(timer);
  }, [eventId, search, statusFilter]);

  const handleStatusChange = async (rsvpId: string, status: string) => {
    setActionLoading(rsvpId);
    try {
      await api.patch(`/rsvps/${rsvpId}/status`, { status });
      await fetchAttendees();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      alert(message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><div className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div></div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href={`/dashboard/events/${eventId}`}
            className="btn btn-ghost -ml-3 mb-2"
          >
            ← Back to Event
          </Link>
          <h1 className="page-title">Manage Attendees</h1>
          <p className="page-subtitle">
            {event?.title} — {attendees.length} attendee{attendees.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <input
          className="form-input sm:flex-1"
          type="text"
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="search-attendees"
        />
        <select
          className="form-input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          id="filter-attendee-status"
          style={{ width: 180 }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="registered">Registered</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="revoked">Revoked</option>
        </select>
      </div>

      <AttendeeTable
        attendees={attendees}
        registrationMode={event?.registrationMode || 'open'}
        onStatusChange={handleStatusChange}
        loading={actionLoading}
      />
    </div>
  );
}
