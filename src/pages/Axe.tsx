import { useParams, Navigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { getAxe, statutAxe, libelleStatut } from "../data/axes";
import "./Axe.css";

export function Axe() {
  const { numero } = useParams<{ numero: string }>();
  const num = Number(numero);
  const axe = getAxe(num);

  if (!axe) {
    return <Navigate to="/tableau-de-bord" replace />;
  }

  const statut = statutAxe(axe);
  const actionsRestantes = Math.max(0, axe.minimum - axe.actionsDeclarees.length);

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <Breadcrumb
        currentPageLabel={`Axe ${axe.numero}`}
        homeLinkProps={{ to: "/" }}
        segments={[
          {
            label: "Tableau de bord",
            linkProps: { to: "/tableau-de-bord" },
          },
          {
            label: "Mon referentiel",
            linkProps: { to: "/referentiel" },
          },
        ]}
      />

      {/* Zone 1 — Titre de l'axe */}
      <div className={fr.cx("fr-grid-row")}>
        <div className={fr.cx("fr-col-12", "fr-col-lg-10")}>
          <p className={fr.cx("fr-text--sm", "fr-mb-1v", "fr-text-mention--grey")}>
            Axe {axe.numero} de votre certification
          </p>
          <h1 className={fr.cx("fr-mb-2w")}>{axe.intitule}</h1>
          <p className={fr.cx("fr-text--lead", "fr-mb-0")}>{axe.cadre}</p>
        </div>
      </div>

      {/* Zone 2 — Etat de l'axe */}
      <div
        className={fr.cx(
          "fr-grid-row",
          "fr-grid-row--gutters",
          "fr-mt-5w"
        )}
      >
        <div className={fr.cx("fr-col-12", "fr-col-md-8")}>
          <div className={`mcps-axe-state mcps-axe-state--${statut}`}>
            <div className={fr.cx("fr-mb-2w")}>
              {statut === "couvert" ? (
                <Badge severity="success">{libelleStatut(statut)}</Badge>
              ) : statut === "en-cours" ? (
                <Badge severity="new">{libelleStatut(statut)}</Badge>
              ) : (
                <Badge>{libelleStatut(statut)}</Badge>
              )}
            </div>
            <p className={fr.cx("fr-h5", "fr-mb-1w")}>
              {axe.actionsDeclarees.length} action
              {axe.actionsDeclarees.length > 1 ? "s" : ""} declaree
              {axe.actionsDeclarees.length > 1 ? "s" : ""} sur {axe.minimum}{" "}
              minimum
            </p>
            <p className={fr.cx("fr-text--sm", "fr-mb-0", "fr-text-mention--grey")}>
              {statut === "couvert"
                ? "Cet axe est couvert pour votre cycle. Vous pouvez continuer a declarer des actions si vous le souhaitez."
                : actionsRestantes === 1
                ? "Il vous reste 1 action a declarer pour couvrir cet axe."
                : `Il vous reste ${actionsRestantes} actions a declarer pour couvrir cet axe.`}
            </p>
          </div>
        </div>
        <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
          <div className="mcps-axe-invitation">
            <p className={fr.cx("fr-text--sm", "fr-mb-3w")}>
              {statut === "couvert"
                ? "Une action recente a rattacher a cet axe, en plus ?"
                : axe.invitation}
            </p>
            <Button
              priority="primary"
              linkProps={{
                to: `/referentiel/axe/${axe.numero}/declarer`,
              }}
            >
              Declarer une action
            </Button>
          </div>
        </div>
      </div>

      {/* Zone 3 — Mes actions deja declarees pour cet axe */}
      <h2 className={fr.cx("fr-h4", "fr-mt-6w", "fr-mb-2w")}>
        Vos actions declarees pour cet axe
      </h2>
      {axe.actionsDeclarees.length === 0 ? (
        <p className={fr.cx("fr-text--sm", "fr-text-mention--grey")}>
          Vous n'avez encore declare aucune action pour cet axe. Consultez
          ci-dessous les types d'actions possibles pour vous orienter.
        </p>
      ) : (
        <Table
          headers={["Date", "Action", "Origine", "Source"]}
          data={axe.actionsDeclarees.map((a) => [
            a.date,
            a.libelle,
            a.origine,
            a.source,
          ])}
          bordered
        />
      )}

      {/* Zone 4 — Catalogue des actions possibles */}
      <h2 className={fr.cx("fr-h4", "fr-mt-6w", "fr-mb-1w")}>
        Actions possibles pour cet axe
      </h2>
      <p className={fr.cx("fr-text--sm", "fr-mb-3w", "fr-text-mention--grey")}>
        Ce catalogue presente les types d'actions reconnus pour cet axe par le
        Conseil National Professionnel de votre specialite. Il est indicatif —
        vous pouvez egalement declarer une action libre si celle que vous avez
        realisee n'y figure pas.
      </p>
      <Table
        headers={["Nature", "Libelle", "Format", "Duree"]}
        data={axe.catalogue.map((c) => [
          c.nature,
          c.libelle,
          c.format,
          c.duree,
        ])}
        bordered
      />

      {/* Zone 5 — Retour */}
      <div className={fr.cx("fr-mt-6w")}>
        <Button
          priority="tertiary"
          iconId="fr-icon-arrow-left-line"
          iconPosition="left"
          linkProps={{ to: "/tableau-de-bord" }}
        >
          Retour au tableau de bord
        </Button>
      </div>
    </div>
  );
}
