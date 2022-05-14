import { useEffect, useState } from "react";
import { Button, InputGroup } from "react-bootstrap";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { listPetsByPatient, searchVetsBySpecialty } from "../../../graphql/queries";
import { createPet } from "../../../graphql/mutations";
import { setPets, triggerError } from "../../../redux/context/contextSlice";

import "./PetNew.css";

function ModalBody() {
  const cognitoId = useSelector((state) => state.context.cogUserId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [vets, setVets] = useState([]);
  const [fields, setFields] = useState({});

  const buildFieldProps = (_fields, _setFields, fieldName) => {
    return {
      value: _fields[fieldName],
      onChange: (e) => _setFields((fls) => ({ ...fls, [fieldName]: e.target.value }))
    };
  };

  useEffect(() => {
    (async () => {
      if (fields?.species !== "") {
        const vets = await searchVetsBySpecialty(fields.species);
        if (vets?.data?.searchVets?.items) {
          setVets(vets?.data?.searchVets?.items);
        }
      }
    })();
  }, [fields.species]);

  return (
    <>
      <div>
        <Row>
          <h5>Information</h5>

          <Col xs={12}>
            <Form.Group className="mb-3">
              <Form.Label>Name of pet</Form.Label>
              <Form.Control {...buildFieldProps(fields, setFields, "name")} />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Weight of pet</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control {...buildFieldProps(fields, setFields, "weight")} />
                <InputGroup.Text>LB</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Birthday</Form.Label>
              <Form.Control type="date" name="date_of_birth" {...buildFieldProps(fields, setFields, "birthday")} />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Species</Form.Label>
              <Form.Control {...buildFieldProps(fields, setFields, "species")} />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Breed</Form.Label>
              <Form.Control {...buildFieldProps(fields, setFields, "breed")} />
            </Form.Group>
          </Col>
          {fields.species && (
            <Col xs={12}>
              <h5>Select a vet</h5>
              <Row>
                {vets?.length === 0 && (
                  <div style={{ textAlign: "center" }}>
                    <h6 style={{ margin: "20px 0px 0px 0px" }}>Hmm, there's no vet for your pet</h6>
                    <p style={{ fontSize: 100 }}>🕸</p>
                  </div>
                )}
                {vets?.map &&
                  fields.species &&
                  vets.map((v, idx) => (
                    <Col xs={6} key={`${idx}`}>
                      <div
                        className={`skinny-item-container ${
                          fields.petVetId === v.id ? "skinny-item-container-selected" : ""
                        }`}
                        onClick={() => {
                          setFields((fls) => ({ ...fls, petVetId: v.id }));
                        }}>
                        <h6>{v.name}</h6>
                        <p style={{ margin: 0 }}>Specialty: {v.specialty}</p>
                      </div>
                    </Col>
                  ))}
              </Row>
            </Col>
          )}
          <Col xs={12}>
            <Button
              style={{ marginTop: 20 }}
              disabled={Object.keys(fields).length !== 6}
              onClick={async () => {
                await createPet({ ...fields, patientID: cognitoId });
                navigate("/patient/pets");

                const pets = await listPetsByPatient(cognitoId);
                if (pets?.data?.listPets?.items) {
                  dispatch(setPets(pets?.data?.listPets?.items));
                }
                dispatch(triggerError({ errorType: "TOAST_SUCCESS", errorId: "pet_add_success" }));
                setTimeout(() => {
                  dispatch(triggerError());
                }, 5000);
              }}>
              Add pet
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default function PetNew(props) {
  const navigate = useNavigate();

  return (
    <Modal show fullscreen onHide={() => navigate("/patient/visits")}>
      <Modal.Header closeButton>
        <Modal.Title>Add a new pet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid="md" style={{ maxWidth: 575 }}>
          <ModalBody />
        </Container>
      </Modal.Body>
    </Modal>
  );
}
