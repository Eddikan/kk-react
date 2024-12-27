import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default storage (localStorage for web)
import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import designerReducer from "./slices/designersSlice";
import { designersApi } from "./api/designersApi"; // Import RTK Query API
import { fabricsApi } from "./api/GetFabricsData"; // Import RTK Query API
import { wishlistApi } from "./api/GetFabricsData"; // Import RTK Query API
import { createTransform } from 'redux-persist';
// Redux Persist Config
// Transform to only persist fetched data from fabricsApi
const fabricsTransform = createTransform(
  // Transform incoming state (persist only the data)
  (inboundState) => {
    const queries = inboundState.queries || {};
    const transformedQueries = {};

    for (const key in queries) {
      if (queries[key]?.status === 'fulfilled') {
        transformedQueries[key] = {
          ...queries[key],
          data: queries[key].data, // Only store the actual data
        };
      }
    }

    return {
      ...inboundState,
      queries: transformedQueries,
    };
  },
  // Transform outgoing state (rehydrate state as is)
  (outboundState) => outboundState,
  // { whitelist: ['fabricsApi'] } // Apply to fabricsApi only
);

const persistConfig = {
  key: "koutureKonnect",
  storage,
  transforms: [fabricsTransform], // Use the transform
  blacklist: [wishlistApi.reducerPath], // Don't persist these reducers

  
};

// Combine Reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  designers: designerReducer,
  [designersApi.reducerPath]: designersApi.reducer,
  [fabricsApi.reducerPath]: fabricsApi.reducer,
  [wishlistApi.reducerPath]: wishlistApi.reducer,
});

// Persist Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    })
      .concat(designersApi.middleware)
      .concat(fabricsApi.middleware).concat(wishlistApi.middleware)
});

// Persistor
export const persistor = persistStore(store);
