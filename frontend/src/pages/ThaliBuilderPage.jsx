import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ThaliBuilder } from '../components/ThaliBuilder';

export const ThaliBuilderPage = ({ onBack }) => {
  return (
    <div style={{ padding: '32px 0 100px', background: 'var(--bg-primary)', minHeight: '90vh' }}>
      <div className="container">
        {/* Breadcrumb Back */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={onBack}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Explore</span>
          </button>
        </div>

        {/* Embedded Studio */}
        <ThaliBuilder />
      </div>
    </div>
  );
};
