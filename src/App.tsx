import { Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { Accueil } from "./pages/Accueil";
import { TableauDeBord } from "./pages/TableauDeBord";
import { Axe } from "./pages/Axe";
import { MaquetteLayout } from "./pages/maquette/MaquetteLayout";
import { Auth } from "./pages/maquette/Auth";
import { Onboarding } from "./pages/maquette/Onboarding";
import { Dashboard } from "./pages/maquette/Dashboard";
import { AxeDetail } from "./pages/maquette/AxeDetail";
import { ReferentielComplet } from "./pages/maquette/ReferentielComplet";
import { Declaration } from "./pages/maquette/Declaration";
import { Synthese } from "./pages/maquette/Synthese";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Accueil />} />
        <Route path="/tableau-de-bord" element={<TableauDeBord />} />
        <Route path="/referentiel/axe/:numero" element={<Axe />} />
      </Route>
      <Route element={<MaquetteLayout />}>
        <Route path="/maquette" element={<Auth />} />
        <Route path="/maquette/onboarding" element={<Onboarding />} />
        <Route path="/maquette/tableau-de-bord" element={<Dashboard />} />
        <Route path="/maquette/axe/:id" element={<AxeDetail />} />
        <Route path="/maquette/axe/:id/referentiel" element={<ReferentielComplet />} />
        <Route path="/maquette/declarer" element={<Declaration />} />
        <Route path="/maquette/synthese" element={<Synthese />} />
      </Route>
    </Routes>
  );
}
