import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./PetList.css";

export default function PetList(props) {
  const pets = useSelector((state) => state.context.pets);
  const navigate = useNavigate();

  return (
    <Container style={{ maxWidth: 700 }}>
      <h4 style={{ marginTop: 35, marginBottom: 10 }}>Your pets</h4>
      <Row>
        {pets?.map &&
          pets.map((pet, idx) => (
            <Col xs={12} key={`${idx}`}>
              <div className="pet-item" onClick={() => navigate(`/patient/pets/${pet.id}`)}>
                <h5 style={{ marginBottom: 3 }}>{pet.name}</h5>
                <p style={{ margin: "0px 0px 5px 0px" }} className="secondary-color">
                  {pet.breed} - {pet.species}
                </p>
              </div>
            </Col>
          ))}
      </Row>
    </Container>
  );
}
