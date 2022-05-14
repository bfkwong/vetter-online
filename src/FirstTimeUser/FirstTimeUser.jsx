import { useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPatient, createVet } from "../graphql/mutations";
import { getUserInfoRdx } from "../redux/context/contextSelectors";
import { initiateUserState } from "../redux/context/contextSlice";

export default function FirstTimeUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfoRdx);
  const cognitoId = useSelector((state) => state.context.cogUserId);
  const [userType, setUserType] = useState(null);
  const [patientFields, setPatientFields] = useState({
    cardCVV: "",
    cardExpDate: "",
    cardNum: "",
    name: "",
    cognitoId: ""
  });
  const [vetFields, setVetFields] = useState({
    name: "",
    specialty: ""
  });

  const buildFieldProps = (fields, setFields, fieldName) => {
    return {
      value: fields[fieldName],
      onChange: (e) => setFields((fls) => ({ ...fls, [fieldName]: e.target.value }))
    };
  };

  const buildContent = () => {
    if (userInfo) {
      return (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <h4>You're good to go 👍</h4>
          <p>You signed up</p>
        </div>
      );
    }

    if (!userType) {
      return (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <h5>Are you registering as a patient or a vet?</h5>
          <Button style={{ width: 300, margin: 10 }} onClick={() => setUserType("patient")}>
            I am a patient
          </Button>
          <Button style={{ width: 300, margin: 10 }} onClick={() => setUserType("vet")}>
            I am a vet
          </Button>
        </div>
      );
    }

    if (userType === "patient") {
      return (
        <div>
          <h5 style={{ marginBottom: 15 }}>Great, we just need a little bit of information</h5>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control {...buildFieldProps(patientFields, setPatientFields, "name")} />
          </Form.Group>
          <h5 style={{ marginBottom: 15 }}>Your payment information</h5>
          <Row>
            <Col xs={6}>
              <Form.Group className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  placeholder="XXXX XXXX XXXX XXXX"
                  {...buildFieldProps(patientFields, setPatientFields, "cardNum")}
                />
              </Form.Group>
            </Col>
            <Col xs={3}>
              <Form.Group className="mb-3">
                <Form.Label>Expiration Date</Form.Label>
                <Form.Control
                  placeholder="XX/XXXX"
                  {...buildFieldProps(patientFields, setPatientFields, "cardExpDate")}
                />
              </Form.Group>
            </Col>
            <Col xs={3}>
              <Form.Group className="mb-3">
                <Form.Label>CVV</Form.Label>
                <Form.Control placeholder="XXX" {...buildFieldProps(patientFields, setPatientFields, "cardCVV")} />
              </Form.Group>
            </Col>
            <Col xs={12} style={{ marginTop: 25 }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  style={{ width: 250 }}
                  onClick={async () => {
                    const patient = await createPatient({ ...patientFields, cognitoId });
                    if (patient?.data?.createPatient) {
                      dispatch(initiateUserState({ ...patient?.data?.createPatient, userType: "patient" }));
                    }
                  }}>
                  Sign up as customer
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      );
    }

    if (userType === "vet") {
      return (
        <div>
          <h5 style={{ marginBottom: 15 }}>Great, we just need a little bit of information</h5>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control {...buildFieldProps(vetFields, setVetFields, "name")} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Specialty</Form.Label>
            <Form.Control placeholder="Iguanas" {...buildFieldProps(vetFields, setVetFields, "specialty")} />
          </Form.Group>
          <Row>
            <Col xs={12} style={{ marginTop: 25 }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  style={{ width: 250 }}
                  onClick={async () => {
                    const vet = await createVet({ ...vetFields, cognitoId });
                    if (vet?.data?.createVet) {
                      dispatch(initiateUserState({ ...vet?.data?.createVet, userType: "clinic" }));
                    }
                  }}>
                  Sign up as vet
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      );
    }
  };

  return (
    <Modal show fullscreen onHide={() => navigate("/")}>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container style={{ maxWidth: 700 }}>{buildContent()}</Container>
      </Modal.Body>
    </Modal>
  );
}
