import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import DoctorList from "./Component/DoctorList";

export default function FindDoctor(props) {
  return (
    <Container style={{ maxWidth: 700 }}>
      <Routes>
        <Route index element={<DoctorList />}></Route>
      </Routes>
    </Container>
  );
}
