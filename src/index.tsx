import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { Root } from '@/components/Root';

import './index.less';

render(
  <Router>
    <Root />
  </Router>,
  document.getElementById('react-mount-point')
);
