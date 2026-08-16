import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { HygienePromise } from '../components/HygienePromise';

export const HygienePage = ({ onBack }) => {
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

        {/* Embedded Hygiene Promise */}
        <HygienePromise />
      </div>
    </div>
  );
};
