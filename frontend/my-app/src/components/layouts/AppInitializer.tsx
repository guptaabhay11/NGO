import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMeQuery } from "../../services/api"; 
import { setUser, logout } from "../../store/reducers/authReducer";
import { RootState } from "../../store/store";

 const AppInitializer = () => {
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const { data, isSuccess, isError } = useMeQuery(undefined, {
    skip: !accessToken || !!user, // skip if no token or user already present
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
    }

    if (isError) {
      dispatch(logout()); // Token might be invalid/expired
    }
  }, [isSuccess, isError, data, dispatch]);

  return null; // doesn't render anything
};

export default AppInitializer;