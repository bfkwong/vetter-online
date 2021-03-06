import { Modal, Alert, Spinner } from "react-bootstrap";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFatalError, getGlobalLoad } from "../../redux/context/contextSelectors";
import { CheckCircleFill, ExclamationCircleFill, InfoCircleFill } from "react-bootstrap-icons";
import { clearError } from "../../redux/context/contextSlice";

const errorMessages = {
  ntwk_failure: {
    title: "There's been a network error",
    body: "Something went wrong trying to retrieve your information, refresh the page and try again."
  },
  schedule_success: {
    title: "🎉 Your appointment has been scheduled!",
    body: "We will notify you when its time to join video chat link."
  },
  pet_add_success: {
    title: "🎉 You've added a new pet!",
    body: "Review and edit your pet's information in the pet tab."
  }
};

function ModalErrors(props) {
  const error = useSelector(getFatalError);
  const dispatch = useDispatch();

  const errorClasses = {
    MODAL_ERROR: "text-danger",
    MODAL_WARNING: "text-warning",
    MODAL_SUCCESS: "text-success",
    MODAL_BLANK: ""
  };

  const errorIcon = {
    MODAL_ERROR: <ExclamationCircleFill />,
    MODAL_WARNING: <ExclamationCircleFill />,
    MODAL_SUCCESS: <CheckCircleFill />,
    MODAL_BLANK: <InfoCircleFill />
  };

  if (error?.errorType?.includes && error.errorType.includes("MODAL")) {
    return (
      <Modal show onHide={() => dispatch(clearError())}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div style={{ display: "flex", alignItems: "center" }} class={errorClasses[error.errorType]}>
              {errorIcon[error.errorType] ?? <InfoCircleFill />}
              <div style={{ marginLeft: 5 }}>
                {errorMessages[error.errorId]?.title ?? "Uh-oh, something went wrong"}
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {errorMessages[error.errorId]?.body ??
              "Something went wrong and we're not sure why. Refresh the page and try again"}
          </p>
        </Modal.Body>
      </Modal>
    );
  }
  return <></>;
}

function ToastErrors(props) {
  const error = useSelector(getFatalError);
  const dispatch = useDispatch();

  const errorClasses = {
    TOAST_ERROR: "danger",
    TOAST_WARNING: "warning",
    TOAST_SUCCESS: "success",
    TOAST_BLANK: "primary"
  };

  if (error?.errorType?.includes && error.errorType.includes("TOAST")) {
    console.log(error);

    return (
      <Alert
        variant={errorClasses[error.errorType]}
        dismissible
        style={{ position: "absolute", left: "5%", right: "5%", bottom: 20, zIndex: 5000 }}
        onClose={() => dispatch(clearError())}>
        <Alert.Heading>{errorMessages[error.errorId]?.title ?? "Uh-oh, something went wrong"}</Alert.Heading>
        <p>
          {errorMessages[error.errorId]?.body ??
            "Something went wrong and we're not sure why. Refresh the page and try again"}
        </p>
      </Alert>
    );
  }
  return <></>;
}

export default function GlobalError(props) {
  const error = useSelector(getFatalError);
  const globalLoad = useSelector(getGlobalLoad);

  if (error && error.errorType === "FATAL_ERROR") {
    return (
      <div style={{ margin: 30 }}>
        <h1 style={{ fontSize: 100 }}>:(</h1>
        <h1>{errorMessages[error.errorId]?.title ?? "Uh-oh, something went wrong"}</h1>
        <p>
          {errorMessages[error.errorId]?.body ??
            "Something went wrong and we're not sure why. Refresh the page and try again"}
        </p>
      </div>
    );
  }

  return (
    <div>
      {globalLoad && (
        <div
          style={{
            background: "rgba(0,0,0,0.1)",
            width: "100vw",
            height: "100vh",
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      <ModalErrors />
      <ToastErrors />
      {props.children}
    </div>
  );
}
