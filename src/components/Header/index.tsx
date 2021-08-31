import cn from 'classnames';

import styles from './index.module.less';

export interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  return <div className={cn(styles.container, className)}>
    <h1>Digital Twin</h1>
  </div>;
};
