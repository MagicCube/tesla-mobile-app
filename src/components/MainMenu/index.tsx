import cn from 'classnames';
import { Link } from 'react-router-dom';

import pages from '@/pages';

import { About } from './About';

import styles from './index.module.less';

export interface MainMenuProps {
  className?: string;
}

export const MainMenu = ({ className }: MainMenuProps) => {
  return (
    <div className={cn(styles.container, className)}>
      <ul className={styles.list}>
        {pages.map((page) => (
          <li key={page.path}>
            <Link
              className={styles.link}
              to={`${import.meta.env.BASE_URL}${page.path}`}
            >
              <i className={cn(styles.icon, 'iconfont', `icon-${page.icon}`)} />
              <div className={styles.info}>
                <h3 className={styles.title}>{page.title}</h3>
                <div className={styles.desc}>{page.desc}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <About />
    </div>
  );
};
