import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { loadSelectedThemes } from "../../data/maquette";

export function MaquetteLayout() {
  const location = useLocation();
  const hasThemes = loadSelectedThemes() !== null;

  const navigation = hasThemes
    ? [
        {
          text: "Tableau de bord",
          linkProps: { to: "/maquette/tableau-de-bord" },
          isActive: location.pathname === "/maquette/tableau-de-bord",
        },
        {
          text: "Mon referentiel",
          linkProps: { to: "/maquette/axe/axe-1/referentiel" },
          isActive: location.pathname.includes("/referentiel"),
        },
      ]
    : [];

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header
        brandTop={
          <>
            REPUBLIQUE
            <br />
            FRANCAISE
          </>
        }
        serviceTitle="Ma Certif' Pro Sante"
        serviceTagline="Maquette — Onboarding themes preferentiels"
        homeLinkProps={{
          to: "/maquette",
          title: "Accueil - Ma Certif' Pro Sante",
        }}
        navigation={navigation}
        quickAccessItems={[headerFooterDisplayItem]}
      />
      <main role="main" id="content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer
        accessibility="non compliant"
        contentDescription="Maquette interactive MCPS — Prototype de test"
        bottomItems={[headerFooterDisplayItem]}
      />
    </div>
  );
}
