import { ABOUT_ROUTE } from "./utils/consts"
import AboutPage from "./pages/AboutPage"
import MainPage from "./pages/MainPage"

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
    path: '/',
    element : <MainPage/>
  },
]
