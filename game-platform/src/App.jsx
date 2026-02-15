import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile"; 



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
