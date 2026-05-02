'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';

        <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.28),transparent_30%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.18),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.2),rgba(15,23,42,0.85))]"></div>
          <div className="app-shell relative grid gap-10 lg:grid-cols-2 lg:items-center">
    <>
              <div className="section-kicker border-white/10 bg-white/5 text-white/80">
                Built for modern event organizers
        <section className="relative overflow-hidden bg-linear-to-br from-indigo-700 via-violet-700 to-fuchsia-700 py-20 text-white sm:py-24">
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Create and manage events
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <span className="bg-linear-to-r from-indigo-200 via-white to-fuchsia-200 bg-clip-text text-transparent">
                  with precision
                </span>
              </div>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                From registration and approvals to reminders and attendee tracking, EventFlow keeps every moving part in one calm command center.
                <br />
                <span className="text-indigo-100">Effortlessly</span>
                <Link href="/signup" className="btn btn-lg bg-white text-slate-950 hover:bg-slate-100" id="hero-get-started">
              <p className="mt-4 max-w-xl text-base text-indigo-100 sm:text-lg">
                From tech meetups to workshops - publish events, manage RSVPs, and keep attendees informed in one platform.
                <Link href="/login" className="btn btn-lg border border-white/10 bg-white/5 text-white hover:bg-white/10" id="hero-login">
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className="btn btn-lg bg-white text-indigo-700 hover:bg-indigo-50" id="hero-get-started">
                  Get Started Free →
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Smart RSVPs</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Email automations</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Capacity tracking</span>
              </div>
                </Link>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="hero-card sm:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Live overview</p>
                    <h2 className="mt-1 text-2xl font-bold">Event published</h2>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-300">Open now</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ['+24', 'RSVPs today'],
                    ['85%', 'Capacity filled'],
                    ['12', 'Pending approvals'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-2xl font-bold text-white">{value}</div>
                      <div className="mt-1 text-sm text-slate-300">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {[
                {
                  title: 'Approval Queue',
                  desc: 'Manual review workflows for shortlist-only events.',
                },
                {
                  title: 'Live Tracking',
                  desc: 'Monitor seats, registrations, and check-ins in real time.',
                },
                {
                  title: 'Zoom Sync',
                  desc: 'Keep virtual events connected without extra manual steps.',
                },
                {
                  title: 'Full-Cycle Support',
                  desc: 'Plan, publish, manage, and scale without switching tools.',
                },
              ].map((item) => (
                <div key={item.title} className="hero-card">
                  <div className="text-sm uppercase tracking-[0.26em] text-slate-300">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{item.desc}</p>
                </div>
              ))}
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                <div className="size-3 rounded-full bg-amber-400"></div>
              <span>85% Capacity</span>
        <section className="app-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div className="section-kicker">Capabilities</div>
              <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Removing the friction from event operations.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Build the event flow you want without the clutter. EventFlow gives you clear registration controls, structured workflows, and the visibility you need to launch faster.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Start with an idea', 'Move from concept to published event quickly.'],
                ['Define the strategy', 'Choose open registration or approval-based flow.'],
                ['Generate instantly', 'Create polished event pages in minutes.'],
                ['Refine with data', 'Track what works and improve every launch.'],
              ].map(([title, desc]) => (
                <div key={title} className="card p-5">
                  <div className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">{title}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Event Management',
                desc: 'Create, edit, and publish events with rich details for both in-person and online sessions.',
              },
              {
                title: 'Smart RSVP',
                desc: 'Approve, reject, or open registration with a workflow that stays easy to control.',
              },
              {
                title: 'Email Notifications',
                desc: 'Automatic email updates for registration, approval, rejection, and event changes.',
              },
              {
                title: 'Public Event Pages',
                desc: 'Shareable URLs with live status updates and simple attendee registration.',
              },
            ].map((feature) => (
              <div key={feature.title} className="card p-5">
                <h3 className="text-lg font-bold text-slate-950">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="app-shell pb-16 sm:pb-20">
          <div className="surface-dark relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -top-20 right-0 size-56 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
            <div className="pointer-events-none absolute -bottom-24 left-0 size-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
            <div className="relative text-center">
              <div className="section-kicker mx-auto border-white/10 bg-white/5 text-white/75">Get started</div>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Ready to ship your next event?</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Start managing registrations, approvals, and guest flow with a UI that keeps the work visible and the process calm.
              </p>
              <Link href="/signup" className="btn btn-lg mt-7 bg-white text-slate-950 hover:bg-slate-100" id="cta-signup">
                Create Your First Event →
              </Link>
            </div>
          </div>
        </section>

        <footer className="relative overflow-hidden border-t border-slate-200 bg-white/60 py-8 backdrop-blur">
          <div className="app-shell relative flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <div>
              <div className="text-base font-extrabold tracking-tight text-slate-950">EventFlow</div>
              <p className="text-sm text-slate-500">The event operating system for teams that want precision.</p>
            </div>
            <p className="text-sm text-slate-500">© 2026 EventFlow. Built for event organizers.</p>
          </div>
        </footer>
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
