'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span>🚀</span> Built for Modern Event Organizers
            </div>
            <h1 className={styles.heroTitle}>
              Create & Manage Events
              <br />
              <span className={styles.heroAccent}>Effortlessly</span>
            </h1>
            <p className={styles.heroSubtitle}>
              From tech meetups to workshops — publish events, manage RSVPs,
              and keep attendees informed, all in one beautiful platform.
            </p>
            <div className={styles.heroCta}>
              <Link href="/signup" className="btn btn-primary btn-lg" id="hero-get-started">
                Get Started Free →
              </Link>
              <Link href="/login" className="btn btn-secondary btn-lg" id="hero-login">
                Log In
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.floatingCard} style={{ animationDelay: '0s' }}>
              <div className={styles.cardDot} style={{ background: 'var(--success)' }}></div>
              <span>Event Published</span>
            </div>
            <div className={styles.floatingCard} style={{ animationDelay: '0.5s' }}>
              <div className={styles.cardDot} style={{ background: 'var(--primary-500)' }}></div>
              <span>+24 RSVPs Today</span>
            </div>
            <div className={styles.floatingCard} style={{ animationDelay: '1s' }}>
              <div className={styles.cardDot} style={{ background: 'var(--warning)' }}></div>
              <span>85% Capacity</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Everything You Need</h2>
            <p className={styles.sectionSubtitle}>
              Powerful tools for organizers, seamless experience for attendees
            </p>
            <div className={styles.featureGrid}>
              {[
                { icon: '📅', title: 'Event Management', desc: 'Create, edit, and publish events with rich details. Support for both in-person and online events.' },
                { icon: '🎟️', title: 'Smart RSVP', desc: 'Open registration or shortlisted mode. Approve, reject, and manage attendees with ease.' },
                { icon: '📧', title: 'Email Notifications', desc: 'Automatic emails for registration, approval, rejection, and event updates.' },
                { icon: '📊', title: 'Capacity Tracking', desc: 'Real-time capacity monitoring. Auto-close when full, free spots on revocation.' },
                { icon: '🎨', title: 'Event Templates', desc: 'Start fast with pre-built templates for meetups, webinars, and workshops.' },
                { icon: '🔗', title: 'Public Event Pages', desc: 'Shareable public URLs with live status updates and instant registration.' },
              ].map((feature) => (
                <div key={feature.title} className={styles.featureCard}>
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDesc}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Host Your Next Event?</h2>
              <p className={styles.ctaText}>
                Join EventFlow and start creating memorable events in minutes.
              </p>
              <Link href="/signup" className="btn btn-primary btn-lg" id="cta-signup">
                Create Your First Event →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className="container">
            <p>© 2026 EventFlow. Built with ❤️ for event organizers.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
