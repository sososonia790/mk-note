import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          競馬情報検索
        </Link>
        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          >
            開催一覧
          </Link>
          <Link
            to="/search"
            className={`${styles.navLink} ${isActive('/search') ? styles.active : ''}`}
          >
            馬検索
          </Link>
        </nav>
      </div>
    </header>
  );
};
