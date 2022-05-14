import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Badge, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, Route, Routes, Navigate } from "react-router-dom";
import { listInvoicesByVetId } from "../graphql/queries";
import Visits from "./Pages/Visits/Visits";

function Payments(props) {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();
  const vetId = useSelector((state) => state.context?.userInfo?.id);

  useEffect(() => {
    (async () => {
      const invoicesAPI = await listInvoicesByVetId(vetId);
      if (invoicesAPI?.data?.listInvoices?.items) {
        setInvoices(invoicesAPI?.data?.listInvoices?.items);
      }
    })();
  }, [vetId]);

  return (
    <Container style={{ maxWidth: 700 }}>
      <h4 style={{ marginTop: 35, marginBottom: 0 }}>Your invoices</h4>
      {invoices?.map &&
        invoices.map((invoice) => (
          <div className="listed-item-container" onClick={() => navigate(`/clinic/visits/${invoice.visitId}`)}>
            {invoice.datePaid ? (
              <Badge bg="success" style={{ marginBottom: 10 }}>
                Paid on {invoice.datePaid}
              </Badge>
            ) : (
              <Badge bg="secondary" style={{ marginBottom: 10 }}>
                Not paid yet
              </Badge>
            )}
            <h6 style={{ marginBottom: 0 }}>Invoice #{invoice.id}</h6>
            <p style={{ marginBottom: 3, marginTop: 0 }}>
              Sent on <b>{dayjs(invoice.dateSent).format("MM/DD/YYYY")}</b> for <b>${invoice.amount}.00</b>
            </p>
          </div>
        ))}
    </Container>
  );
}

export default function ClinicPortal(props) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="visits" />} />
      <Route path="/visits/*" element={<Visits />} />
      <Route path="/payments" element={<Payments />} />
    </Routes>
  );
}
