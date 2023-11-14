import { combineReducers } from "redux";

import authReducer from "./auth.reducer.ts";

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;