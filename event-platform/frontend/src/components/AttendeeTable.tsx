'use client';

import { RSVP } from '@/types';
import styles from './AttendeeTable.module.css';

interface Props {
  attendees: RSVP[];
  registrationMode: 'open' | 'shortlisted';
  onStatusChange: (rsvpId: string, status: string) => void;
  loading?: string | null; // rsvpId currently loading
}

export default function AttendeeTable({ attendees, registrationMode, onStatusChange, loading }: Props) {
  if (attendees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">👥</div>
        <h3 className="empty-state-title">No attendees yet</h3>
        <p className="empty-state-text">Share your event link to start getting registrations</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table" id="attendees-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Registered</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => (
            <tr key={attendee._id} id={`attendee-${attendee._id}`}>
              <td>
                <strong>{attendee.name}</strong>
              </td>
              <td className={styles.email}>{attendee.email}</td>
              <td>
                <span className={`badge badge-${attendee.status}`}>{attendee.status}</span>
              </td>
              <td className={styles.date}>
                {new Date(attendee.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td>
                <div className={styles.actions}>
                  {attendee.status === 'pending' && (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => onStatusChange(attendee._id, 'approved')}
                        disabled={loading === attendee._id}
                        id={`approve-${attendee._id}`}
                      >
                        ✓ Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onStatusChange(attendee._id, 'rejected')}
                        disabled={loading === attendee._id}
                        id={`reject-${attendee._id}`}
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                  {(attendee.status === 'registered' || attendee.status === 'approved') && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onStatusChange(attendee._id, 'revoked')}
                      disabled={loading === attendee._id}
                      id={`revoke-${attendee._id}`}
                      style={{ color: 'var(--danger)' }}
                    >
                      Revoke
                    </button>
                  )}
                  {attendee.status === 'rejected' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => onStatusChange(attendee._id, 'approved')}
                      disabled={loading === attendee._id}
                      id={`approve-rejected-${attendee._id}`}
                    >
                      ✓ Approve
                    </button>
                  )}
                  {attendee.status === 'revoked' && (
                    <span className={styles.noActions}>—</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
