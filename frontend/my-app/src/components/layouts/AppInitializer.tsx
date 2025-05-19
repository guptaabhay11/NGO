import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMeQuery } from "../../services/api"; 
import { setUser, logout } from "../../store/reducers/authReducer";
import { RootState } from "../../store/store";

const AppInitializer = () => {
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const { data, isSuccess, isError } = useMeQuery(undefined, {
    skip: !accessToken || !!user,
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setUser(data.data)); // FIXED: correctly pass only user
    }

    if (isError) {
      dispatch(logout());
    }
  }, [isSuccess, isError, data, dispatch]);

  return null;
};

export default AppInitializer;
