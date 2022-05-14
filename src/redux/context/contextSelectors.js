export const getContextRdx = (state) => state.context;

export const getFatalError = (state) => getContextRdx(state)?.error;
export const getGlobalLoad = (state) => getContextRdx(state)?.globalLoad;
export const getUserInfoRdx = (state) => getContextRdx(state)?.userInfo;
export const getVisitsRdx = (state) => getContextRdx(state)?.visits;
