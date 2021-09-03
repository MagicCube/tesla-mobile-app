import cn from 'classnames';
import { ReactNode, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import styles from './index.module.less';

export interface HeaderProps {
  className?: string;
  title?: ReactNode;
  showBackButton?: boolean;
}

export const Header = ({ className, title, showBackButton }: HeaderProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const h = useHistory() as any;
  const handleClick = useCallback(() => {
    if (showBackButton) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      h.goBack();
    }
  }, [h, showBackButton]);
  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.wrapper} onClick={handleClick}>
        {showBackButton ? (
          <div className={styles.backButton}>
            <i className={cn(styles.icon, 'iconfont', `icon-backarrow`)} />
          </div>
        ) : null}
        <h2 className={styles.title}>{title}</h2>
      </div>
    </div>
  );
};
