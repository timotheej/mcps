import { useEffect, useReducer, useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { Tile } from "@codegouvfr/react-dsfr/Tile";
import Avatar from "@codegouvfr/react-dsfr/picto/Avatar";
import Book from "@codegouvfr/react-dsfr/picto/Book";
import FlowSettings from "@codegouvfr/react-dsfr/picto/FlowSettings";
import Information from "@codegouvfr/react-dsfr/picto/Information";
import {
  profileMock,
  ORDRES,
  getPublicProfession,
  setPublicProfession,
  type Ordre,
} from "../data/maquette";
import { CONTACTS_BY_PROFESSION } from "../data/interlocuteurs";
import "./ContactModal.css";

export type ContactTarget = "ordre" | "cnp" | "both" | "ans" | "dpo";

const MCPS_SUPPORT_EMAIL = "support-mcps@esante.gouv.fr";
const DPO_EMAIL = "dpo@esante.gouv.fr";

const MEDECIN_KEYS = new Set(["medecin"]);

// ─── State externe partagé (paramètre du dernier open()) ────────────
// react-dsfr createModal expose un .open() sans paramètres. Pour passer
// un target + un éventuel hint de profession, on porte ce state hors
// React via un mini observable.
type ContactModalState = {
  target: ContactTarget;
  /** Profession imposée par l'appelant (typiquement profileMock côté
   *  utilisateur connecté). Si défini, on n'affiche pas le sélecteur. */
  professionHint?: string;
};

let currentState: ContactModalState = { target: "ordre" };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function setState(next: ContactModalState) {
  currentState = next;
  notify();
}

function useContactModalState() {
  const [, force] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    listeners.add(force);
    return () => {
      listeners.delete(force);
    };
  }, []);
  return currentState;
}

// ─── Modale singleton DSFR ──────────────────────────────────────────

const modal = createModal({
  id: "contact-modal",
  isOpenedByDefault: false,
});

/** API publique : ouvre la modale avec le target voulu. */
export function openContactModal(
  target: ContactTarget,
  professionHint?: string
): void {
  setState({ target, professionHint });
  modal.open();
}

// ─── Helpers ────────────────────────────────────────────────────────

function getCnpFromProfessionKey(key: string) {
  // Mapping key (ORDRES) → id (CONTACTS_BY_PROFESSION).
  const idMap: Record<string, string> = {
    medecin: "medecins",
    "chirurgien-dentiste": "chirurgiens-dentistes",
    "sage-femme": "sages-femmes",
    pharmacien: "pharmaciens",
    infirmier: "infirmiers",
    "masseur-kinesitherapeute": "masseurs-kine",
    "pedicure-podologue": "podologues",
  };
  const id = idMap[key];
  return CONTACTS_BY_PROFESSION.find((p) => p.id === id) || null;
}

const PROFESSION_OPTIONS = [
  { value: "medecin", label: "Médecin" },
  { value: "chirurgien-dentiste", label: "Chirurgien-dentiste" },
  { value: "sage-femme", label: "Sage-femme" },
  { value: "pharmacien", label: "Pharmacien" },
  { value: "infirmier", label: "Infirmier" },
  { value: "masseur-kinesitherapeute", label: "Masseur-kinésithérapeute" },
  { value: "pedicure-podologue", label: "Pédicure-podologue" },
];

// ─── Tiles ──────────────────────────────────────────────────────────

function OrdreTile({ ordre }: { ordre: Ordre }) {
  return (
    <Tile
      title={ordre.nom}
      titleAs="h3"
      desc={ordre.siteLabel}
      detail="Votre Ordre"
      pictogram={<Avatar />}
      orientation="horizontal"
      enlargeLinkOrButton
      linkProps={{
        href: ordre.site,
        target: "_blank",
        rel: "noreferrer",
      }}
    />
  );
}

