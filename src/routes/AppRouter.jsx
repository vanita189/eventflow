// import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";
// import { publicRoutes, privateRoutes } from "./routes.config";
// import PublicRoute from "./PublicRoute";
// import Onboarding from "../pages/Onboarding";

// const AppRouter = () => {
//     return (
//         <Routes>
//             {publicRoutes.map(({ path, element }) => (
//                 <Route key={path} path={path} element={
//                     <PublicRoute>
//                         {element}
//                     </PublicRoute>
//                 } />
//             ))}

//             <Route
//                 path="/onboarding"
//                 element={
//                     <ProtectedRoute requireCompany={false}>
//                         <Onboarding />
//                     </ProtectedRoute>
//                 }
//             />

//             {privateRoutes.map(({ path, element,children }) => (
//                 <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} >
//                     {children?.map((child,index) => (
//                         <Route key={index} path={child.path} index={child.index} element={child.element}/>
//                     ))}
//                 </Route>
//             ))}
//         </Routes>
//     )
// }

// export default AppRouter;

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { publicRoutes, privateRoutes } from "./routes.config";
import Onboarding from "../pages/Onboarding";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<PublicRoute>{element}</PublicRoute>}
        />
      ))}

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Private routes (Dashboard + children) */}
      {privateRoutes.map(({ path, element, children }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute>{element}</ProtectedRoute>}
        >
          {children?.map((child, index) => (
            <Route
              key={index}
              path={child.path}
              index={child.index}
              element={child.element}
            />
          ))}
        </Route>
      ))}
    </Routes>
  );
};

export default AppRouter;
