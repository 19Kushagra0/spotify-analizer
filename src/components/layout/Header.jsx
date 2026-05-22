'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import styles from '@/styles/Header.module.css';
import { Menu } from '@/components/Icons';

export default function Header({ onMenuClick }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      {/* Hamburger — only visible on mobile */}
      <button className={styles.hamburger} onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} color="#fff" />
      </button>

      {/* User profile + dropdown */}
      <div className={styles.profileWrapper} ref={dropdownRef}>
        <div
          className={styles.userProfile}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="User menu"
          aria-expanded={open}
        >
          <span className={styles.greeting}>Welcome back, Alex</span>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7_NnJLRVaQhtQhju47l0ZIXr_chVUV9oKQR7oa2McpRkddfsrirhHxs9znugVuOyet7SFkbSl2KgBmw6dp_BoMvnPmJbAeZlcUbuILH3AglRNYW63zFEzUx6RaVVaYGar2zL-3dR1-1fJdF8TM5oFcrqd1lnXm0cEgaddBe-pPtetwM7i4xQ1Hf8GXDRQXC3QYTSQKL_Tsbeso-TJseU02xptyb9NstWrDKliEhayTld2s56SdD2Omj3jIItRDBC4B7c8Ny0q4SUz"
            alt="User Avatar"
            className={`${styles.avatar} ${open ? styles.avatarActive : ''}`}
          />
        </div>

        {/* Dropdown */}
        {open && (
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownItem}
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <svg
                className={styles.dropdownIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
