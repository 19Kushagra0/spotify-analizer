'use client';

import styles from '@/styles/Header.module.css';
import { Menu } from 'lucide-react';

export default function Header({ onMenuClick }) {
  return (
    <header className={styles.header}>
      {/* Hamburger — only visible on mobile */}
      <button className={styles.hamburger} onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} color="#fff" />
      </button>

      <div className={styles.userProfile}>
        <span className={styles.greeting}>Welcome back, Alex</span>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7_NnJLRVaQhtQhju47l0ZIXr_chVUV9oKQR7oa2McpRkddfsrirhHxs9znugVuOyet7SFkbSl2KgBmw6dp_BoMvnPmJbAeZlcUbuILH3AglRNYW63zFEzUx6RaVVaYGar2zL-3dR1-1fJdF8TM5oFcrqd1lnXm0cEgaddBe-pPtetwM7i4xQ1Hf8GXDRQXC3QYTSQKL_Tsbeso-TJseU02xptyb9NstWrDKliEhayTld2s56SdD2Omj3jIItRDBC4B7c8Ny0q4SUz" 
          alt="User Avatar" 
          className={styles.avatar}
        />
      </div>
    </header>
  );
}
