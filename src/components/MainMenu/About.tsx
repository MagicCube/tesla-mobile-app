import styles from './index.module.less';

export const About = () => {
  return (
    <div className={styles.about}>
      <h3>About this App</h3>
      <div>
        <p>
          This application is powered by{' '}
          <a href="https://threejs.org/" target="_blank" rel="noreferrer">
            Three.js
          </a>{' '}
          and{' '}
          <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
            React
          </a>
          .{' '}
        </p>
        <p>
          You can find the source code on{' '}
          <a
            href="https://github.com/magiccube/tesla-mobile-app"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
          .
        </p>
        <p>
          &copy; 2021{' '}
          <a
            href="https://github.com/magiccube"
            target="_blank"
            rel="noreferrer"
          >
            Henry Li
          </a>
          .
        </p>
        <p>“TESLA” and “MODEL 3” is a trademark of TESLA, Inc.</p>
        <p>
          The 3D model is created by
          <a
            href="https://sketchfab.com/uchiha.321abc"
            target="_blank"
            rel="noreferrer"
          >
            Ameer Studio
          </a>{' '}
          under{' '}
          <a
            href="http://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noreferrer"
          >
            CC-BY-4.0
          </a>{' '}
          license.
        </p>
      </div>
    </div>
  );
};
