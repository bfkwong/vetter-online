import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { getUserInfoRdx } from "../../redux/context/contextSelectors";

export default function HomeRedirector(props) {
  const userInfo = useSelector(getUserInfoRdx);

  return (
    <>
      {userInfo?.userType === "admin" && <Navigate to="/admin" />}
      {userInfo?.userType === "patient" && <Navigate to="/patient" />}
      {userInfo?.userType === "clinic" && <Navigate to="/clinic" />}
    </>
  );
}
