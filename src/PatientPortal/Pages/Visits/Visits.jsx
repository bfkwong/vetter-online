import { Button } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import ScheduleVisit from "./ScheduleVisit";
import Visit from "./Visit";
import VisitList from "../../../utility-react/VisitList/VisitList";

import "./Visits.css";
import { useEffect } from "react";
import { listVisits } from "../../../graphql/queries";
import { useDispatch, useSelector } from "react-redux";
import { setVisits } from "../../../redux/context/contextSlice";

export default function Visits() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cognitoId = useSelector((state) => state.context.cogUserId);

  useEffect(() => {
    (async () => {
      if (cognitoId) {
        const visits = await listVisits(cognitoId);
        if (visits?.data?.listVisits?.items) {
          dispatch(setVisits(visits?.data?.listVisits?.items));
        }
      }
    })();
  }, [dispatch, cognitoId]);

  return (
    <div>
      <Routes>
        <Route path="/">
          <Route index element={<VisitList />} />
          <Route path="/schedule" element={<ScheduleVisit />} />
          <Route path=":visitId" element={<Visit />} />
        </Route>
      </Routes>
    </div>
  );
}
