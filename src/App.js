import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { ToastContainer, toast } from "react-toastify";


function App() {
  return (
    <>
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Signup />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        
      </Routes>
    </Router>
    </>
    
  );
}

export default App;
