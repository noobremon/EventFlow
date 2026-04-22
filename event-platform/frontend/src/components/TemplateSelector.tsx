'use client';

import { EventTemplate, EventFormData } from '@/types';
import { eventTemplates } from '@/lib/templates';
import styles from './TemplateSelector.module.css';

interface Props {
  onSelect: (data: Partial<EventFormData>) => void;
}

export default function TemplateSelector({ onSelect }: Props) {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Start with a Template</h3>
      <p className={styles.subheading}>Choose a template to prefill your event, or start from scratch</p>
      <div className={styles.grid}>
        {eventTemplates.map((template) => (
          <button
            key={template.name}
            className={styles.templateCard}
            onClick={() => onSelect(template.data)}
            id={`template-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span className={styles.icon}>{template.icon}</span>
            <strong className={styles.name}>{template.name}</strong>
            <span className={styles.desc}>{template.description}</span>
          </button>
        ))}
        <button
          className={`${styles.templateCard} ${styles.blank}`}
          onClick={() => onSelect({})}
          id="template-blank"
        >
          <span className={styles.icon}>📝</span>
          <strong className={styles.name}>Blank Event</strong>
          <span className={styles.desc}>Start from scratch with empty fields</span>
        </button>
      </div>
    </div>
  );
}
