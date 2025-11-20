import React from 'react';
import { Menu, User, Users, Clock } from 'lucide-react';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.navItem}>
        <Menu size={24} />
      </div>
      
      <div className={`${styles.navItem} ${styles.navItemActive}`} title="Corrección">
        <User size={24} />
      </div>
      
      <div className={styles.navItem} title="Alumnos">
        <Users size={24} />
      </div>
      
      <div className={styles.navItem} title="Historial">
        <Clock size={24} />
      </div>
    </nav>
  );
};
