import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import "./assets/styles/App.css";

import { SearchHistoryProvider } from "./contexts/SearchHistoryContext";

function App() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    /*const fetchData = async () => {
      try {
        const response = await fetch('api 주소');
        const data = await response.json();
        setBoardData(data);
      } catch (error) {
        console.log(error.message);
      }
    }*/
  }, []);

  return (
    <SearchHistoryProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SearchHistoryProvider>
  );
}

export default App;
