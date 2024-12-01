import { BrowserRouter } from "react-router-dom";
import LayoutDashboard from "./components/Layout";
import "./App.css";
import { AuthProvider } from "./page/Auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <LayoutDashboard />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
