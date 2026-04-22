'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700 py-20 text-white sm:py-24">
          <div className="app-shell relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              <span>🚀</span> Built for Modern Event Organizers
              </div>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                Create & Manage Events
                <br />
                <span className="text-indigo-100">Effortlessly</span>
              </h1>
              <p className="mt-4 max-w-xl text-base text-indigo-100 sm:text-lg">
                From tech meetups to workshops - publish events, manage RSVPs, and keep attendees informed in one platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className="btn btn-lg bg-white text-indigo-700 hover:bg-indigo-50" id="hero-get-started">
                  Get Started Free →
                </Link>
                <Link href="/login" className="btn btn-lg border border-white/30 bg-white/10 text-white hover:bg-white/20" id="hero-login">
                  Log In
                </Link>
              </div>
            </div>
            <div className="space-y-3 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                <div className="size-3 rounded-full bg-emerald-400"></div>
              <span>Event Published</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                <div className="size-3 rounded-full bg-indigo-300"></div>
              <span>+24 RSVPs Today</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                <div className="size-3 rounded-full bg-amber-400"></div>
              <span>85% Capacity</span>
              </div>
            </div>
          </div>
        </section>

        <section className="app-shell py-14 sm:py-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Everything You Need</h2>
            <p className="mt-2 text-slate-600">
              Powerful tools for organizers, seamless experience for attendees
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                { icon: '📅', title: 'Event Management', desc: 'Create, edit, and publish events with rich details. Support for both in-person and online events.' },
                { icon: '🎟️', title: 'Smart RSVP', desc: 'Open registration or shortlisted mode. Approve, reject, and manage attendees with ease.' },
                { icon: '📧', title: 'Email Notifications', desc: 'Automatic emails for registration, approval, rejection, and event updates.' },
                { icon: '📊', title: 'Capacity Tracking', desc: 'Real-time capacity monitoring. Auto-close when full, free spots on revocation.' },
                { icon: '🎨', title: 'Event Templates', desc: 'Start fast with pre-built templates for meetups, webinars, and workshops.' },
                { icon: '🔗', title: 'Public Event Pages', desc: 'Shareable public URLs with live status updates and instant registration.' },
              ].map((feature) => (
                <div key={feature.title} className="card rounded-2xl p-5 text-left">
                  <div className="text-2xl">{feature.icon}</div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">{feature.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="app-shell pb-16">
          <div className="rounded-3xl bg-slate-900 p-8 text-center text-white sm:p-10">
              <h2 className="text-3xl font-extrabold tracking-tight">Ready to Host Your Next Event?</h2>
              <p className="mt-2 text-slate-300">
                Join EventFlow and start creating memorable events in minutes.
              </p>
              <Link href="/signup" className="btn btn-lg mt-6 bg-indigo-500 text-white hover:bg-indigo-400" id="cta-signup">
                Create Your First Event →
              </Link>
          </div>
        </section>

        <footer className="relative overflow-hidden border-t border-indigo-300/20 bg-gradient-to-r from-indigo-950 via-violet-950 to-fuchsia-950 py-8">
          <div className="pointer-events-none absolute -top-16 left-12 size-40 rounded-full bg-fuchsia-500/30 blur-3xl"></div>
          <div className="pointer-events-none absolute -bottom-20 right-10 size-52 rounded-full bg-indigo-500/30 blur-3xl"></div>
          <div className="app-shell relative">
            <p className="text-center text-sm font-medium text-indigo-100">© 2026 EventFlow. Built with ❤️ for event organizers.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
