import { setGlobalLoad } from "../redux/context/contextSlice";

export async function networkCallWrapper(dispatch, networkCall, failureCall) {
  try {
    dispatch(setGlobalLoad(true));
    await networkCall();
  } catch (error) {
    await failureCall(error);
  } finally {
    dispatch(setGlobalLoad(false));
  }
}
