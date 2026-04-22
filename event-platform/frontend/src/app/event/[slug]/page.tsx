'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { PublicEventData } from '@/types';
import Navbar from '@/components/Navbar';
import RegistrationForm from '@/components/RegistrationForm';
import styles from './page.module.css';

export default function PublicEventPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<PublicEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    try {
      const { data: res } = await api.get(`/events/public/${slug}`);
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Event not found');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData: { name: string; email: string }) => {
    await api.post(`/rsvps/register/${slug}`, formData);
    // Refresh event data to update counts
    await fetchEvent();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container"><div className="spinner"></div></div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>🔍</div>
            <h2>Event Not Found</h2>
            <p>{error || 'This event may have been removed or is not yet published.'}</p>
          </div>
        </main>
      </>
    );
  }

  const { event, registrationStatus } = data;
  const eventDate = new Date(event.dateTime);
  const spotsLeft = event.capacity - event.registeredCount;

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        {/* Event Header */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.badgeRow}>
              <span className={`badge badge-${registrationStatus}`}>
                {registrationStatus === 'open' ? '🟢 Open' : registrationStatus === 'full' ? '🔴 Full' : registrationStatus === 'closed' ? '⏱️ Closed' : '🚫 Cancelled'}
              </span>
              <span className={styles.modeTag}>
                {event.registrationMode === 'shortlisted' ? '🔒 Requires Approval' : '🔓 Instant Registration'}
              </span>
            </div>
            <h1 className={styles.title}>{event.title}</h1>
            <div className={styles.metaGrid}>
              <div className={styles.metaCard}>
                <span className={styles.metaIcon}>📅</span>
                <div>
                  <strong>{eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                  <span>{eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div className={styles.metaCard}>
                <span className={styles.metaIcon}>{event.isOnline ? '🌐' : '📍'}</span>
                <div>
                  <strong>{event.isOnline ? 'Online Event' : 'In Person'}</strong>
                  <span>{event.isOnline ? (event.onlineLink ? 'Link provided after registration' : 'Link TBD') : (event.venue || 'Venue TBD')}</span>
                </div>
              </div>
              <div className={styles.metaCard}>
                <span className={styles.metaIcon}>👥</span>
                <div>
                  <strong>{spotsLeft > 0 ? `${spotsLeft} spots left` : 'No spots left'}</strong>
                  <span>{event.registeredCount} / {event.capacity} registered</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.contentGrid}>
          <div className={styles.descSection}>
            <h2 className={styles.sectionTitle}>About This Event</h2>
            <div className={styles.description}>
              {event.description || 'No description provided.'}
            </div>
          </div>

          <div className={styles.sideSection}>
            <RegistrationForm
              onSubmit={handleRegister}
              disabled={registrationStatus !== 'open'}
              statusMessage={registrationStatus}
            />
          </div>
        </div>
      </main>
    </>
  );
}
