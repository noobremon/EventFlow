'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="page-title">My Events</h1>
          <p className="page-subtitle">{events.length} event{events.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/dashboard/events/new" className="btn btn-primary" id="create-event-btn">
          + Create Event
        </Link>
      </div>

      {events.length > 0 && (
        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <input
            className="form-input sm:flex-1"
            type="text"
            placeholder="🔍 Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-events"
          />
          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            id="filter-status"
            style={{ width: 180 }}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}

      {filteredEvents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="card rounded-2xl p-10 text-center">
          <div className="text-5xl">🎉</div>
          <h3 className="mt-4 text-xl font-bold text-slate-900">No events yet</h3>
          <p className="mt-2 text-sm text-slate-600">Create your first event and start collecting RSVPs!</p>
          <Link href="/dashboard/events/new" className="btn btn-primary">
            + Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="card rounded-2xl p-10 text-center">
          <div className="text-5xl">🔍</div>
          <h3 className="mt-4 text-xl font-bold text-slate-900">No matching events</h3>
          <p className="mt-2 text-sm text-slate-600">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
}
