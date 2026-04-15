import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";

export function Layout() {
  const location = useLocation();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header
        brandTop={
          <>
            REPUBLIQUE
            <br />
            FRANCAISE
          </>
        }
        serviceTitle="mcps"
        serviceTagline="Description du service"
        homeLinkProps={{
          to: "/",
          title: "Accueil - mcps",
        }}
        navigation={[
          {
            text: "Accueil",
            linkProps: { to: "/" },
            isActive: location.pathname === "/",
          },
        ]}
        quickAccessItems={[headerFooterDisplayItem]}
      />
      <main role="main" id="content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer
        accessibility="non compliant"
        contentDescription="mcps"
        bottomItems={[headerFooterDisplayItem]}
      />
    </div>
  );
}
