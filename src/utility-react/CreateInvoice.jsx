import { useEffect, useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap";

export default function CreateInvoice(props) {
  const [invoiceAmt, setInvoiceAmt] = useState("");

  return (
    <Modal show={props.show} onHide={() => props.onHide && props.onHide()}>
      <Modal.Header closeButton>
        <Modal.Title>Create an invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label>Invoice amount</Form.Label>
        <InputGroup className="mb-3">
          <InputGroup.Text>$</InputGroup.Text>
          <FormControl value={invoiceAmt} onChange={(e) => setInvoiceAmt(e.target.value)} />
          <InputGroup.Text>.00</InputGroup.Text>
        </InputGroup>
        <Button
          style={{ width: "100%", marginTop: 10 }}
          variant="outline-primary"
          onClick={() => {
            props.onSave && props.onSave(invoiceAmt);
          }}>
          Create
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export function EditInvoice(props) {
  const [invoiceAmt, setInvoiceAmt] = useState("");

  useEffect(() => {
    setInvoiceAmt(props.initialInvoiceAmt);
  }, [props.initialInvoiceAmt]);

  return (
    <Modal show={props.show} onHide={() => props.onHide && props.onHide()}>
      <Modal.Header closeButton>
        <Modal.Title>Create an invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label>Invoice amount</Form.Label>
        <InputGroup className="mb-3">
          <InputGroup.Text>$</InputGroup.Text>
          <FormControl value={invoiceAmt} onChange={(e) => setInvoiceAmt(e.target.value)} />
          <InputGroup.Text>.00</InputGroup.Text>
        </InputGroup>
        <div style={{ display: "flex", marginTop: 10 }}>
          <Button
            style={{ flex: 1, marginRight: 5 }}
            variant="outline-danger"
            onClick={() => {
              props.onDelete && props.onDelete(invoiceAmt);
            }}>
            Delete
          </Button>
          <Button
            style={{ flex: 1, marginLeft: 5 }}
            onClick={() => {
              props.onSave && props.onSave(invoiceAmt);
            }}>
            Save
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
