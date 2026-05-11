import { useNavigate, useSearchParams } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Alert } from "@codegouvfr/react-dsfr/Alert";

type ErrorType = "timeout" | "annulation" | "technique";

const MESSAGES: Record<ErrorType, string> = {
  timeout:
    "Le service Pro Santé Connect a mis trop de temps à répondre. Veuillez réessayer.",
  annulation:
    "Vous avez annulé la connexion. Réessayez pour accéder à votre espace.",
  technique:
    "Une erreur technique est survenue. Si le problème persiste, contactez notre support.",
};

export function ErreurAuth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const type = (params.get("type") as ErrorType) || "technique";
  const message = MESSAGES[type] ?? MESSAGES.technique;

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <div className={fr.cx("fr-grid-row", "fr-grid-row--center")}>
        <div className={fr.cx("fr-col-12", "fr-col-md-10", "fr-col-lg-8")}>
          <Alert
            severity="error"
            closable={false}
            title="La connexion n'a pas abouti"
            description={message}
            className={fr.cx("fr-mb-4w")}
          />

          <Button
            priority="primary"
            iconId="fr-icon-refresh-line"
            iconPosition="left"
            onClick={() => navigate("/auth/chargement")}
          >
            Réessayer la connexion
          </Button>

          <ul className={`maq-auth-links ${fr.cx("fr-mt-5w")}`}>
            <li>
              <a
                className={fr.cx(
                  "fr-link",
                  "fr-link--icon-left",
                  "fr-icon-question-line"
                )}
                href="/aide"
              >
                Besoin d'aide ?
              </a>
            </li>
            <li>
              <a
                className={fr.cx(
                  "fr-link",
                  "fr-link--icon-left",
                  "fr-icon-arrow-left-line"
                )}
                href="/"
              >
                Revenir à l'accueil
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
