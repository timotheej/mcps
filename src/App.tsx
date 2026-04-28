import { Routes, Route, Navigate } from "react-router-dom";
import { MaquetteLayout } from "./pages/maquette/MaquetteLayout";
import { Dashboard } from "./pages/maquette/Dashboard";
import { AxeDetail } from "./pages/maquette/AxeDetail";
import { ReferentielComplet } from "./pages/maquette/ReferentielComplet";
import { Declaration } from "./pages/maquette/Declaration";
import { Synthese } from "./pages/maquette/Synthese";
import { Success } from "./pages/maquette/Success";
import { AxeDetailTabs } from "./pages/maquette/AxeDetailTabs";
import { ReferentielPublicIndex } from "./pages/maquette/ReferentielPublicIndex";

import { AuthLayout } from "./pages/auth/AuthLayout";
import { Accueil } from "./pages/auth/Accueil";
import { Loader } from "./pages/auth/Loader";
import { Verification } from "./pages/auth/Verification";
import { ReferentielIndisponible } from "./pages/auth/ReferentielIndisponible";
import { CGU } from "./pages/auth/CGU";
import { Themes } from "./pages/auth/Themes";
import { ErreurAuth } from "./pages/auth/ErreurAuth";
import { NonEligible } from "./pages/auth/NonEligible";
import { profileMock } from "./data/maquette";

const userFullName = `${profileMock.prenom} ${profileMock.nom}`;

export function App() {
  return (
    <Routes>
      {/* ─── Parcours auth public ─── */}
      <Route element={<AuthLayout mode="deconnecte" />}>
        <Route path="/" element={<Accueil />} />
        <Route path="/auth/erreur" element={<ErreurAuth />} />
        <Route path="/auth/non-eligible" element={<NonEligible />} />
      </Route>

      {/* ─── Ecran de chargement plein ecran ─── */}
      <Route element={<AuthLayout mode="masque" />}>
        <Route path="/auth/chargement" element={<Loader />} />
      </Route>

      {/* ─── Parcours onboarding (PS identifie) ─── */}
      <Route
        element={<AuthLayout mode="connecte-sans-nav" userName={userFullName} />}
      >
        <Route
          path="/auth/onboarding/verification"
          element={<Verification />}
        />
        <Route
          path="/auth/onboarding/indisponible"
          element={<ReferentielIndisponible />}
        />
        <Route path="/auth/onboarding/cgu" element={<CGU />} />
        <Route path="/auth/onboarding/themes" element={<Themes />} />
      </Route>

      {/* ─── Espace applicatif (MaquetteLayout) ─── */}
      <Route element={<MaquetteLayout />}>
        <Route path="/referentiel" element={<ReferentielPublicIndex />} />
        <Route
          path="/referentiel/:id"
          element={<ReferentielComplet mode="public" />}
        />
        <Route path="/maquette/tableau-de-bord" element={<Dashboard />} />
        <Route
          path="/maquette/tableau-de-bord/vierge"
          element={<Dashboard mockState="vierge" />}
        />
        <Route
          path="/maquette/tableau-de-bord/complet"
          element={<Dashboard mockState="complet" />}
        />
        <Route
          path="/maquette/tableau-de-bord/depassement"
          element={<Dashboard mockState="depassement" />}
        />
        <Route
          path="/maquette/tableau-de-bord/cycle-2"
          element={<Dashboard mockState="cycle-2" />}
        />
        <Route path="/maquette/axe/:id" element={<AxeDetail />} />
        <Route path="/maquette/axe-test/:id" element={<AxeDetailTabs />} />
        <Route
          path="/maquette/axe/:id/referentiel"
          element={<ReferentielComplet />}
        />
        <Route path="/maquette/declarer" element={<Declaration />} />
        <Route path="/maquette/synthese" element={<Synthese />} />
        <Route path="/maquette/succes" element={<Success />} />
      </Route>

      {/* ─── Redirects legacy ─── */}
      <Route path="/maquette" element={<Navigate to="/" replace />} />
      <Route
        path="/maquette/onboarding"
        element={<Navigate to="/auth/onboarding/verification" replace />}
      />
    </Routes>
  );
}
