import { Route, Routes } from "react-router-dom";
import ScheduleVisit from "./ScheduleVisit";
import Visit from "./Visit";
import VisitList from "../../../utility-react/VisitList/VisitList";

import "./Visits.css";
import { useDispatch, useSelector } from "react-redux";
import { listVisitsByVetId } from "../../../graphql/queries";
import { useEffect } from "react";
import { setVisits } from "../../../redux/context/contextSlice";

export default function Visits() {
  const dispatch = useDispatch();
  const vetId = useSelector((state) => state.context?.userInfo?.id);

  useEffect(() => {
    (async () => {
      if (vetId) {
        const visits = await listVisitsByVetId(vetId);
        if (visits?.data?.listVisits?.items) {
          dispatch(setVisits(visits?.data?.listVisits?.items));
        }
      }
    })();
  }, [dispatch, vetId]);

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
