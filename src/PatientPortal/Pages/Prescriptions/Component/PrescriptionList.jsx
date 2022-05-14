import { Percent } from "react-bootstrap-icons";

const mockPrescriptions = {
  Tofu: [
    {
      title: "40mg Lotilaner",
      purpose: "Flea treatment",
      direction: "Chewable tablet once per day with meal. Do with 5 days",
      doctor: "Teo Enea",
      dateAdminstered: "09/12/2021"
    },
    {
      title: "23mg Praziquantel",
      purpose: "Dewormer",
      direction: "One tablet once per day with meal. Do for 3 days",
      doctor: "Teo Enea",
      dateAdminstered: "04/29/2020"
    }
  ],
  Beans: [
    {
      title: "227mg Pyrantel",
      purpose: "Heartworm",
      direction: "Once a month continuous",
      doctor: "Teo Enea",
      dateAdminstered: "01/12/2021"
    }
  ]
};

export default function PrescriptionList(props) {
  return (
    <div>
      <h4 className="page-title">Prescriptions</h4>
      {Object.keys(mockPrescriptions).map((pet) => (
        <div>
          <h5 className="secondary-title">{pet}'s prescriptions</h5>
          {mockPrescriptions[pet].map((presc) => (
            <div className="listed-item-container">
              <h6 className="no-margin">
                {presc.title} - {presc.purpose}
              </h6>
              <p style={{ marginTop: 0 }} className="secondary-color">
                {presc.dateAdminstered} from Dr. {presc.doctor}
              </p>
              <p className="no-margin">
                <b>Directions: </b>
                {presc.direction}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
