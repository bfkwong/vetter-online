import { Button } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import PetList from "./PetList";
import PetNew from "./PetNew";

import "./Pets.css";
import PetView from "./PetView";

export default function Pets(props) {
  const navigate = useNavigate();

  return (
    <div>
      <Routes>
        <Route path="/">
          <Route index element={<PetList />} />
          <Route path="/new" element={<PetNew />} />
          <Route path=":petId" element={<PetView />} />
        </Route>
      </Routes>
      <div className="add-pet-btn" style={{ position: "absolute", right: 50, bottom: 45 }}>
        <Button onClick={() => navigate("/patient/pets/new")}>Add pet</Button>
      </div>
    </div>
  );
}
