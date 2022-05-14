import { setVisits, triggerError } from "../redux/context/contextSlice";
import { networkCallWrapper } from "./serviceUtil";

export async function getVisits(dispatch) {
  const networkCall = async () => {
    const visits = [
      {
        id: "23423412",
        time: "2022-03-20T01:05:49.730Z",
        doctor: "Dr. Vet Project",
        pet: "Tofu",
        remark: "Annual checkup for American short hair"
      },
      {
        id: "3532424",
        time: "2022-03-22T06:05:49.730Z",
        doctor: "Dr. Vet Project",
        pet: "Beans",
        remark: "Annual checkup for American short hair"
      },
      {
        id: "46573452",
        time: "2021-10-31T00:00:00.000Z",
        doctor: "Dr. Vet Project",
        pet: "Bacon",
        remark: "Need vaccinations"
      }
    ];
    dispatch(setVisits(visits));
  };
  const failureCall = async (error) => {
    dispatch(triggerError({ errorType: "FATAL_ERROR", errorId: "ntwk_failure", errorObject: error }));
  };
  networkCallWrapper(dispatch, networkCall, failureCall);
}
