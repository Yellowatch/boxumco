import React, { ReactNode } from 'react';

export default function WhiteCard({ children }: { children: ReactNode }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}