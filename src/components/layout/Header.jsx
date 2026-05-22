'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import styles from '@/styles/Header.module.css';
import { Menu } from '@/components/Icons';

export default function Header({ onMenuClick }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: session, status } = useSession();
  console.log("🎒 Here is what is inside the backpack:", session);

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
  // Optional Best Practice: Don't render the header until NextAuth checks the backpack
  if (status === "loading") {
    return <header className={styles.header}>Loading...</header>;
  }
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
          <span className={styles.greeting}>Welcome back, {session?.user?.name || 'User'}</span>
          <Image
            src={session?.user?.image || "https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021"}
            alt="User Avatar"
            width={32}
            height={32}
            className={`${styles.avatar} ${open ? styles.avatarActive : ''}`}
            unoptimized
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
