import AppRoutes from "./routes/AppRoutes";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from './redux/auth/authThunk';
export default function App() {
  const dispatch = useDispatch();
  const { token, authChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !authChecked) {
      dispatch(fetchProfile());
    }
  }, [token, authChecked, dispatch]);
  return <AppRoutes />;
}