import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles/index.css";
import initializeToken from './utils/initializeToken';

initializeToken();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);