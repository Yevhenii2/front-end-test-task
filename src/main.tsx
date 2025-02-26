import ReactDOM from "react-dom/client";
import App from "./App";
import { StrictMode } from "react";
import "./main.css";
import 'react-status-alert/dist/status-alert.css'

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
