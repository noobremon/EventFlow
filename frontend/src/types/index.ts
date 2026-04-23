export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Event {
  _id: string;
  organizer: string;
  title: string;
  slug: string;
  description: string;
  dateTime: string;
  venue: string;
  isOnline: boolean;
  onlineLink: string;
  capacity: number;
  registrationMode: 'open' | 'shortlisted';
  status: 'draft' | 'published' | 'cancelled';
  registeredCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RSVP {
  _id: string;
  event: string | Event;
  name: string;
  email: string;
  status: 'pending' | 'registered' | 'approved' | 'rejected' | 'revoked';
  createdAt: string;
  updatedAt: string;
}

export interface PublicEventData {
  event: Event;
  registrationStatus: 'open' | 'full' | 'closed' | 'cancelled';
}

export interface EventFormData {
  title: string;
  description: string;
  dateTime: string;
  venue: string;
  isOnline: boolean;
  onlineLink: string;
  capacity: number;
  registrationMode: 'open' | 'shortlisted';
}

export interface EventTemplate {
  name: string;
  icon: string;
  description: string;
  data: Partial<EventFormData>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
