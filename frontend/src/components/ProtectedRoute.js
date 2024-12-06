import { Navigate } from "react-router-dom";
import { useStateContext } from "../context/UserContext";

const ProtectedRoute = ({ roleRequired, children }) => {
    const {user} = useStateContext();
  const userRole =  user?.role
  if (roleRequired && String(userRole) !== String(roleRequired)) {
    return <Navigate to="/not-found" />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute roleRequired="1">
      {children}
    </ProtectedRoute>
  );
};

export default AdminRoute;


