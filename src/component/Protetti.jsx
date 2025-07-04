import { Navigate, Outlet } from "react-router-dom";

const Protetti = ({ isAuthenticated, redirectPath = "/login" }) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default Protetti;
