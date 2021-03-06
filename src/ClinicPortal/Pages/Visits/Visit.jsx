import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Badge, Button, Container, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { PencilFill, FileEarmarkPlusFill } from "react-bootstrap-icons";
import { getPet, getVisit, listInvoicesByVisit, listPrescriptions } from "../../../graphql/queries";
import {
  createPrescription,
  deletePrescription,
  updatePrescription,
  updateVisitNotes,
  updateVisitReason,
  createInvoice,
  deleteInvoice,
  updateInvoiceAmount
} from "../../../graphql/mutations";
import { useDispatch } from "react-redux";
import { setGlobalLoad } from "../../../redux/context/contextSlice";
import CreateInvoice, { EditInvoice } from "../../../utility-react/CreateInvoice";

function InvoiceBox(props) {
  const { invoice } = props;
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div>
      <div className="listed-item-container" onClick={() => setShowEdit(true)}>
        {invoice.datePaid ? (
          <Badge bg="success" style={{ marginBottom: 10 }}>
            Paid on {invoice.datePaid}
          </Badge>
        ) : (
          <Badge bg="secondary" style={{ marginBottom: 10 }}>
            Not paid yet
          </Badge>
        )}
        <h6>Invoice #{invoice.id}</h6>
        <p style={{ marginBottom: 3 }}>
          Sent on <b>{dayjs(invoice.dateSent).format("MM/DD/YYYY")}</b> for <b>${invoice.amount}.00</b>
        </p>
      </div>
      <EditInvoice
        initialInvoiceAmt={invoice.amount}
        show={showEdit}
        onHide={() => setShowEdit(false)}
        onDelete={async () => {
          await deleteInvoice(invoice.id);
          props.setInvoice(null);
          setShowEdit(false);
        }}
        onSave={async (invoiceAmt) => {
          await updateInvoiceAmount(invoice.id, invoiceAmt);
          const invoiceAPI = await listInvoicesByVisit(props.visitId);
          if (invoiceAPI?.data?.listInvoices?.items?.length > 0) {
            props.setInvoice && props.setInvoice(invoiceAPI?.data?.listInvoices?.items[0]);
          }
          setShowEdit(false);
        }}
      />
    </div>
  );
}

function PrescriptionBox(props) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="listed-item-container" onClick={() => setShow(true)}>
        <h6 className="no-margin">{props.presc.medicine}</h6>
        <p className="no-margin">
          <b>Directions: </b>
          {props.presc.instruction}
        </p>
      </div>
      <EditPrescription
        initialMedicine={props.presc.medicine}
        initialInstruction={props.presc.instruction}
        show={show}
        onHide={() => setShow(false)}
        onDelete={async () => {
          setShow(false);
          await deletePrescription(props.presc.id);
          props.updatePrescrRdx && (await props.updatePrescrRdx());
        }}
        onAdd={async (fields) => {
          setShow(false);
          await updatePrescription({ ...fields, id: props.presc.id });
          props.updatePrescrRdx && (await props.updatePrescrRdx());
        }}
      />
    </div>
  );
}

function EditPrescription(props) {
  const [prescrFields, setPrescrFields] = useState({
    medicine: props.initialMedicine,
    instruction: props.initialInstruction
  });

  return (
    <Modal show={props.show} onHide={() => props.onHide && props.onHide(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Prescription</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Medicine</Form.Label>
          <Form.Control
            placeholder="Lotilaner 40mg"
            value={prescrFields.medicine}
            onChange={(e) => setPrescrFields((fls) => ({ ...fls, medicine: e.target.value }))}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Instructions</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="3 times a day for 5 days until better"
            value={prescrFields.instruction}
            onChange={(e) => setPrescrFields((fls) => ({ ...fls, instruction: e.target.value }))}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          {props.onDelete && (
            <Button variant="outline-danger" onClick={() => props.onDelete()}>
              Delete
            </Button>
          )}
        </div>
        <Button variant="secondary" onClick={() => props.onHide && props.onHide(false)}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.onAdd && props.onAdd(prescrFields);
          }}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function EditingField(props) {
  const [value, setValue] = useState(props.initialValue);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setValue(props.initialValue);
  }, [props.initialValue]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 35, marginBottom: 8 }}>
        <h5 style={{ margin: 0, flex: 1 }}>{props.title}</h5>
        {!props.notEditable && (
          <Button variant="outline-primary" size="sm" onClick={() => setEditing(true)}>
            <PencilFill />
          </Button>
        )}
      </div>

      {editing ? (
        <div>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </Form.Group>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outline-danger"
              style={{ marginRight: 7, width: 100 }}
              onClick={() => {
                setEditing(false);
                setValue(props.initialValue);
              }}>
              Cancel
            </Button>
            <Button
              style={{ marginLeft: 7, width: 100 }}
              onClick={() => {
                props.onSave && props.onSave(value);
                setEditing(false);
              }}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <p>{value && value !== "" ? value : <span style={{ color: "#808080" }}>Nothing here ...</span>}</p>
      )}
    </div>
  );
}

