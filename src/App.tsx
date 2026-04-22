import { Routes, Route, Navigate } from "react-router-dom";
import { MaquetteLayout } from "./pages/maquette/MaquetteLayout";
import { Auth } from "./pages/maquette/Auth";
import { Onboarding } from "./pages/maquette/Onboarding";
import { Dashboard } from "./pages/maquette/Dashboard";
import { AxeDetail } from "./pages/maquette/AxeDetail";
import { ReferentielComplet } from "./pages/maquette/ReferentielComplet";
import { Declaration } from "./pages/maquette/Declaration";
import { Synthese } from "./pages/maquette/Synthese";
import { Success } from "./pages/maquette/Success";
import { AxeDetailTabs } from "./pages/maquette/AxeDetailTabs";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/maquette" replace />} />
      <Route element={<MaquetteLayout />}>
        <Route path="/maquette" element={<Auth />} />
        <Route path="/maquette/onboarding" element={<Onboarding />} />
        <Route path="/maquette/tableau-de-bord" element={<Dashboard />} />
        <Route path="/maquette/axe/:id" element={<AxeDetail />} />
        <Route path="/maquette/axe-test/:id" element={<AxeDetailTabs />} />
        <Route path="/maquette/axe/:id/referentiel" element={<ReferentielComplet />} />
        <Route path="/maquette/declarer" element={<Declaration />} />
        <Route path="/maquette/synthese" element={<Synthese />} />
        <Route path="/maquette/succes" element={<Success />} />
      </Route>
    </Routes>
  );
}
