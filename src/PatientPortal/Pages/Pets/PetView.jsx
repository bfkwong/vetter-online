import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getPet, getVet, listVisitsByPetId } from "../../../graphql/queries";

export default function PetView(props) {
  let { petId } = useParams();
  const [pet, setPet] = useState({});
  const [visits, setVisits] = useState([]);
  const [vet, setVet] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const pet = await getPet(petId);
      if (pet?.data?.getPet) {
        setPet(pet?.data?.getPet);
      }
    })();
    (async () => {
      const pet = await listVisitsByPetId(petId);
      if (pet?.data?.listVisits?.items) {
        setVisits(pet?.data?.listVisits?.items);
      }
    })();
  }, [petId]);

  useEffect(() => {
    (async () => {
      if (pet?.petVetId) {
        const vet = await getVet(pet.petVetId);
        if (vet?.data?.getVet) {
          setVet(vet?.data?.getVet);
        }
      }
    })();
  }, [pet]);

  return (
    <Container style={{ maxWidth: 700, marginTop: 35, marginBottom: 150 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <h3 style={{ flex: 1 }}>{pet.name}</h3>
      </div>
      <p>
        {dayjs().diff(dayjs(pet.birthday), "year")} year old {pet.breed} {pet.species}
      </p>
      <h5 style={{ margin: "35px 0px 8px 0px", flex: 1 }}>Primary vet</h5>
      <p>
        <b>Dr. {vet.name}</b>
        <br />
        Specialty: {vet.specialty}
      </p>
      <h5 style={{ margin: "35px 0px 8px 0px", flex: 1 }}>Visits</h5>

      {visits.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <h6 style={{ margin: "20px 0px 0px 0px" }}>Nothing's here</h6>
          <p style={{ fontSize: 100 }}>🕸</p>
        </div>
      ) : (
        <div>
          {visits.map &&
            visits.map((v) => (
              <div className="listed-item-container" onClick={() => v.id && navigate(`/patient/visits/${v.id}`)}>
                <h6>{dayjs(v.visitTime).format("MM/DD/YYYY h:mm A")}</h6>
                <p>
                  <b>Visit reason:</b> {v.visitReason}
                </p>
                <p style={{ marginBottom: 0 }}>
                  <b>Visit notes:</b> {v.visitNotes}
                </p>
              </div>
            ))}
        </div>
      )}
    </Container>
  );
}
