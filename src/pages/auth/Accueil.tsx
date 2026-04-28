import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { ProSanteConnectButton } from "../../components/ProSanteConnectButton";
import { InfoTile } from "../../components/InfoTile";

export function Accueil() {
  const navigate = useNavigate();

  function handleConnect() {
    navigate("/auth/chargement");
  }

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      {/* Bloc 1 — Hero + PSC */}
      <div className={fr.cx("fr-grid-row", "fr-grid-row--center")}>
        <div className={fr.cx("fr-col-12", "fr-col-md-10", "fr-col-lg-8")}>
          <h1 className={fr.cx("fr-h2", "fr-mb-2w")}>
            Votre espace de suivi de la certification périodique
          </h1>
          <p
            className={`${fr.cx("fr-text--lead", "fr-mb-5w")} fr-text-mention--grey`}
          >
            Ma Certif' Pro Santé est le service en ligne qui vous permet de
            suivre votre obligation de certification, déclarer vos actions
            et télécharger votre synthèse.
          </p>

          <div className="maq-auth-psc-card">
            <ProSanteConnectButton onClick={handleConnect} />
            <Accordion label="Qu'est-ce que Pro Santé Connect ?">
              <p className={fr.cx("fr-mb-1w")}>
                Pro Santé Connect est le service d'authentification officiel
                des professionnels de santé, géré par l'Agence du Numérique
                en Santé. Il utilise votre carte CPS ou l'application e-CPS
                sur smartphone.
              </p>
              <p className={fr.cx("fr-mb-0")}>
                <a
                  className={fr.cx(
                    "fr-link",
                    "fr-link--icon-right",
                    "fr-icon-external-link-line"
                  )}
                  href="https://esante.gouv.fr/produits-services/pro-sante-connect"
                  target="_blank"
                  rel="noreferrer"
                >
                  En savoir plus sur esante.gouv.fr
                </a>
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Bloc 2 — Explication certification */}
      <div className={fr.cx("fr-mt-8w", "fr-mb-5w")}>
        <h2 className={fr.cx("fr-h4", "fr-mb-3w")}>
          Qu'est-ce que la certification périodique ?
        </h2>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-12", "fr-col-sm-6", "fr-col-md-3")}>
            <InfoTile
              num="4"
              label="axes à couvrir"
              desc="Connaissances, pratiques, relation patient, santé du PS"
            />
          </div>
          <div className={fr.cx("fr-col-12", "fr-col-sm-6", "fr-col-md-3")}>
            <InfoTile
              num="8"
              label="actions minimum"
              desc="Au moins 2 actions par axe sur votre cycle"
            />
          </div>
          <div className={fr.cx("fr-col-12", "fr-col-sm-6", "fr-col-md-3")}>
            <InfoTile
              num="6 à 9"
              label="ans de cycle"
              desc="9 ans pour les PS en exercice avant 2023, 6 ans pour les nouveaux inscrits"
            />
          </div>
          <div className={fr.cx("fr-col-12", "fr-col-sm-6", "fr-col-md-3")}>
            <InfoTile
              num="7"
              label="professions concernées"
              desc="Les professions de santé soumises à l'obligation"
            />
          </div>
        </div>
      </div>

      {/* Bloc 3 — Liens tertiaires */}
      <ul className="maq-auth-links">
        <li>
          <a
            className={fr.cx(
              "fr-link",
              "fr-link--icon-right",
              "fr-icon-external-link-line"
            )}
            href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072665/LEGISCTA000046355069/"
            target="_blank"
            rel="noreferrer"
          >
            Cadre légal de la certification périodique (Légifrance)
          </a>
        </li>
        <li>
          <a
            className={fr.cx(
              "fr-link",
              "fr-link--icon-right",
              "fr-icon-external-link-line"
            )}
            href="https://esante.gouv.fr"
            target="_blank"
            rel="noreferrer"
          >
            Le dispositif sur esante.gouv.fr
          </a>
        </li>
      </ul>
    </div>
  );
}
