import cn from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import { allowAnimation, openingAnimationDuration } from '@/config';

import { Header } from '../Header';
import { MainMenu } from '../MainMenu';
import { ScenePlayWrapper as ScenePlay } from '../ScenePlayWrapper';

import styles from './index.module.less';

export function Root() {
  const [loading, setLoading] = useState({
    percentage: 0,
    status: '正在加载 3D 模型...',
  });
  const [scenePlayOpacity, setScenePlayOpacity] = useState(1);
  const [pageVisible, setPageVisible] = useState(!allowAnimation);
  const handleScroll = useCallback(() => {
    if (document.scrollingElement) {
      const scrollable = document.scrollingElement;
      let percentage = 1 - scrollable.scrollTop / window.innerHeight / 0.33;
      if (percentage > 1) {
        percentage = 1;
      }
      if (percentage < 0.1) {
        percentage = 0.1;
      }
      setScenePlayOpacity(percentage);
    }
  }, []);
  const handleScenePlayLoad = useCallback(() => {
    setLoading({
      percentage: 100,
      status: '加载已完成',
    });
    setTimeout(() => {
      setPageVisible(true);
    }, openingAnimationDuration - 1600);
  }, []);
  const handleScenePlayProgress = useCallback(
    (e: { url: string; loaded: number; total: number }) => {
      const percentage = e.loaded / e.total;
      setLoading({
        percentage,
        status: `正在加载模型 ${Math.round(percentage * 100)}%...`,
      });
    },
    []
  );

  useEffect(() => {
    document.body.style.overflowY = pageVisible ? 'auto' : 'hidden';
  }, [pageVisible]);

  useEffect(() => {
    document.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (document.scrollingElement) {
      document.scrollingElement.scrollTo(0, 0);
    }
  }, []);

  const isLoading = loading.percentage < 100;
  return (
    <>
      <ScenePlay
        className={styles.scenePlay}
        opacity={scenePlayOpacity}
        onLoad={handleScenePlayLoad}
        onProgress={handleScenePlayProgress}
      />
      <div
        className={cn(styles.fixed, pageVisible ? undefined : styles.hidden)}
      >
        <Header />
      </div>
      <div
        className={cn(
          styles.scrollable,
          pageVisible ? undefined : styles.hidden
        )}
      >
        <main className={styles.content}>
          <MainMenu />
        </main>
      </div>
      <div
        className={cn(styles.overlay, isLoading ? undefined : styles.hidden)}
      >
        {loading.status}
      </div>
    </>
  );
}
