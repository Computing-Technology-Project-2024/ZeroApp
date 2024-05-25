import { Route, Routes } from "react-router-dom";

import {pageRoutes} from "./constants/pageRoutes";

import Dashboard from "./pages/dashboard/dashboard";
import Signup from "./pages/auth/signup/signup";
import Admin from "./pages/admin/admin";
import Login from "./pages/auth/login/login";
import Home from "./pages/home/home";

const App = () => {
    const routes = [
        { path: pageRoutes.HOME, element: <Home /> },
        { path: pageRoutes.DASHBOARD, element: <Dashboard /> },
        { path: pageRoutes.ADMIN, element: <Admin /> },
        { path: pageRoutes.LOGIN, element: <Login /> },
        { path: pageRoutes.SIGNUP, element: <Signup /> },

    ];

    return (
        <Routes>
            {routes.map(({ path, element }) => (
                <Route path={path} element={element} key={`${path}-${element.name}`}/>
            ))}
        </Routes>
    );
};

export default App;