function CnpTile({ professionKey }: { professionKey: string }) {
  const cnp = getCnpFromProfessionKey(professionKey);
  const isMedecin = MEDECIN_KEYS.has(professionKey);
  const ordre = ORDRES[professionKey];

  if (isMedecin && ordre) {
    return (
      <Tile
        title="Plusieurs CNP selon votre spécialité"
        titleAs="h3"
        desc="Il existe une quarantaine de CNP médecins. Votre Ordre vous orientera vers le bon interlocuteur selon votre spécialité (cardiologie, dermato-vénérologie, gynécologie…)."
        detail="Votre CNP"
        pictogram={<Book />}
        orientation="horizontal"
        enlargeLinkOrButton
        linkProps={{
          href: ordre.site,
          target: "_blank",
          rel: "noreferrer",
        }}
      />
    );
  }

  if (!cnp) {
    return (
      <Tile
        title="Contactez votre CNP via votre Ordre"
        titleAs="h3"
        desc="Les coordonnées de votre Conseil National Professionnel sont disponibles auprès de votre Ordre."
        detail="Votre CNP"
        pictogram={<Book />}
        orientation="horizontal"
        noBorder
      />
    );
  }

  if (cnp.cnp.site) {
    return (
      <Tile
        title={cnp.cnp.nom}
        titleAs="h3"
        desc="Site officiel"
        detail="Votre CNP"
        pictogram={<Book />}
        orientation="horizontal"
        enlargeLinkOrButton
        linkProps={{
          href: cnp.cnp.site,
          target: "_blank",
          rel: "noreferrer",
        }}
      />
    );
  }

  return (
    <Tile
      title={cnp.cnp.nom}
      titleAs="h3"
      desc="Coordonnées disponibles auprès de votre Ordre."
      detail="Votre CNP"
      pictogram={<Book />}
      orientation="horizontal"
    />
  );
}

function AnsBlock() {
  return (
    <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
      <div className={fr.cx("fr-col-12")}>
        <Tile
          title="Support Ma Certif' Pro Santé"
          titleAs="h3"
          desc={`Bug, anomalie ou question sur la plateforme : ${MCPS_SUPPORT_EMAIL}`}
          detail="Équipe MCPS (ANS)"
          pictogram={<FlowSettings />}
          orientation="horizontal"
          enlargeLinkOrButton
          linkProps={{ href: `mailto:${MCPS_SUPPORT_EMAIL}` }}
        />
      </div>
      <div className={fr.cx("fr-col-12")}>
        <Tile
          title="Aide Pro Santé Connect"
          titleAs="h3"
          desc="Problème de connexion ou de carte CPS / e-CPS : assistance officielle PSC."
          detail="esante.gouv.fr"
          pictogram={<Information />}
          orientation="horizontal"
          enlargeLinkOrButton
          linkProps={{
            href: "https://esante.gouv.fr/produits-services/pro-sante-connect",
            target: "_blank",
            rel: "noreferrer",
          }}
        />
      </div>
    </div>
  );
}

function DpoBlock() {
  return (
    <Tile
      title="Délégué à la protection des données"
      titleAs="h3"
      desc={`Pour exercer vos droits RGPD (accès, rectification, opposition, suppression) : ${DPO_EMAIL}`}
      detail="DPO de l'ANS"
      pictogram={<Information />}
      orientation="horizontal"
      enlargeLinkOrButton
      linkProps={{ href: `mailto:${DPO_EMAIL}` }}
    />
  );
}

// ─── Titre et sous-titre par target ────────────────────────────────

function getModalTitle(target: ContactTarget): string {
  switch (target) {
    case "ordre":
      return "Contacter votre Ordre";
    case "cnp":
      return "Contacter votre CNP";
    case "both":
      return "Vos points de contact";
    case "ans":
      return "Contacter l'équipe Ma Certif' Pro Santé";
    case "dpo":
      return "Contacter le DPO de l'ANS";
  }
}

