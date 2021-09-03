import { ClimatePage } from './ClimatePage';
import { ControlsPage } from './ControlsPage';

export default [
  {
    path: 'controls',
    title: 'Controls',
    desc: '控制车门，车窗及前后背箱等',
    icon: 'window',
    scenePlay: {
      view: 'default',
    },
    component: ControlsPage,
  },
  {
    path: 'climate',
    title: 'Climate',
    desc: '调节车内温度，控制座椅加热等',
    icon: 'fan',
    scenePlay: {
      view: 'climate',
    },
    component: ClimatePage,
  },
  {
    path: 'appearance',
    title: 'Appearance',
    desc: '多角度检视车身的外观',
    icon: 'vehicle',
    scenePlay: {
      view: 'default',
    },
  },
  {
    path: 'interior',
    title: 'Interior',
    desc: '进入车舱内部，查看内饰',
    icon: 'driving-wheel',
    scenePlay: {
      view: 'default',
    },
  },
];
