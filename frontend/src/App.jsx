import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";

import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Main Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* Optional Future Pages */}
            {/* <Route path="/prediction" element={<Prediction />} /> */}
            {/* <Route path="/analytics" element={<Analytics />} /> */}

            {/* 404 Page */}
            <Route path="/404" element={<NotFound />} />

            {/* Redirect Unknown Routes */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
