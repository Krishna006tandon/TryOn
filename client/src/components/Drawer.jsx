import React, { useEffect } from 'react';

const Drawer = ({ open = false, onClose = () => {}, children }) => {
  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // add class so we can shift content instead of fully overlaying on wider screens
      document.body.classList.add('drawer-open');
      return () => {
        document.body.style.overflow = prevOverflow || '';
        document.body.classList.remove('drawer-open');
      };
    }
    // ensure class removed when closed
    document.body.classList.remove('drawer-open');
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
