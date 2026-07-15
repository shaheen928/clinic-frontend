import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
 
const DoctorProtectedRoute = ({children}) => {
  const{doctorToken, isDoctorAuthenticated} = useSelector((state) => state.auth)
   if(!doctorToken || !isDoctorAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}
export default DoctorProtectedRoute;