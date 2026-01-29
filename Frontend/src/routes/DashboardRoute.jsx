import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return null;

 
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (!user.activeShopId) {
    return <Navigate to="/shopdetail" replace />;
  }

 
  return children;
};

export default DashboardRoute;
