import cn from 'classnames';
import { useCallback, useEffect, useRef } from 'react';

import { TeslaScenePlay } from '@/scene-play';

import styles from './index.module.less';

export interface ScenePlayWrapperProps {
  className?: string;
  opacity?: number;
  onLoad?: () => void;
  onProgress?: (e: ProgressEvent) => void;
}

export function ScenePlayWrapper({
  className,
  opacity,
  onLoad,
  onProgress,
}: ScenePlayWrapperProps) {
  const scenePlayRef = useRef<TeslaScenePlay | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleResize = useCallback(() => {
    if (scenePlayRef.current) {
      scenePlayRef.current.resizeTo(getWindowSize());
    }
  }, []);
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'd' && e.metaKey && !e.ctrlKey && !e.shiftKey) {
      scenePlayRef.current?.debug();
      e.preventDefault();
    }
  }, []);
  useEffect(() => {
    window.addEventListener('resize', handleResize, true);
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('resize', handleResize, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [handleResize, handleKeyDown]);
  useEffect(() => {
    if (canvasRef.current) {
      const scenePlay = new TeslaScenePlay(canvasRef.current, {
        size: getWindowSize(),
      });
      scenePlay.addEventListener('load', () => {
        if (typeof onLoad === 'function') {
          onLoad();
        }
      });
      scenePlay.addEventListener('progress', (e) => {
        if (typeof onProgress === 'function') {
          onProgress(e as ProgressEvent);
        }
      });
      scenePlay.init();
      scenePlay.play();

      scenePlayRef.current = scenePlay;
    }
  }, [onLoad, onProgress]);
  return (
    <canvas
      ref={canvasRef}
      className={cn(styles.container, className)}
      style={{
        opacity,
        filter: opacity ? `blur(${1 - opacity}rem)` : 'none',
      }}
    />
  );
}

function getWindowSize() {
  return { width: window.innerWidth, height: window.innerHeight };
}
