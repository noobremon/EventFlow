'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { EventFormData } from '@/types';
import TemplateSelector from '@/components/TemplateSelector';
import EventForm from '@/components/EventForm';

export default function NewEventPage() {
  const router = useRouter();
  const [templateData, setTemplateData] = useState<Partial<EventFormData> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: EventFormData) => {
    setLoading(true);
    try {
      await api.post('/events', data);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Event</h1>
          <p className="page-subtitle">Set up a new event using a template or from scratch</p>
        </div>
      </div>

      {templateData === null ? (
        <TemplateSelector onSelect={setTemplateData} />
      ) : (
        <div className="card" style={{ maxWidth: 700 }}>
          <button
            className="btn btn-ghost"
            onClick={() => setTemplateData(null)}
            style={{ marginBottom: 16 }}
          >
            ← Back to templates
          </button>
          <EventForm
            initialData={templateData}
            onSubmit={handleCreate}
            loading={loading}
            submitLabel="Create Event"
          />
        </div>
      )}
    </div>
  );
}
