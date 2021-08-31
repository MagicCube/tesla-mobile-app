import cn from 'classnames';
import { useEffect, useRef } from 'react';

import { ScenePlay } from '@/scene-play';

import styles from './index.module.less';

export interface ScenePlayWrapperProps {
  className?: string;
}

export function ScenePlayWrapper({ className }: ScenePlayWrapperProps) {
  const scenePlayRef = useRef<ScenePlay | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const scenePlay = new ScenePlay(canvasRef.current, {
        size: { width: window.innerWidth, height: window.innerHeight },
        model: {
          url: 'models/tesla-model-3/scene.gltf',
          onLoad(group) {
            const model = group.getObjectByName('Tesla_Model_3');
            if (model) {
              model.scale.set(1, 1, 1);
            }
            return model;
          },
        },
      });
      scenePlay.init();
      scenePlay.play();
      scenePlayRef.current = scenePlay;
    }
  }, []);
  return <canvas ref={canvasRef} className={cn(styles.container, className)} />;
}
