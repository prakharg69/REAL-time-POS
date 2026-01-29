import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ShopSetupRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return null; 

 
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (user.activeShopId) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ShopSetupRoute;
