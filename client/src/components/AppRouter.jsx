import {React} from 'react'
import {Routes, Route} from 'react-router-dom'
import NoMatchPage from '../pages/NoMatchPage';
import {authRoutes, publicRoutes} from '../routes'
// import {authRoutes, publicRoutes} from '../routes'
// import { SHOP_ROUTE } from '../utils/consts';
// import { Context } from '../index';

function AppRouter() {

  return (
    <Routes >
      {authRoutes.map(({path, element}) =>
          <Route key={path} path={path} element={element}/>
        )
      }
      {publicRoutes.map(({path, element}) =>
          <Route key={path} path={path} element={element}/>
        )
      }
      <Route path="*" element={<NoMatchPage />} />
    </Routes>
  );
}

export default AppRouter;
