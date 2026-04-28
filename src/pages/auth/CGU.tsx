import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";

export function CGU() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1 className={fr.cx("fr-mb-5w")}>Activation de votre espace</h1>

      <div className="maq-activation-box">
        <Stepper
          currentStep={2}
          stepCount={3}
          title="Conditions"
          nextTitle="Préférences"
        />

        <h2 className={fr.cx("fr-h5", "fr-mb-1w")}>
          Conditions générales d'utilisation
        </h2>
        <p
          className={`${fr.cx("fr-text--sm", "fr-mb-3w")} fr-text-mention--grey`}
        >
          Dernière mise à jour : 12/03/2026
        </p>

        <div
          className="maq-cgu-scroll"
          tabIndex={0}
          role="region"
          aria-label="Texte des conditions générales d'utilisation"
        >
          <h3>Article 1 — Objet</h3>
          <p>
            Les présentes conditions générales d'utilisation (CGU) ont pour
            objet de définir les modalités et les conditions dans lesquelles
            l'Agence du Numérique en Santé (ANS) met à disposition des
            professionnels de santé le service Ma Certif' Pro Santé.
          </p>

          <h3>Article 2 — Accès au service</h3>
          <p>
            L'accès au service est réservé aux professionnels de santé inscrits
            à l'un des sept ordres professionnels soumis à l'obligation de
            certification périodique. L'identification se fait exclusivement
            via Pro Santé Connect.
          </p>

          <h3>Article 3 — Données personnelles</h3>
          <p>
            Les données traitées dans le cadre du service proviennent du
            Répertoire Partagé des Professionnels intervenant dans le système
            de santé (RPPS). Leur traitement respecte le Règlement Général sur
            la Protection des Données (RGPD) et la loi Informatique et
            Libertés.
          </p>

          <h3>Article 4 — Engagements de l'utilisateur</h3>
          <p>
            L'utilisateur s'engage à déclarer des actions réellement réalisées,
            à fournir les justificatifs appropriés et à respecter la
            confidentialité des informations auxquelles il a accès.
          </p>

          <h3>Article 5 — Disponibilité</h3>
          <p>
            L'ANS s'engage à assurer la continuité du service selon des
            objectifs de disponibilité décrits dans le plan d'assurance
            qualité. Des interruptions pour maintenance peuvent survenir et
            seront annoncées le plus tôt possible.
          </p>

          <h3>Article 6 — Évolution des CGU</h3>
          <p>
            Les présentes CGU peuvent être modifiées à tout moment par l'ANS.
            Toute évolution substantielle fera l'objet d'une notification à
            l'utilisateur lors de sa prochaine connexion.
          </p>

          <h3>Article 7 — Propriété intellectuelle</h3>
          <p>
            L'ensemble des éléments du service (textes, logos, images,
            interfaces) est protégé par les droits de propriété intellectuelle.
            Toute reproduction ou utilisation non autorisée est interdite.
          </p>

          <h3>Article 8 — Contact</h3>
          <p>
            Pour toute question relative aux présentes CGU, vous pouvez
            contacter l'ANS via le formulaire disponible sur esante.gouv.fr.
          </p>
        </div>

        <CallOut
          iconId="fr-icon-information-line"
          title="Traitement de vos données"
          className={fr.cx("fr-mt-3w")}
        >
          L'Agence du Numérique en Santé (ANS) est responsable du traitement
          de vos données dans le cadre du service Ma Certif' Pro Santé.{" "}
          <a href="/politique-confidentialite">
            Politique de confidentialité complète
          </a>
        </CallOut>

        <div className={fr.cx("fr-mt-3w")}>
          <Checkbox
            options={[
              {
                label:
                  "J'ai lu et j'accepte les conditions générales d'utilisation de Ma Certif' Pro Santé",
                nativeInputProps: {
                  checked: accepted,
                  onChange: (e) => setAccepted(e.target.checked),
                },
              },
            ]}
          />
        </div>

        <div className="maq-activation-box__actions maq-activation-box__actions--between">
          <Button
            priority="tertiary"
            onClick={() => navigate("/auth/onboarding/verification")}
          >
            Étape précédente
          </Button>
          <Button
            priority="primary"
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            disabled={!accepted}
            onClick={() => navigate("/auth/onboarding/themes")}
          >
            Accepter et continuer
          </Button>
        </div>
      </div>
    </div>
  );
}
