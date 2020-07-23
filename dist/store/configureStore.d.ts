/// <reference types="redux-persist/types/persistreducer" />
/// <reference types="redux-persist/types/types" />
/// <reference types="redux-persist" />
export declare const defaultStore: import("redux").Store<import("redux-persist/es/persistReducer").PersistPartial, import("redux").Action<any>> & {
    dispatch: unknown;
};
export declare const persistor: import("redux-persist").Persistor;
