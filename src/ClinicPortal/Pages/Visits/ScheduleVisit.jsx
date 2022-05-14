import { Button } from "react-bootstrap";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { triggerError } from "../../../redux/context/contextSlice";

import "./ScheduleVisit.css";

function ModalBody() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
              <Form.Select aria-label="Default select example">
                <option></option>
                <option value="1">Tofu</option>
                <option value="2">Bean</option>
                <option value="3">Bacon</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Click <Link to="/">here</Link> to add a new pet.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Select a date that works</Form.Label>
              <Form.Control type="date" name="date_of_birth" />
            </Form.Group>
          </Col>
          <Col xs={12} style={{ marginBottom: 15 }}>
            <Row>
              {["9:00AM", "10:00AM", "5:00PM", "6:00PM", "8:00PM", "10:00PM"].map((time) => (
                <Col xs={4} sm={3}>
                  <div className="time_picker">{time}</div>
                </Col>
              ))}
            </Row>
          </Col>
          <Col xs={12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Reason for visit</Form.Label>
              <Form.Control as="textarea" rows={2} />
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
              onClick={() => {
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
    <Modal show fullscreen onHide={() => navigate("/clinic/visits")}>
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
