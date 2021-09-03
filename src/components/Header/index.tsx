import cn from 'classnames';
import { ReactNode } from 'react';

import styles from './index.module.less';

export interface HeaderProps {
  className?: string;
  title?: ReactNode;
}

export const Header = ({ className, title }: HeaderProps) => {
  return (
    <div className={cn(styles.container, className)}>
      <h2>{title}</h2>
    </div>
  );
};
