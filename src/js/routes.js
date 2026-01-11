
import HomePage from '../pages/home.jsx';
import Agb from '../pages/agb.jsx';
import HomePage from '../pages/home.jsx';
import Impressum from '../pages/impressum.jsx';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/impressum',
    component: Impressum,
  },
  {
    path: '/agb',
    component: Agb,
  },
];

export default routes;
