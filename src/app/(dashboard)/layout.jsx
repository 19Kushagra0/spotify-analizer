import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import styles from '@/styles/DashboardLayout.module.css';

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.layoutWrapper}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        {/* The actual page content (Home, Analytics, etc.) loads here */}
        {children} 
      </div>
    </div>
  );
}
