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

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Events</h1>
          <p className="page-subtitle">{events.length} event{events.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/dashboard/events/new" className="btn btn-primary" id="create-event-btn">
          + Create Event
        </Link>
      </div>

      {events.length > 0 && (
        <div className="filter-bar">
          <input
            className="form-input search-input"
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
            style={{ width: 160 }}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}

      {filteredEvents.length > 0 ? (
        <div className="grid-cards">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">🎉</div>
          <h3 className="empty-state-title">No events yet</h3>
          <p className="empty-state-text">Create your first event and start collecting RSVPs!</p>
          <Link href="/dashboard/events/new" className="btn btn-primary">
            + Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="empty-state card">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">No matching events</h3>
          <p className="empty-state-text">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
}
