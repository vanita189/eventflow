import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { publicRoutes, privateRoutes } from "./routes.config";
import PublicRoute from "./PublicRoute";

const AppRouter = () => {
    return (
        <Routes>
            {publicRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={
                    <PublicRoute>
                        {element}
                    </PublicRoute>
                } />
            ))}

            {privateRoutes.map(({ path, element,children }) => (
                <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} >
                    {children?.map((child,index) => (
                        <Route key={index} path={child.path} index={child.index} element={child.element}/>
                    ))}
                </Route>
            ))}
        </Routes>
    )
}

export default AppRouter;