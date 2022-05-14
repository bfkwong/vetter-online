import { initiateUserState, triggerError } from "../redux/context/contextSlice";
import { networkCallWrapper } from "./serviceUtil";

export async function getUserInfo(dispatch, forceUserType) {
  const networkCall = async () => {
    const userInfo = {
      userType: forceUserType ?? "patient",
      userId: "24231532",
      username: "tofu_2020",
      name: "Tofu Kwong"
    };
    dispatch(initiateUserState(userInfo));
  };
  const failureCall = async (error) => {
    dispatch(triggerError({ errorType: "FATAL_ERROR", errorId: "ntwk_failure", errorObject: error }));
  };
  networkCallWrapper(dispatch, networkCall, failureCall);
}
