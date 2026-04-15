import { Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { Accueil } from "./pages/Accueil";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Accueil />} />
        {/* Ajouter les nouvelles routes ici */}
      </Route>
    </Routes>
  );
}
