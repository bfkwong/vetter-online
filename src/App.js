import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AdminPortal from "./AdminPortal/AdminPortal";
import ClinicPortal from "./ClinicPortal/ClinicPortal";
import PatientPortal from "./PatientPortal/PatientPortal";
import { getUserInfoRdx } from "./redux/context/contextSelectors";
import { initiateUserState, setPets } from "./redux/context/contextSlice";
import GlobalError from "./utility-react/Errors/GlobalError";
import { NavbarWrapper } from "./utility-react/Navbars/NavbarWrapper";
import HomeRedirector from "./utility-react/Routing/HomeRedirector";
import UnknownRoute from "./utility-react/Routing/UnknownRoute";
import FirstTimeUser from "./FirstTimeUser/FirstTimeUser";

import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import { Auth } from "aws-amplify";
import { setCognitoUserId } from "./redux/context/contextSlice";
import { listPetsByPatient, searchPatient, searchVet } from "./graphql/queries";

function App() {
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfoRdx);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const currentSession = await Auth.currentSession();
      const cogUserId = currentSession?.idToken?.payload["cognito:username"];

      dispatch(setCognitoUserId(cogUserId));
    })();
    (async () => {
      const currentSession = await Auth.currentSession();
      const cogUserId = currentSession?.idToken?.payload["cognito:username"];

      const pets = await listPetsByPatient(cogUserId);
      if (pets?.data?.listPets?.items) {
        dispatch(setPets(pets?.data?.listPets?.items));
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    if (location?.pathname?.includes && userInfo?.userType) {
      if (location.pathname.includes("admin") && userInfo?.userType !== "admin") {
        navigate("/unknown");
      }
      if (location.pathname.includes("clinic") && userInfo?.userType !== "clinic") {
        navigate("/unknown");
      }
      if (location.pathname.includes("patient") && userInfo?.userType !== "patient") {
        navigate("/unknown");
      }
    }
  }, [location, userInfo, navigate]);

  useEffect(() => {
    (async () => {
      if (!userInfo) {
        const currentSession = await Auth.currentSession();
        const cogUserId = currentSession?.idToken?.payload["cognito:username"];

        const patient = await searchPatient(cogUserId);

        if (patient?.data?.searchPatients?.items?.length >= 1) {
          dispatch(initiateUserState({ ...patient?.data?.searchPatients?.items[0], userType: "patient" }));
        } else {
          const vet = await searchVet(cogUserId);
          if (vet?.data?.searchVets?.items?.length >= 1) {
            dispatch(initiateUserState({ ...vet?.data?.searchVets?.items[0], userType: "clinic" }));
          } else {
            navigate("/ftu");
          }
        }
      }
    })();
  }, [dispatch, navigate, userInfo]);

  return (
    <GlobalError>
      <NavbarWrapper />
      <Container>
        <Routes>
          <Route path="/admin/*" element={<AdminPortal />} />
          <Route path="/patient/*" element={<PatientPortal />} />
          <Route path="/clinic/*" element={<ClinicPortal />} />
          <Route path="/ftu" element={<FirstTimeUser />} />
          <Route path="/" element={<HomeRedirector />} />
          <Route path="*" element={<UnknownRoute />} />
        </Routes>
      </Container>
    </GlobalError>
  );
}

export default withAuthenticator(App);
