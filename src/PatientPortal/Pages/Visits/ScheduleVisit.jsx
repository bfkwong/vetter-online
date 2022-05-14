import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { createVisit } from "../../../graphql/mutations";
import { getZoomLink, listPetsByPatient, listVisits } from "../../../graphql/queries";
import { setVisits, triggerError } from "../../../redux/context/contextSlice";

import "./ScheduleVisit.css";

function ModalBody() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cognitoId = useSelector((state) => state.context.cogUserId);
  const [pets, setPets] = useState([]);
  const [fields, setFields] = useState({});

  const buildFieldProps = (_fields, _setFields, fieldName) => {
    return {
      value: _fields[fieldName],
      onChange: (e) => _setFields((fls) => ({ ...fls, [fieldName]: e.target.value }))
    };
  };

  useEffect(() => {
    (async () => {
      const pets = await listPetsByPatient(cognitoId);
      if (pets?.data?.listPets?.items) {
        setPets(pets?.data?.listPets?.items);
      }
    })();
  }, [cognitoId]);

  useEffect(() => {
    if (searchParams.get("vetId")) {
      setFields((fls) => ({ ...fls, vetId: searchParams.get("vetId") }));
    }
  }, [searchParams]);

  if (!searchParams.get("vetId")) {
    return (
      <div style={{ textAlign: "center" }}>
        <h3>You have to choose a vet first</h3>
        <p style={{ fontSize: 150 }}>🏥</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <Row>
          <Col xs={12} style={{ marginBottom: 30 }}>
            <h5>Appointment with Dr. Vet Project</h5>
          </Col>
          <Col xs={12}>
            <Form.Group className="mb-3">
              <Form.Label>Pet that will be seen</Form.Label>
              <Form.Select {...buildFieldProps(fields, setFields, "petId")}>
                <option></option>
                {pets?.map && pets.map((p) => <option value={p.id}>{p.name}</option>)}
              </Form.Select>
              <Form.Text className="text-muted">
                Click <Link to="/">here</Link> to add a new pet.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Select a time and date that works</Form.Label>
              <Form.Control type="date" {...buildFieldProps(fields, setFields, "visitDate")} />
            </Form.Group>
          </Col>
          <Col xs={12} style={{ marginBottom: 15 }}>
            <Row>
              {[
                "9:00 AM",
                "10:00 AM",
                "11:00 AM",
                "12:00 PM",
                "1:00 PM",
                "2:00 PM",
                "3:00 PM",
                "4:00 PM",
                "5:00 PM"
              ].map((time, idx) => (
                <Col xs={4} sm={3} key={`${idx}`}>
                  <div
                    className={`time_picker ${fields.visitTime === time ? "time_picker_selected" : ""}`}
                    onClick={() => {
                      setFields((fls) => ({ ...fls, visitTime: time }));
                    }}>
                    {time}
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
          <Col xs={12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Reason for visit</Form.Label>
              <Form.Control as="textarea" rows={2} {...buildFieldProps(fields, setFields, "visitReason")} />
              <Form.Text className="text-muted">A brief description will do</Form.Text>
            </Form.Group>
          </Col>
          <Col xs={12}>
            <p className="text-muted">
              By clicking <b>schedule</b>, you agree to Vetter's terms of service and privacy statements. A video chat
              link will be created and you can join the link at the scheduled time. You will be notified of any updates
              and before the scheduled time via email.
            </p>
            <Button
              onClick={async () => {
                const visitTime = dayjs(`${fields.visitDate} ${fields.visitTime}`, "YYYY-MM-DD h:mm A").format();
                const zoomLinkResp = await getZoomLink(visitTime);
                const videoLink = JSON.parse(zoomLinkResp.body).url;

                const petName = pets.find((p) => p.id === fields.petId).name;
                await createVisit({
                  ...fields,
                  petName,
                  patientID: cognitoId,
                  visitTime,
                  videoLink
                });
                const visits = await listVisits(cognitoId);
                if (visits?.data?.listVisits?.items) {
                  dispatch(setVisits(visits?.data?.listVisits?.items));
                }
                navigate("/patient/visits");
                dispatch(triggerError({ errorType: "TOAST_SUCCESS", errorId: "schedule_success" }));
                setTimeout(() => {
                  dispatch(triggerError());
                }, 5000);
              }}>
              Schedule
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default function ScheduleVisit(props) {
  const navigate = useNavigate();

  return (
    <Modal show fullscreen onHide={() => navigate("/patient/visits")}>
      <Modal.Header closeButton>
        <Modal.Title>Schedule a new visit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid="md" style={{ maxWidth: 575 }}>
          <ModalBody />
        </Container>
      </Modal.Body>
    </Modal>
  );
}
