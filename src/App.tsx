import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PaymentListPage from "@/pages/PaymentListPage";
import DashboardPage from "@/pages/DashBoardPage";

function App() {
  return (
    <Router>
      <div className="max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/payment-list" element={<PaymentListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
