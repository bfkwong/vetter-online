import { Container } from "react-bootstrap";
import { ActionSuggestion } from "../FindDoctor/Component/DoctorList";

export default function Home(props) {
  return (
    <Container style={{ maxWidth: 700, marginBottom: 50 }}>
      <ActionSuggestion />
    </Container>
  );
}
