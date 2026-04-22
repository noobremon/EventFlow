'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { PublicEventData } from '@/types';
import Navbar from '@/components/Navbar';
import RegistrationForm from '@/components/RegistrationForm';

export default function PublicEventPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<PublicEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvent = async () => {
    try {
      const { data: res } = await api.get(`/events/public/${slug}`);
      setData(res.data);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || 'Event not found');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvent();
    }, 0);
    return () => clearTimeout(timer);
  }, [slug]);

  const handleRegister = async (formData: { name: string; email: string }) => {
    await api.post(`/rsvps/register/${slug}`, formData);
    // Refresh event data to update counts
    await fetchEvent();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="app-shell flex min-h-[60vh] items-center justify-center"><div className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div></div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Navbar />
        <main className="app-shell py-10">
          <div className="card mx-auto max-w-2xl space-y-3 p-10 text-center">
            <div className="text-5xl">🔍</div>
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
      <main className="app-shell space-y-6 py-8 sm:py-10">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl sm:p-10">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`badge badge-${registrationStatus}`}>
                {registrationStatus === 'open' ? '🟢 Open' : registrationStatus === 'full' ? '🔴 Full' : registrationStatus === 'closed' ? '⏱️ Closed' : '🚫 Cancelled'}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                {event.registrationMode === 'shortlisted' ? '🔒 Requires Approval' : '🔓 Instant Registration'}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{event.title}</h1>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <span className="text-lg">📅</span>
                <div>
                  <strong className="block">{eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                  <span className="text-sm text-indigo-50">{eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <span className="text-lg">{event.isOnline ? '🌐' : '📍'}</span>
                <div>
                  <strong className="block">{event.isOnline ? 'Online Event' : 'In Person'}</strong>
                  <span className="text-sm text-indigo-50">{event.isOnline ? (event.onlineLink ? 'Link provided after registration' : 'Link TBD') : (event.venue || 'Venue TBD')}</span>
                </div>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <span className="text-lg">👥</span>
                <div>
                  <strong className="block">{spotsLeft > 0 ? `${spotsLeft} spots left` : 'No spots left'}</strong>
                  <span className="text-sm text-indigo-50">{event.registeredCount} / {event.capacity} registered</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900">About This Event</h2>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {event.description || 'No description provided.'}
            </div>
          </div>

          <div>
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
