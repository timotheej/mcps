import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { profileMock, loadSelectedThemes } from "../../data/maquette";
import "./maquette.css";

export function Auth() {
  const navigate = useNavigate();

  function handleConnect() {
    const themes = loadSelectedThemes();
    if (themes) {
      navigate("/maquette/tableau-de-bord");
    } else {
      navigate("/maquette/onboarding");
    }
  }

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <div className="maq-auth">
        <div className="maq-auth__logo">
          <span className="fr-icon-heart-pulse-line" aria-hidden="true" />{" "}
          Ma Certif' Pro Sante
        </div>
        <h1 className="maq-auth__title">
          Bienvenue, {profileMock.prenom} {profileMock.nom}
        </h1>
        <p className="maq-auth__subtitle">
          {profileMock.specialite} — RPPS {profileMock.rpps}
        </p>
        <div className="maq-auth__psc">
          <Button priority="primary" size="large" onClick={handleConnect}>
            Se connecter avec Pro Sante Connect
          </Button>
          <span className="maq-auth__psc-label">
            Connexion simulee — accedez a votre espace
          </span>
        </div>
      </div>
    </div>
  );
}
