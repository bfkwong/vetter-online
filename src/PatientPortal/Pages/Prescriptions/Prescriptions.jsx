import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import PrescriptionList from "./Component/PrescriptionList";

export default function Prescriptions(props) {
  return (
    <Container style={{ maxWidth: 700 }}>
      <Routes>
        <Route index element={<PrescriptionList />}></Route>
      </Routes>
    </Container>
  );
}
