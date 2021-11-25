import { ABOUT_ROUTE, USER_ROUTE } from "./utils/consts"
import AboutPage from "./pages/AboutPage"
import MainPage from "./pages/MainPage"
import UserPage from "./pages/UserPage"


export const authRoutes = [
  /*{
    path: ADMIN_ROUTE,
    Component: Admin
  },
  {
    path: BASKET_ROUTE,
    Component: Basket
  },*/
]

export const publicRoutes = [
  {
    path: ABOUT_ROUTE,
    element: <AboutPage/>
  },
  {
    path: USER_ROUTE,
    element: <UserPage/>
  },
  {
    path: '/',
    element : <MainPage/>
  },
]
