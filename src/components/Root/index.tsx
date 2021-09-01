import cn from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import { allowAnimation, openingAnimationDuration } from '@/config';

import { Header } from '../Header';
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
  const handleScenePlayProgress = useCallback((e: { loaded: number }) => {
    setLoading({
      percentage: e.loaded / 314079,
      status:
        e.loaded / 314079 === 1 ? '正在加载模型材质...' : '正在加载模型...',
    });
  }, []);
  useEffect(() => {
    document.body.style.overflowY = pageVisible ? 'auto' : 'hidden';
  }, [pageVisible]);
  useEffect(() => {
    document.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [handleScroll]);

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
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque dolore
          culpa perspiciatis quos dolor ab quod obcaecati minus exercitationem
          totam autem, illum nobis. Commodi dolorum cumque corporis minus
          impedit sit? Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          At laborum fugit blanditiis eos, voluptas voluptatem iusto adipisci
          quidem tenetur maiores molestias ut aperiam, praesentium sed deleniti
          eligendi alias dolor commodi? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Ipsam totam dolore labore nostrum tempore culpa,
          odit repellendus eum. Soluta provident minima veritatis nostrum earum
          quisquam maiores voluptatibus dignissimos eveniet sunt. Molestias sunt
          provident minus iste mollitia. Quae ea necessitatibus temporibus
          reiciendis earum eveniet dolore facilis molestias iusto quas
          voluptates veritatis ut tenetur explicabo, ipsam veniam rem vero
          praesentium a perferendis? Optio dolorem nesciunt sapiente cupiditate
          quibusdam suscipit perferendis nemo laboriosam minima earum eius
          nostrum modi vero accusamus, ipsa quo quae voluptatum dolores
          inventore corrupti enim atque vel autem eligendi? Eos! Eius vitae
          omnis accusamus earum ipsum fugiat totam architecto enim autem
          deleniti, odio voluptatum reiciendis tempora temporibus dolores! Enim
          voluptatem consequatur doloremque esse facilis, quos dolores? Aliquam
          iure laboriosam esse. Voluptas, vel soluta. Iste, neque omnis ipsa
          ducimus veniam fuga repellat placeat eveniet repellendus at porro
          modi, sapiente quibusdam aperiam maiores atque mollitia. Cupiditate
          necessitatibus accusantium iusto, repellendus dicta doloremque?
          Necessitatibus totam eius accusantium. Autem, iste, illo magnam optio
          corrupti officia hic in beatae facilis voluptatem deserunt
          voluptatibus aliquam accusantium ea ullam eum maxime, deleniti esse
          harum assumenda architecto quidem? Eius vel rem dicta aliquid laborum?
          At inventore quod molestias, natus laborum dolores facere. Molestias
          cupiditate ad adipisci aperiam molestiae qui autem id placeat.
          Excepturi id vero molestias odit soluta. Laboriosam, omnis modi
          maiores saepe doloremque veniam incidunt voluptas delectus doloribus
          et in dolore alias sed quaerat reprehenderit quia quidem dolor,
          laudantium iste dicta, inventore perferendis magnam quisquam?
          Voluptatum, nostrum? Perferendis voluptates officiis, sit,
          perspiciatis adipisci omnis accusamus excepturi nam et aperiam, quia
          nihil architecto commodi. Ratione, commodi vel! Similique perferendis
          inventore, ratione eaque quis beatae dolores accusantium hic natus.
          Maxime labore facere sunt provident, veniam dicta officia mollitia
          perferendis tenetur deleniti, vel quaerat ab. Quis vero porro nihil
          vel. Aperiam, fugiat consequatur. Repellendus, distinctio totam
          explicabo excepturi voluptatum aut.
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
