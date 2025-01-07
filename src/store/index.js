import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import localforage from "localforage";
import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import designerReducer from "./slices/designersSlice";
import { designersApi } from "./api/designersApi";
import { fabricsApi } from "./api/GetFabricsData";
import { wishlistApi } from "./api/GetFabricsData";
import { createTransform } from "redux-persist";
import { api } from "./api/api";
// Transform to only persist fetched data from fabricsApi
const fabricsTransform = createTransform(
  (inboundState) => {
    const queries = inboundState.queries || {};
    const transformedQueries = {};

    for (const key in queries) {
      if (queries[key]?.status === "fulfilled") {
        transformedQueries[key] = {
          ...queries[key],
          data: queries[key].data,
        };
      }
    }

    return {
      ...inboundState,
      queries: transformedQueries,
    };
  },
  (outboundState) => outboundState
);

const persistConfig = {
  key: "koutureKonnect",
  storage: localforage,
  transforms: [fabricsTransform],
  blacklist: [wishlistApi.reducerPath],
};

// Root reducer with reset logic
const rootReducer = (state, action) => {
  if (action.type === "RESET_STATE") {
    state = undefined; // Reset state
  }
  return combineReducers({
    auth: authReducer,
    user: userReducer,
    designers: designerReducer,
    [designersApi.reducerPath]: designersApi.reducer,
    [fabricsApi.reducerPath]: fabricsApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [api.reducerPath]: api.reducer,
  })(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(designersApi.middleware)
      .concat(fabricsApi.middleware)
      .concat(wishlistApi.middleware)
      .concat(api.middleware),
});

export const persistor = persistStore(store);
