import React, { useEffect } from 'react';

const Drawer = ({ open = false, onClose = () => {}, children }) => {
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev || '';
      };
    }
    return undefined;
  }, [open]);

  if (!open) return null;

  return (
    <div>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer-panel">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} aria-label="Close drawer" className="drawer-close">✕</button>
        </div>
        <div style={{ padding: 12 }}>
          {children}
        </div>
      </aside>
    </div>
  );
};

export default Drawer;
