import Link from 'next/link';
import { Home, BarChart2, Sparkles } from 'lucide-react'; // Added premium icons!
import styles from '@/styles/Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.padding}>
        <h1 className={styles.logo}>MusicDNA</h1>
        <nav className={styles.nav}>
          <Link href="/home" className={`${styles.navLink} ${styles.navLinkActive}`}>
            <Home size={18} /> Home
          </Link>
          <Link href="/analytics" className={styles.navLink}>
            <BarChart2 size={18} /> Analytics
          </Link>
          <Link href="/studio" className={styles.navLink}>
            <Sparkles size={18} /> AI Studio
          </Link>
        </nav>
      </div>
    </aside>
  );
}
