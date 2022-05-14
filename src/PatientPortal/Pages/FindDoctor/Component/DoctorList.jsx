import { useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { searchVetsBySpecialty } from "../../../../graphql/queries";

export function ActionSuggestion() {
  const navigate = useNavigate();

  return (
    <div>
      <h4 className="page-title">Suggestions</h4>
      <div className="listed-item-container" onClick={() => navigate("/patient/visits?type=upcoming")}>
        <h6 style={{ marginBottom: 2 }}>See your upcoming appointments</h6>
        <p style={{ margin: 0 }}>Make changes or cancel an upcoming reservation</p>
      </div>
      <div className="listed-item-container" onClick={() => navigate("/patient/find-doctor")}>
        <h6 style={{ marginBottom: 2 }}>Find care for your pet</h6>
        <p style={{ margin: 0 }}>Find care near you anywhere in the world</p>
      </div>
    </div>
  );
}

export default function DoctorList(props) {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [fields, setFields] = useState({
    distance: "25"
  });

  return (
    <div>
      <h4 className="page-title">Find a doctor</h4>
      <div style={{ border: "2px solid #e0e0e0", borderRadius: 10, padding: "30px 40px 30px 40px" }}>
        <Row>
          <Col xs={12}>
            <Form.Group className="mb-3">
              <Form.Label>Specialty needed</Form.Label>
              <Form.Control
                placeholder="Cats"
                value={fields.specialty}
                onChange={(e) => setFields((fls) => ({ ...fls, specialty: e.target.value }))}
              />
            </Form.Group>
          </Col>
          <Col xs={12} style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                disabled={!fields.specialty}
                style={{ paddingLeft: 30, paddingRight: 30 }}
                onClick={async () => {
                  const vets = await searchVetsBySpecialty(fields.specialty);
                  if (vets?.data?.searchVets?.items) {
                    setDoctors(vets?.data?.searchVets?.items);
                  }
                }}>
                Search
              </Button>
              <Button
                variant="link"
                style={{ marginLeft: 20 }}
                onClick={() => {
                  setFields({ specialty: "" });
                  setDoctors([]);
                }}>
                Clear
              </Button>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <h4 className="page-title">Results for doctors</h4>
        <div style={{ marginBottom: 50 }}>
          {doctors?.length === 0 && (
            <div style={{ textAlign: "center" }}>
              <h6 style={{ margin: "20px 0px 0px 0px" }}>Hmm, there's no vet for your pet</h6>
              <p style={{ fontSize: 100 }}>🕸</p>
            </div>
          )}
          {doctors &&
            doctors.map((doctor) => (
              <div
                className="listed-item-container"
                onClick={() => navigate(`/patient/visits/schedule?vetId=${doctor.id}`)}>
                <h6>Dr. {doctor.name}</h6>
                <p className="secondary-color" style={{ margin: 0 }}>
                  Specialty: {doctor.specialty}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
