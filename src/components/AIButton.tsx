import React from 'react';

interface AIButtonProps {
  onClick: () => void;
  label: string;
}

export default function AIButton({ onClick, label }: AIButtonProps) {
  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="unopaq" y="-100%" height="300%" x="-100%" width="300%">
            <feColorMatrix
              values="1 0 0 0 0 
                    0 1 0 0 0 
                    0 0 1 0 0 
                    0 0 0 9 0"
            />
          </filter>
          <filter id="unopaq2" y="-100%" height="300%" x="-100%" width="300%">
            <feColorMatrix
              values="1 0 0 0 0 
                    0 1 0 0 0 
                    0 0 1 0 0 
                    0 0 0 3 0"
            />
          </filter>
          <filter id="unopaq3" y="-100%" height="300%" x="-100%" width="300%">
            <feColorMatrix
              values="1 0 0 0.2 0 
                    0 1 0 0.2 0 
                    0 0 1 0.2 0 
                    0 0 0 2 0"
            />
          </filter>
        </defs>
      </svg>

      <div className="relative flex items-center justify-center">
        <button className="real-button-uiverse" onClick={onClick}></button>
        <div className="button-container-uiverse">
          <div className="spin spin-blur"></div>
          <div className="spin spin-intense"></div>
          <div className="button-border-uiverse">
            <div className="spin spin-inside"></div>
            <div className="button-content-uiverse px-6 py-2">
              <span className="text-[11px] font-bold uppercase tracking-widest leading-none text-center">
                {label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
