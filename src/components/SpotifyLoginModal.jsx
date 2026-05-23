'use client';

import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function SpotifyLoginModal({ isOpen, onClose, title = "Unlock Spotify DNA Premium" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .login-modal-card {
          background: rgba(24, 24, 24, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          width: 100%;
          max-width: 440px;
          padding: 32px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(30, 215, 96, 0.05);
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-align: center;
          position: relative;
        }
        .login-modal-logo {
          width: 56px;
          height: 56px;
          background: #1ed760;
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          box-shadow: 0 8px 24px rgba(30, 215, 96, 0.4);
        }
        .login-modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }
        .login-modal-subtitle {
          font-size: 13px;
          color: #b3b3b3;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }
        .login-modal-features {
          text-align: left;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .login-modal-feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: #e5e5e5;
          font-weight: 600;
        }
        .login-modal-check {
          color: #1ed760;
          font-weight: bold;
        }
        .login-modal-connect-btn {
          background: #1ed760;
          color: #000;
          border: none;
          width: 100%;
          padding: 12px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(30, 215, 96, 0.2);
        }
        .login-modal-connect-btn:hover {
          transform: scale(1.02);
          background: #1db954;
          box-shadow: 0 6px 20px rgba(30, 215, 96, 0.35);
        }
        .login-modal-cancel-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #b3b3b3;
          width: 100%;
          padding: 11px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          margin-top: 12px;
          transition: all 0.2s ease;
        }
        .login-modal-cancel-btn:hover {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255,255,255,0.03);
        }
      `}</style>
      
      <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-logo">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.077-.337.135-.668.47-.743 3.856-.88 7.15-.502 9.822 1.13.295.18.387.563.205.858zm1.225-2.72c-.228.368-.713.49-1.08.262-2.72-1.67-6.87-2.153-10.076-1.18-.413.125-.85-.107-.973-.52-.125-.413.107-.85.52-.972 3.667-1.11 8.23-.574 11.347 1.34.37.227.492.712.262 1.08zm.106-2.833C14.492 8.878 8.843 8.69 5.568 9.684c-.504.153-1.033-.133-1.186-.637-.153-.504.133-1.033.637-1.186 3.756-1.14 10.02-.924 14.07 1.48.455.27.604.856.334 1.312-.27.455-.857.605-1.313.334z"/>
          </svg>
        </div>

        <h2 className="login-modal-title">{title}</h2>
        <p className="login-modal-subtitle">
          Demo mode lets you explore the visuals, but you need a real Spotify connection to unlock these premium features.
        </p>

        <div className="login-modal-features">
          <div className="login-modal-feature-item">
            <span className="login-modal-check">✓</span> Save curated AI playlists directly to your account
          </div>
          <div className="login-modal-feature-item">
            <span className="login-modal-check">✓</span> Load real-time stats and personalized listening patterns
          </div>
          <div className="login-modal-feature-item">
            <span className="login-modal-check">✓</span> Stream full high-fidelity tracks directly in the browser
          </div>
          <div className="login-modal-feature-item">
            <span className="login-modal-check">✓</span> View your exact hourly peaks and weekly mood index
          </div>
        </div>

        <button 
          className="login-modal-connect-btn"
          onClick={() => {
            localStorage.removeItem('musicdna_demo_mode');
            signIn('spotify', { callbackUrl: '/home' });
          }}
        >
          Connect Spotify Account
        </button>

        <button className="login-modal-cancel-btn" onClick={onClose}>
          Keep Exploring Demo
        </button>
      </div>
    </div>
  );
}
