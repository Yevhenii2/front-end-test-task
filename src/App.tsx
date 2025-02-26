import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./app/home";
import StoreProvider from "./components/StoreProvider";
import UIProvider from "./components/UIProvider";
import SignInPage from "./app/signIn";
import { useAppSelector } from "./store/store";
import DarkModeToggle from "./components/DarkModeToggle";

const App = () => {
	return (
		<StoreProvider>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							<PageWrapper>
								<HomePage />
							</PageWrapper>
						}
					/>
					<Route
						path="/sign-in"
						element={
							<PageWrapper>
								<SignInPage />
							</PageWrapper>
						}
					/>
				</Routes>
			</BrowserRouter>
		</StoreProvider>
	);
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
	const isDarkMode = useAppSelector((state) => state.darkMode.isDarkMode);
	
	return <div className={isDarkMode ? "dark bg-gray-900 text-white" : ""}>
			<UIProvider>
				<DarkModeToggle />
				{children}
			</UIProvider>
		</div>;
};

export default App;
