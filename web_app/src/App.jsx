import { Route, Routes } from "react-router-dom";
import { useState } from 'react';

import {pageRoutes} from "./constants/pageRoutes";

import Dashboard from "./pages/dashboard";
import Signup from "./pages/auth/signup";
import Admin from "./pages/admin";
import Login from "./pages/auth/login";
import Home from "./pages/home";
import PageLayout from "./components/containers/PageLayout";
import Recommendation from "./pages/recommendation";
import Analytics from "./pages/analytics";
import Settings from "./pages/settings";

const App = () => {
    // -------TEST ADMIN STORE ADDRESS STATE---------
    const [addressList, setAddressList] = useState([]);
    const [isAdminMode, setIsAdminMode] = useState(false); // Admin Mode state

    const routes = [
        { path: pageRoutes.HOME, element: <Home /> },
        { path: pageRoutes.DASHBOARD, element: <Dashboard /> },
        { path: pageRoutes.ADMIN, element: <Admin /> },
        { path: pageRoutes.RECOMMENDATIONS, element: <Recommendation /> },
        { path: pageRoutes.ANALYTICS, element: <Analytics  addressList={addressList} isAdminMode={isAdminMode}/> },
        { path: pageRoutes.SETTINGS, element: <Settings /> },
    ];

    const authRoutes = [
        { path: pageRoutes.LOGIN, element: <Login /> },
        { path: pageRoutes.SIGNUP, element: <Signup /> }
    ];

    return (
      <Routes>
          {authRoutes.map(({ path, element }) => (
            <Route path={path} element={element} key={`${path}-${element.name}`} />
          ))}

          <Route element={<PageLayout />}>
              {routes.map(({ path, element }) => (
                <Route path={path} element={element} key={`${path}-${element.name}`} />
              ))}
          </Route>
      </Routes>

    );
};

export default App;