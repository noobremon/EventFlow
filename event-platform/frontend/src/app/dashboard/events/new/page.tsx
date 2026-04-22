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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Create Event</h1>
          <p className="page-subtitle">Set up a new event using a template or from scratch</p>
        </div>
      </div>

      {templateData === null ? (
        <TemplateSelector onSelect={setTemplateData} />
      ) : (
        <div className="space-y-4">
          <button
            className="btn btn-ghost"
            onClick={() => setTemplateData(null)}
          >
            ← Back to templates
          </button>
          <div className="mx-auto max-w-4xl">
            <EventForm
              initialData={templateData}
              onSubmit={handleCreate}
              loading={loading}
              submitLabel="Create Event"
            />
          </div>
        </div>
      )}
    </div>
  );
}
