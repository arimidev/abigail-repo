import { combineReducers, configureStore } from "@reduxjs/toolkit";
import token_slice from "./features/token";
import { app_api } from "./api_slice";
import { setupListeners } from "@reduxjs/toolkit/query";
import temporary_token from "./features/temporary_token";
import screen from "./features/screen";
import user from "./features/user";
import seen_posts from "./features/seen_posts";
import seen_users from "./features/seen_users";
import saved_tokens from "./features/saved_tokens";
import * as SecureStore from "expo-secure-store";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const ensureValidKey = (key) => {
  if (!/^[\w.-]+$/.test(key)) {
    // Replace invalid characters with "_"
    return key.replace(/[^a-zA-Z0-9.-]/g, "_");
  }
  return key;
};

const storage = {
  setItem: async (key, value) => {
    await SecureStore.setItemAsync(ensureValidKey(key), value);
  },
  getItem: async (key) => {
    console.log("auth key: ", ensureValidKey(key));
    const value = await SecureStore.getItemAsync(ensureValidKey(key));
    console.log("auth value: ", value);
    return value;
  },
  removeItem: async (key) => {
    await SecureStore.deleteItemAsync(ensureValidKey(key));
  },
};

const persistConfig = {
  key: ensureValidKey("root"),
  storage,
  whitelist: ["token_slice"],
};

const reducers = combineReducers({
  token_slice,
  temporary_token,
  screen,
  user,
  saved_tokens,
  seen_posts,
  seen_users,
  [app_api.reducerPath]: app_api.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

// export const store = configureStore({
//   reducer: {
//     token_slice,
//     temporary_token,
//     screen,
//     user,
//     [app_api.reducerPath]: app_api.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(app_api.middleware),
// });

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(app_api.middleware),
});

const persistor = persistStore(store);
export { store, persistor };
setupListeners(store.dispatch);
