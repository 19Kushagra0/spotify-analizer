'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Sparkles, X } from '@/components/Icons';
import styles from '@/styles/Sidebar.module.css';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.padding}>
        {/* Close button — only shows on mobile */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
          <X size={20} color="#b3b3b3" />
        </button>

        <Link href="/home" style={{ textDecoration: 'none' }}>
          <h1 className={styles.logo}>MusicDNA</h1>
        </Link>
        <nav className={styles.nav}>
          <Link 
            href="/home" 
            className={`${styles.navLink} ${pathname === '/home' ? styles.navLinkActive : ''}`}
            onClick={onClose}
          >
            <Home size={18} /> Home
          </Link>
          <Link 
            href="/analytics" 
            className={`${styles.navLink} ${pathname === '/analytics' ? styles.navLinkActive : ''}`}
            onClick={onClose}
          >
            <BarChart2 size={18} /> Analytics
          </Link>
          <Link 
            href="/studio" 
            className={`${styles.navLink} ${pathname === '/studio' ? styles.navLinkActive : ''}`}
            onClick={onClose}
          >
            <Sparkles size={18} /> AI Studio
          </Link>
        </nav>
      </div>
    </aside>
  );
}

