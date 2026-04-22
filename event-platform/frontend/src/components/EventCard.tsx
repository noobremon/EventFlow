'use client';

import Link from 'next/link';
import { Event } from '@/types';
import styles from './EventCard.module.css';

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const date = new Date(event.dateTime);
  const capacityPercent = Math.round((event.registeredCount / event.capacity) * 100);

  return (
    <Link href={`/dashboard/events/${event._id}`} className={`card card-hover ${styles.card}`} id={`event-card-${event._id}`}>
      <div className={styles.header}>
        <span className={`badge badge-${event.status}`}>{event.status}</span>
        <span className={styles.mode}>
          {event.registrationMode === 'shortlisted' ? '🔒 Shortlisted' : '🔓 Open'}
        </span>
      </div>

      <h3 className={styles.title}>{event.title}</h3>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}>📅</span>
          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}>{event.isOnline ? '🌐' : '📍'}</span>
          {event.isOnline ? 'Online' : event.venue || 'TBD'}
        </div>
      </div>

      <div className={styles.capacity}>
        <div className={styles.capacityHeader}>
          <span className={styles.capacityLabel}>Capacity</span>
          <span className={styles.capacityCount}>
            {event.registeredCount} / {event.capacity}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${Math.min(capacityPercent, 100)}%`,
              background: capacityPercent >= 90 ? 'var(--danger)' : capacityPercent >= 70 ? 'var(--warning)' : 'var(--primary-500)',
            }}
          />
        </div>
      </div>
    </Link>
  );
}
