import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { pageRoutes } from "./constants/pageRoutes";
import Cookies from "js-cookie";
import Dashboard from "./pages/dashboard/dashboard";
import Signup from "./pages/auth/signup/signup";
import Login from "./pages/auth/login/login";
import Home from "./pages/home";
import Recommendation from "./pages/recommendation";
import Analytics from "./pages/analytics";
import Settings from "./pages/settings";
import Admin from "./pages/admin";

import PageLayout from "./components/containers/PageLayout";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = Cookies.get('jwt');
        setIsAuthenticated(!!token);
    }, []);

    const PrivateRoute = ({ children }) => {
        return isAuthenticated ? children : <Navigate to={pageRoutes.LOGIN} />;
    };

    const routes = [
        { path: pageRoutes.HOME, element: <Home /> },
        { path: pageRoutes.DASHBOARD, element: <Dashboard /> },
        { path: pageRoutes.ADMIN, element: <Admin /> },
        { path: pageRoutes.RECOMMENDATIONS, element: <Recommendation /> },
        { path: pageRoutes.ANALYTICS, element: <Analytics /> },
        { path: pageRoutes.SETTINGS, element: <Settings /> },
    ];

    const authRoutes = [
        { path: pageRoutes.LOGIN, element: <Login /> },
        { path: pageRoutes.SIGNUP, element: <Signup /> }
    ];

    return (
        // <PageLayout>
        //     <Routes>
        //       {routes.map(({ path, element }) => (
        //         <Route path={path} element={element} key={`${path}-${element.name}`}/>
        //       ))}
        //     </Routes>
        // </PageLayout>


        <Routes>
            {authRoutes.map(({ path, element }) => (
                <Route path={path} element={element} key={`${path}-${element.name}`} />
            ))}

            <Route element={<PageLayout />}>
                {routes.map(({ path, element }) => (
                    <Route
                        path={path}
                        element={<PrivateRoute>{element}</PrivateRoute>}
                        key={`${path}-${element.name}`}
                    />
                ))}
            </Route>
        </Routes>
    );
};

export default App;
