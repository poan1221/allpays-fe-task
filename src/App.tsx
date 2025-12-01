import "@/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "@/Home";

function App() {
  return (
    <Router>
      <div className="max-w-7xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
