import { Button } from "react-bootstrap";

export default function PrimaryDoctor(props) {
  return (
    <div>
      <h4 className="page-title">Your primary doctor</h4>
      <div className="listed-item-container">
        <h6>Dr. Severus Snape</h6>
        <p className="secondary-color">Tel: (738) 234-9312</p>
        <div style={{ display: "flex" }}>
          <p className="no-margin" style={{ flex: 1 }}>
            1453 Target Circ <br />
            Berkeley, CA 94618
          </p>
          <Button>Schedule</Button>
        </div>
      </div>
    </div>
  );
}
