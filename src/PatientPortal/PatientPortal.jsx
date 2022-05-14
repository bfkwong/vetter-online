import React from "react";
import { Route, Routes } from "react-router-dom";
import FindDoctor from "./Pages/FindDoctor/FindDoctor";
import Home from "./Pages/Home/Home";
import Pets from "./Pages/Pets/Pets";
import Prescriptions from "./Pages/Prescriptions/Prescriptions";
import Visit from "./Pages/Visits/Visits";

export default function PatientPortal() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/find-doctor/*" element={<FindDoctor />} />
      <Route path="/visits/*" element={<Visit />} />
      <Route path="/prescriptions/*" element={<Prescriptions />} />
      <Route path="/pets/*" element={<Pets />} />
    </Routes>
  );
}
