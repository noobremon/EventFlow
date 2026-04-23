'use client';

import { EventFormData } from '@/types';
import { eventTemplates } from '@/lib/templates';

interface Props {
  onSelect: (data: Partial<EventFormData>) => void;
}

export default function TemplateSelector({ onSelect }: Props) {
  return (
    <div className="card p-6 sm:p-8">
      <h3 className="text-xl font-bold text-slate-900">Start with a Template</h3>
      <p className="mt-1 text-sm text-slate-600">Choose a template to prefill your event, or start from scratch.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eventTemplates.map((template) => (
          <button
            key={template.name}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm"
            onClick={() => onSelect(template.data)}
            id={`template-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span className="mb-3 block text-2xl">{template.icon}</span>
            <strong className="block text-base text-slate-900">{template.name}</strong>
            <span className="mt-1 block text-sm text-slate-600">{template.description}</span>
          </button>
        ))}
        <button
          className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
          onClick={() => onSelect({})}
          id="template-blank"
        >
          <span className="mb-3 block text-2xl">📝</span>
          <strong className="block text-base text-slate-900">Blank Event</strong>
          <span className="mt-1 block text-sm text-slate-600">Start from scratch with empty fields</span>
        </button>
      </div>
    </div>
  );
}
