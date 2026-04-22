'use client';

import Link from 'next/link';
import { Event } from '@/types';

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const date = new Date(event.dateTime);
  const capacityPercent = Math.round((event.registeredCount / event.capacity) * 100);

  return (
    <Link href={`/dashboard/events/${event._id}`} className="card block space-y-4 p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md" id={`event-card-${event._id}`}>
      <div className="flex items-center justify-between gap-3">
        <span className={`badge badge-${event.status}`}>{event.status}</span>
        <span className="text-xs font-medium text-slate-500">
          {event.registrationMode === 'shortlisted' ? '🔒 Shortlisted' : '🔓 Open'}
        </span>
      </div>

      <h3 className="line-clamp-2 text-lg font-bold text-slate-900">{event.title}</h3>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span>📅</span>
          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div className="flex items-center gap-2">
          <span>{event.isOnline ? '🌐' : '📍'}</span>
          {event.isOnline ? 'Online' : event.venue || 'TBD'}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">Capacity</span>
          <span className="font-semibold text-slate-900">
            {event.registeredCount} / {event.capacity}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(capacityPercent, 100)}%`,
              background: capacityPercent >= 90 ? '#e11d48' : capacityPercent >= 70 ? '#d97706' : '#4f46e5',
            }}
          />
        </div>
      </div>
    </Link>
  );
}
