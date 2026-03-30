import React from 'react';

export function Logo(): JSX.Element {
  return (
    <span className="logoWrap" aria-label="QueryTube">
      <span className="logoMark" aria-hidden="true">
        <span
          style={{
            position: 'relative',
            zIndex: 1,
            width: 10,
            height: 10,
            borderRadius: 99,
            background: '#fff',
            boxShadow: '0 0 0 4px rgba(255,255,255,0.10)',
          }}
        />
      </span>
      <span className="logoText">QueryTube</span>
    </span>
  );
}

