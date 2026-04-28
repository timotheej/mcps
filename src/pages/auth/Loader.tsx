import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";

/**
 * Écran de chargement après retour PSC.
 * Bascule vers la vérification du référentiel après 2s (maquette).
 */
export function Loader() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = window.setTimeout(() => {
      navigate("/auth/onboarding/verification");
    }, 2000);
    return () => window.clearTimeout(t);
  }, [navigate]);

  return (
    <div className="maq-auth-loader">
      <div
        className="maq-auth-loader__spinner"
        role="status"
        aria-live="polite"
      >
        <span className="fr-icon-refresh-line" aria-hidden="true" />
        <span className="fr-sr-only">Chargement en cours</span>
      </div>
      <p className={fr.cx("fr-h5", "fr-mt-3w", "fr-mb-1w")}>
        Connexion en cours…
      </p>
      <p
        className={`${fr.cx("fr-text--sm", "fr-mb-0")} fr-text-mention--grey`}
      >
        Nous vérifions vos informations professionnelles.
      </p>
    </div>
  );
}
