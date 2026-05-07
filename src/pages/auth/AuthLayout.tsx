import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer, type FooterProps } from "@codegouvfr/react-dsfr/Footer";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import type { ReactNode } from "react";
import {
  SignalementInfosModal,
  signalementInfosModal,
} from "../../components/SignalementInfosModal";
import "./auth.css";

export type AuthLayoutMode = "deconnecte" | "masque" | "connecte-sans-nav";

type Props = {
  mode: AuthLayoutMode;
  userName?: string;
  children?: ReactNode;
};

const CONTACT_EMAIL = "contact-mcps@esante.gouv.fr";

const operatorLogo = {
  orientation: "horizontal" as const,
  imgUrl: "/operator-logo-ans.svg",
  alt: "ANS — Agence du Numérique en Santé",
};

const footerLinkList: FooterProps.LinkList.List = [
  {
    categoryName: "Ma Certif' Pro Santé",
    links: [
      { text: "Accueil", linkProps: { to: "/" } },
      {
        text: "Consulter les référentiels",
        linkProps: { to: "/referentiel" },
      },
      {
        text: "Nous contacter",
        linkProps: { href: `mailto:${CONTACT_EMAIL}` },
      },
    ],
  },
  {
    categoryName: "Liens utiles",
    links: [
      {
        text: "esante.gouv.fr",
        linkProps: {
          href: "https://esante.gouv.fr",
          target: "_blank" as const,
          rel: "noreferrer",
        },
      },
      {
        text: "Pro Santé Connect",
        linkProps: {
          href: "https://esante.gouv.fr/produits-services/pro-sante-connect",
          target: "_blank" as const,
          rel: "noreferrer",
        },
      },
      {
        text: "Loi du 26 avril 2021",
        linkProps: {
          href: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043407427",
          target: "_blank" as const,
          rel: "noreferrer",
        },
      },
    ],
  },
  {
    categoryName: "Gouvernement",
    links: [
      {
        text: "sante.gouv.fr",
        linkProps: {
          href: "https://sante.gouv.fr",
          target: "_blank" as const,
          rel: "noreferrer",
        },
      },
      {
        text: "service-public.fr",
        linkProps: {
          href: "https://service-public.fr",
          target: "_blank" as const,
          rel: "noreferrer",
        },
      },
      {
        text: "legifrance.gouv.fr",
        linkProps: {
          href: "https://legifrance.gouv.fr",
          target: "_blank" as const,
          rel: "noreferrer",
        },
      },
      {
        text: "info.gouv.fr",
        linkProps: {
          href: "https://info.gouv.fr",
          target: "_blank" as const,
          rel: "noreferrer",
        },
      },
    ],
  },
];

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
      : [
          headerFooterDisplayItem,
          {
            iconId: "fr-icon-lock-line" as const,
            text: "Se connecter",
            linkProps: { to: "/#connexion" },
          },
        ];

  const isConnecte = mode === "connecte-sans-nav";

  const bottomItems = isConnecte
    ? [
        {
          text: "Une donnée incorrecte ?",
          buttonProps: {
            onClick: () => signalementInfosModal.open(),
          },
        },
        headerFooterDisplayItem,
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
        operatorLogo={operatorLogo}
        quickAccessItems={quickAccessItems}
      />
      <main role="main" id="content" style={{ flex: 1 }}>
        {children ?? <Outlet />}
      </main>
      <Footer
        accessibility="non compliant"
        contentDescription="Ma Certif' Pro Santé est le service en ligne de l'Agence du Numérique en Santé pour suivre la certification périodique des professionnels de santé."
        operatorLogo={operatorLogo}
        linkList={footerLinkList}
        bottomItems={bottomItems}
      />
      {isConnecte && <SignalementInfosModal />}
    </div>
  );
}
