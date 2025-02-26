import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { catsApi } from "../services/catsService";
import authReducer from "./slices/authSlice";
import darkModeReducer from "./slices/darkModeSlice";

const DEBUG_MODE = +import.meta.env.VITE_DEBUG_MODE;

const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
	const result = next(action);
	if(DEBUG_MODE){
		console.log("Dispatching action:", action);
		console.log("Updated state:", store.getState());
	}
	return result;
};

export const store = configureStore({
	reducer: {
		auth: authReducer,
		darkMode: darkModeReducer, 
		[catsApi.reducerPath]: catsApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(catsApi.middleware, loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;