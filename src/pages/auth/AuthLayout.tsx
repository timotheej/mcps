import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import type { ReactNode } from "react";
import "./auth.css";

export type AuthLayoutMode = "deconnecte" | "masque" | "connecte-sans-nav";

type Props = {
  mode: AuthLayoutMode;
  userName?: string;
  children?: ReactNode;
};

/**
 * Layout du parcours d'authentification.
 * - deconnecte : page publique (accueil, erreur auth, non éligible)
 * - masque : plein écran sans chrome (écran de chargement)
 * - connecte-sans-nav : PS identifié mais pas encore dans l'app (parcours onboarding)
 */
export function AuthLayout({ mode, userName, children }: Props) {
  const navigate = useNavigate();

  if (mode === "masque") {
    return (
      <main role="main" id="content">
        {children ?? <Outlet />}
      </main>
    );
  }

  const quickAccessItems =
    mode === "connecte-sans-nav" && userName
      ? [
          headerFooterDisplayItem,
          {
            iconId: "fr-icon-account-line" as const,
            text: userName,
            linkProps: { to: "#", onClick: (e: React.MouseEvent) => e.preventDefault() },
          },
          {
            iconId: "fr-icon-logout-box-r-line" as const,
            text: "Se déconnecter",
            buttonProps: {
              onClick: () => navigate("/"),
            },
          },
        ]
      : [headerFooterDisplayItem];

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header
        brandTop={
          <>
            RÉPUBLIQUE
            <br />
            FRANÇAISE
          </>
        }
        serviceTitle="Ma Certif' Pro Santé"
        serviceTagline="Suivez votre certification périodique"
        homeLinkProps={{
          to: "/",
          title: "Accueil — Ma Certif' Pro Santé",
        }}
        quickAccessItems={quickAccessItems}
      />
      <main role="main" id="content" style={{ flex: 1 }}>
        {children ?? <Outlet />}
      </main>
      <Footer
        accessibility="non compliant"
        contentDescription="Ma Certif' Pro Santé — Service en ligne de l'Agence du Numérique en Santé pour suivre votre certification périodique."
        bottomItems={[headerFooterDisplayItem]}
      />
    </div>
  );
}
