import cn from 'classnames';

import { About } from './About';

import styles from './index.module.less';

const menuItems = [
  { title: 'Controls', desc: '控制车门，车窗及前后背箱等', icon: 'window' },
  { title: 'Climate', desc: '调节车内温度，控制座椅加热等', icon: 'fan' },
  { title: 'Appearance', desc: '多角度检视车身的外观', icon: 'vehicle' },
  {
    title: 'Interior',
    desc: '进入车舱内部，查看内饰',
    icon: 'driving-wheel',
  },
];

export interface MainMenuProps {
  className?: string;
}

export const MainMenu = ({ className }: MainMenuProps) => {
  return (
    <div className={cn(styles.container, className)}>
      <ul className={styles.list}>
        {menuItems.map((item) => (
          <li key={item.icon}>
            <i className={cn(styles.icon, 'iconfont', `icon-${item.icon}`)} />
            <div className={styles.info}>
              <h3 className={styles.title}>{item.title}</h3>
              <div className={styles.desc}>{item.desc}</div>
            </div>
          </li>
        ))}
      </ul>
      <About />
    </div>
  );
};
