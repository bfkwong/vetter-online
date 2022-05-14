import React from "react";
import { ExclamationCircleFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

export default function UnknownRoute(props) {
  return (
    <div className="text-danger" style={{ marginTop: 30 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <h4 style={{ margin: 0, paddingRight: 5 }}>
          <ExclamationCircleFill />
        </h4>
        <h4 style={{ margin: 0 }}>These aren't the droids you're looking for</h4>
      </div>
      <p>
        There's nothing at this link, click <Link to="/">here</Link> to go home.
      </p>
    </div>
  );
}
