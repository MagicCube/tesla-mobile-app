/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import cn from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import { allowAnimation, openingAnimationDuration } from '@/config';

import { Header } from '../Header';
import { MainMenu } from '../MainMenu';
import ScenePlay from '../ScenePlayWrapper';

import pages from '@/pages';
import { TeslaScenePlay, ViewName } from '@/scene-play';

import styles from './index.module.less';

export function Root() {
  const scenePlayRef = useRef<TeslaScenePlay>(null);
  const [loading, setLoading] = useState({
    percentage: 0,
    status: '正在加载 3D 模型...',
  });
  const [scenePlayOpacity, setScenePlayOpacity] = useState(1);
  const [pageVisible, setPageVisible] = useState(!allowAnimation);
  const loc = useLocation();
  const switchToPage = useCallback((pathname: string) => {
    let namedView: ViewName = 'home';
    if (!scenePlayRef.current) return;
    const part = pathname.split('/')[2];
    const page = pages.find((p) => p.path === part);
    if (page) {
      namedView = page.scenePlay.view as ViewName;
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    scenePlayRef.current.switchView(namedView);
  }, []);
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

    if (window.location.pathname === import.meta.env.BASE_URL) {
      scenePlayRef.current?.playOpeningAnimation();
      setTimeout(() => {
        setPageVisible(true);
        if (scenePlayRef.current?.orbitControls) {
          scenePlayRef.current.orbitControls.autoRotate = true;
        }
      }, openingAnimationDuration - 1600);
    } else {
      setPageVisible(true);
      switchToPage(window.location.pathname);
    }
  }, [switchToPage]);
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

  useEffect(() => {
    switchToPage(loc.pathname);
  }, [loc.pathname, switchToPage]);

  const isLoading = loading.percentage < 100;

  return (
    <>
      <ScenePlay
        ref={scenePlayRef}
        className={styles.scenePlay}
        opacity={scenePlayOpacity}
        onLoad={handleScenePlayLoad}
        onProgress={handleScenePlayProgress}
      />
      <Switch>
        {pages.map((page) => (
          <Route
            key={page.path}
            path={`${import.meta.env.BASE_URL}${page.path}`}
          >
            <div className={cn(styles.fixed)}>
              <Header title={page.title} showBackButton />
            </div>
          </Route>
        ))}

        <Route
          exact
          path={[
            import.meta.env.BASE_URL,
            import.meta.env.BASE_URL.replace(/\/$/, ''),
          ]}
        >
          <div
            className={cn(
              styles.fixed,
              pageVisible ? undefined : styles.hidden
            )}
          >
            <Header title="Digital Twin" />
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
        </Route>
      </Switch>
      <div
        className={cn(styles.overlay, isLoading ? undefined : styles.hidden)}
      >
        {loading.status}
      </div>
    </>
  );
}
