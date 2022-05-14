import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getUserInfoRdx, getVisitsRdx } from "../../redux/context/contextSelectors";

import "./VisitList.css";

export default function VisitList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processedVisits, setProcessedVisits] = useState({});
  const visits = useSelector(getVisitsRdx);
  const userInfo = useSelector(getUserInfoRdx);

  useEffect(() => {
    if (!searchParams.get("type")) {
      setSearchParams({ type: "upcoming" });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const visitDates = {};

    if (visits?.forEach) {
      visits
        .filter((visit) => {
          if (searchParams.get("type") === "upcoming") {
            return dayjs(visit.visitTime).isSame(dayjs(), "hour") || dayjs(visit.visitTime).isAfter(dayjs(), "hour");
          } else {
            return dayjs(visit.visitTime).isBefore(dayjs(), "hour");
          }
        })
        .forEach((visit) => {
          const visitDate = dayjs(visit.visitTime).format("MM/DD/YYYY");
          const visitTime = dayjs(visit.visitTime).format("h:mm A");

          if (!visitDates[visitDate]) {
            visitDates[visitDate] = [];
          }

          visitDates[visitDate].push({ ...visit, visitFormattedTime: visitTime });
        });
    }

    setProcessedVisits(visitDates);
  }, [visits, searchParams]);

  return (
    <Container style={{ maxWidth: 700 }}>
      <h4 style={{ marginTop: 35, marginBottom: 0 }}>Your upcoming visits</h4>

      <Nav justify variant="pills" activeKey={searchParams.get("type") ?? "upcoming"} style={{ marginTop: 15 }}>
        <Nav.Item onClick={() => setSearchParams({ type: "upcoming" })}>
          <Nav.Link eventKey="upcoming">Upcoming</Nav.Link>
        </Nav.Item>
        <Nav.Item onClick={() => setSearchParams({ type: "past" })}>
          <Nav.Link eventKey="past">Past</Nav.Link>
        </Nav.Item>
      </Nav>

      {Object.keys(processedVisits).length === 0 ? (
        <div style={{ paddingTop: 70, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 style={{ fontSize: 100, marginBottom: 20 }}>🐾</h1>
          <h3>There's nothing here ...</h3>
        </div>
      ) : (
        <div>
          {Object.keys(processedVisits).map((visitDates, idx) => (
            <div style={{ marginTop: 20 }} key={`${idx}`}>
              <h6>{visitDates}</h6>
              {processedVisits[visitDates].map((visit, idx2) => (
                <div
                  key={idx2}
                  className="visit_item"
                  onClick={() => navigate(`/${userInfo.userType}/visits/${visit.id}`)}>
                  <p style={{ margin: 0 }}>
                    <b>
                      {visit.petName} at {visit.visitFormattedTime}
                    </b>
                    <br />
                    {visit.visitReason}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
