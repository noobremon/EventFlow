'use client';

import { RSVP } from '@/types';

type AttendanceStatus = 'present' | 'absent';

interface Props {
  attendees: RSVP[];
  registrationMode: 'open' | 'shortlisted';
  onStatusChange: (rsvpId: string, status: string) => void;
  loading?: string | null; // rsvpId currently loading
  isEventDay?: boolean;
  attendanceMarks?: Record<string, AttendanceStatus>;
  pendingAttendance?: Record<string, AttendanceStatus>;
  onAttendanceSelect?: (rsvpId: string, status: AttendanceStatus) => void;
  onAttendanceConfirm?: (rsvpId: string) => void;
}

export default function AttendeeTable({
  attendees,
  registrationMode,
  onStatusChange,
  loading,
  isEventDay = false,
  attendanceMarks = {},
  pendingAttendance = {},
  onAttendanceSelect,
  onAttendanceConfirm,
}: Props) {
  const isShortlistedMode = registrationMode === 'shortlisted';

  if (attendees.length === 0) {
    return (
      <div className="card rounded-2xl p-10 text-center">
        <div className="text-5xl">👥</div>
        <h3 className="mt-4 text-xl font-bold text-slate-900">No attendees yet</h3>
        <p className="mt-2 text-sm text-slate-600">Share your event link to start getting registrations.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm" id="attendees-table">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Registered</th>
            <th className="px-4 py-3">Attendance</th>
            <th className="px-4 py-3">{isShortlistedMode ? 'Review Actions' : 'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => (
            <tr key={attendee._id} id={`attendee-${attendee._id}`} className="border-t border-slate-100">
              <td className="px-4 py-3">
                <strong>{attendee.name}</strong>
              </td>
              <td className="max-w-52 truncate px-4 py-3 text-slate-600">{attendee.email}</td>
              <td className="px-4 py-3">
                <span className={`badge badge-${attendee.status}`}>{attendee.status}</span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                {new Date(attendee.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td className="px-4 py-3">
                {isEventDay && (attendee.status === 'registered' || attendee.status === 'approved') ? (
                  attendanceMarks[attendee._id] ? (
                    <span className={`badge ${attendanceMarks[attendee._id] === 'present' ? 'badge-approved' : 'badge-rejected'}`}>
                      {attendanceMarks[attendee._id]}
                    </span>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        className={`btn btn-sm ${pendingAttendance[attendee._id] === 'present' ? 'btn-success' : 'btn-secondary'}`}
                        onClick={() => onAttendanceSelect?.(attendee._id, 'present')}
                        id={`mark-present-${attendee._id}`}
                      >
                        Present
                      </button>
                      <button
                        className={`btn btn-sm ${pendingAttendance[attendee._id] === 'absent' ? 'btn-danger' : 'btn-secondary'}`}
                        onClick={() => onAttendanceSelect?.(attendee._id, 'absent')}
                        id={`mark-absent-${attendee._id}`}
                      >
                        Absent
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => onAttendanceConfirm?.(attendee._id)}
                        disabled={!pendingAttendance[attendee._id]}
                        id={`confirm-attendance-${attendee._id}`}
                        title="Confirm selection (cannot be changed later)"
                      >
                        ✓
                      </button>
                    </div>
                  )
                ) : (
                  <span className="text-xs text-slate-400">
                    {isEventDay ? 'Unavailable for current status' : 'Available on event day'}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
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
                      style={{ color: '#e11d48' }}
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
                    <span className="text-slate-400">—</span>
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