export default function Visit(props) {
  const dispatch = useDispatch();
  let { visitId } = useParams();
  const [visitObject, setVisitObject] = useState({});
  const [vet, setVet] = useState({});
  const [prescr, setPrescr] = useState([]);
  const [addPrescr, setAddPrescr] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    (async () => {
      const visit = await getVisit(visitId);
      if (visit?.data?.getVisit) {
        setVisitObject(visit?.data?.getVisit);

        if (visit?.data?.getVisit?.vetId) {
          const vet = await getPet(visit?.data?.getVisit?.petId);
          if (vet?.data?.getPet) {
            setVet(vet?.data?.getPet);
          }
        }
      }
    })();
    (async () => {
      const prescrsAPI = await listPrescriptions(visitId);
      if (prescrsAPI?.data?.listPrescriptions?.items) {
        setPrescr(prescrsAPI?.data?.listPrescriptions?.items);
      }
    })();
    (async () => {
      const invoiceAPI = await listInvoicesByVisit(visitId);
      if (invoiceAPI?.data?.listInvoices?.items?.length > 0) {
        setInvoice(invoiceAPI?.data?.listInvoices?.items[0]);
      }
    })();
  }, [visitId]);

  return (
    <Container style={{ maxWidth: 700, marginTop: 30, marginBottom: 150 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <h3 style={{ flex: 1 }}>
          {visitObject.petName} - {vet.breed} {vet.species}
        </h3>
      </div>
      <p style={{ marginBottom: 3 }}>
        Scheduled for {dayjs(visitObject.visitTime).format("MM/DD/YYYY")} at{" "}
        {dayjs(visitObject.visitTime).format("h:mm A")}{" "}
      </p>
      <p>
        Video link:{" "}
        <a href={visitObject.videoLink} target="_blank" rel="noreferrer">
          {visitObject.videoLink}
        </a>
      </p>
      {invoice ? (
        <InvoiceBox invoice={invoice} setInvoice={setInvoice} visitId={visitId} />
      ) : (
        <Button variant="outline-primary" style={{ width: "100%" }} onClick={() => setShowCreateInvoice(true)}>
          Create invoice
        </Button>
      )}
      <EditingField
        notEditable
        title="Visit reason"
        initialValue={visitObject.visitReason}
        onSave={async (value) => {
          const visit = await updateVisitReason(visitId, value);
          if (visit?.data?.updateVisit) {
            setVisitObject(visit?.data?.updateVisit);
          }
        }}
      />
      <EditingField
        title={"Visit notes"}
        initialValue={visitObject.visitNotes}
        onSave={async (value) => {
          const visit = await updateVisitNotes(visitId, value);
          if (visit?.data?.updateVisit) {
            setVisitObject(visit?.data?.updateVisit);
          }
        }}
      />
      <div style={{ display: "flex", alignItems: "center", marginTop: 35, marginBottom: 8 }}>
        <h5 style={{ margin: 0, flex: 1 }}>Visit prescriptions</h5>
        <div>
          <Button size="sm" variant="outline-primary" onClick={() => setAddPrescr(true)}>
            <FileEarmarkPlusFill />
          </Button>
        </div>
      </div>
      {!prescr || prescr?.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <h6>Nothing here yet</h6>
          <p style={{ fontSize: 100 }}>????</p>
        </div>
      ) : (
        prescr?.map &&
        prescr.map((presc, idx) => (
          <PrescriptionBox
            presc={presc}
            key={`${idx}`}
            updatePrescrRdx={async () => {
              const prescrsAPI = await listPrescriptions(visitId);
              if (prescrsAPI?.data?.listPrescriptions?.items) {
                setPrescr(prescrsAPI?.data?.listPrescriptions?.items);
              }
            }}
          />
        ))
      )}
      <EditPrescription
        show={addPrescr}
        onHide={() => setAddPrescr(false)}
        onAdd={async (prescrFields) => {
          setAddPrescr(false);
          dispatch(setGlobalLoad(true));
          await createPrescription({ ...prescrFields, visitID: visitId });
          const prescrsAPI = await listPrescriptions(visitId);
          if (prescrsAPI?.data?.listPrescriptions?.items) {
            setPrescr(prescrsAPI?.data?.listPrescriptions?.items);
          }
          dispatch(setGlobalLoad(false));
        }}
      />
      <CreateInvoice
        visit={visitObject}
        show={showCreateInvoice}
        onHide={() => setShowCreateInvoice(false)}
        onSave={async (invoiceAmt) => {
          const pet = await getPet(visitObject.petId);
          setShowCreateInvoice(false);

          if (pet?.data?.getPet) {
            await createInvoice({
              amount: invoiceAmt,
              dateSent: dayjs().format("YYYY-MM-DD"),
              visitId: visitObject.id,
              vetId: visitObject.vetId,
              patientId: pet?.data?.getPet?.patientID
            });
            const invoiceAPI = await listInvoicesByVisit(visitId);
            if (invoiceAPI?.data?.listInvoices?.items?.length > 0) {
              setInvoice(invoiceAPI?.data?.listInvoices?.items[0]);
            }
          }
        }}
      />
    </Container>
  );
}