function getModalIntro(target: ContactTarget): string {
  switch (target) {
    case "ordre":
      return "Pour toute question sur vos informations personnelles (nom, RPPS, profession, spécialité), votre Ordre est votre interlocuteur.";
    case "cnp":
      return "Pour toute question sur le contenu de votre référentiel ou les actions éligibles, votre Conseil National Professionnel est votre interlocuteur.";
    case "both":
      return "Selon votre question, contactez votre Ordre (données personnelles, cycle) ou votre CNP (référentiel, actions).";
    case "ans":
      return "L'équipe technique de l'Agence du Numérique en Santé traite les questions liées à l'outil.";
    case "dpo":
      return "Pour les questions relatives à la protection de vos données personnelles.";
  }
}

// ─── Composant principal ───────────────────────────────────────────

export function ContactModal() {
  const { target, professionHint } = useContactModalState();

  // Résolution de la profession effective :
  // 1. hint (typiquement profileMock côté connecté)
  // 2. choix public en sessionStorage
  // 3. sélecteur intégré
  const hintKey = professionHint
    ? PROFESSION_OPTIONS.find(
        (o) =>
          o.value === professionHint.toLowerCase() ||
          o.label.toLowerCase() === professionHint.toLowerCase()
      )?.value
    : undefined;

  // Détection si la profession vient bien de profileMock (utilisateur
  // connecté). Si oui, on ne propose pas de changer.
  const isConnected =
    professionHint != null && professionHint === profileMock.profession;

  const [selectedProfession, setSelectedProfession] = useState<string>(
    () => hintKey || getPublicProfession() || ""
  );

  // Recalcul si l'open() change le hint
  useEffect(() => {
    if (hintKey) setSelectedProfession(hintKey);
  }, [hintKey]);

  const needsProfession = target === "ordre" || target === "cnp" || target === "both";
  const effectiveProfession = selectedProfession || hintKey || "";
  const ordre = effectiveProfession ? ORDRES[effectiveProfession] : null;

  function handleSelectProfession(value: string) {
    setSelectedProfession(value);
    if (value && !isConnected) {
      setPublicProfession(value);
    }
  }

  return (
    <modal.Component title={getModalTitle(target)}>
      <p className={fr.cx("fr-text--md", "fr-mb-3w")}>
        {getModalIntro(target)}
      </p>

      {/* Sélecteur de profession — uniquement si pertinent et inconnu */}
      {needsProfession && !isConnected && (
        <div className={fr.cx("fr-mb-3w")}>
          <Select
            label="Votre profession"
            hint="Pour vous indiquer les bons contacts."
            nativeSelectProps={{
              value: selectedProfession,
              onChange: (e) => handleSelectProfession(e.target.value),
            }}
            placeholder="Sélectionnez votre profession"
            options={PROFESSION_OPTIONS}
          />
        </div>
      )}

      {/* Contenu paramétré */}
      {target === "ordre" && effectiveProfession && ordre && (
        <OrdreTile ordre={ordre} />
      )}

      {target === "cnp" && effectiveProfession && (
        <CnpTile professionKey={effectiveProfession} />
      )}

      {target === "both" && effectiveProfession && ordre && (
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-12")}>
            <OrdreTile ordre={ordre} />
          </div>
          <div className={fr.cx("fr-col-12")}>
            <CnpTile professionKey={effectiveProfession} />
          </div>
        </div>
      )}

      {target === "ans" && <AnsBlock />}
      {target === "dpo" && <DpoBlock />}

      {/* Message d'attente si profession requise mais inconnue */}
      {needsProfession && !effectiveProfession && (
        <div className="contact-modal__placeholder">
          <span className="fr-icon-arrow-up-line" aria-hidden="true" />
          <p className={fr.cx("fr-text--sm", "fr-mb-0")}>
            Sélectionnez votre profession ci-dessus pour afficher vos
            contacts.
          </p>
        </div>
      )}
    </modal.Component>
  );
}
