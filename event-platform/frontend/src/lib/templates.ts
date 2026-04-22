import { EventTemplate } from '@/types';

export const eventTemplates: EventTemplate[] = [
  {
    name: 'Tech Meetup',
    icon: '💻',
    description: 'A casual tech gathering for developers and enthusiasts',
    data: {
      title: 'Tech Meetup',
      description:
        'Join us for an evening of tech talks, networking, and community building. Whether you\'re a seasoned developer or just getting started, there\'s something for everyone.\n\nAgenda:\n• 6:00 PM — Doors open & networking\n• 6:30 PM — Lightning talks\n• 7:30 PM — Main presentation\n• 8:30 PM — Q&A and wrap-up',
      isOnline: false,
      venue: '',
      capacity: 50,
      registrationMode: 'open',
    },
  },
  {
    name: 'Webinar',
    icon: '🎥',
    description: 'An online presentation or lecture session',
    data: {
      title: 'Live Webinar',
      description:
        'Join our upcoming webinar where industry experts share insights and practical knowledge.\n\nWhat you\'ll learn:\n• Key trends and best practices\n• Hands-on examples and demos\n• Interactive Q&A session\n\nA recording will be shared with all registered attendees after the event.',
      isOnline: true,
      onlineLink: '',
      capacity: 200,
      registrationMode: 'open',
    },
  },
  {
    name: 'Workshop',
    icon: '🛠️',
    description: 'A hands-on, interactive learning session with limited seats',
    data: {
      title: 'Hands-On Workshop',
      description:
        'An intensive, hands-on workshop designed for practical learning.\n\nPrerequisites:\n• Laptop with required software installed\n• Basic understanding of the topic\n\nWhat\'s included:\n• Workshop materials and resources\n• Certificate of completion\n• Follow-up support resources\n\nSeats are limited to ensure personalized attention for every participant.',
      isOnline: false,
      venue: '',
      capacity: 25,
      registrationMode: 'shortlisted',
    },
  },
];
