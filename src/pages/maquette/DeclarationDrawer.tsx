import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import type { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { Upload } from "@codegouvfr/react-dsfr/Upload";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { MiniRing } from "../../components/MiniRing";
import { openContactModal } from "../../components/ContactModal";
import { ActionSearch } from "./ActionSearch";
import {
  referentiel,
  getAxeById,
  loadActions,
  saveActions,
  getDeclarableActionsForAxe,
  getDeclarableAction,
  getTempsRestant,
  type ActionRealisee,
  type DeclarableAction,
} from "../../data/maquette";
import "./maquette.css";

const MOIS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function formatDateLong(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MOIS_FR[m - 1]} ${y}`;
}

function isoToFr(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

const TODAY_ISO = (() => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
})();

export type DeclarationDrawerProps = {
  open: boolean;
  onClose: () => void;
  /** Pré-sélectionne et verrouille l'axe (entrée B/C) */
  preAxeId?: string;
  /** Pré-sélectionne et verrouille l'action (entrée C) */
  preCode?: string;
  /** Callback déclenché après une déclaration confirmée */
  onDeclared?: (action: ActionRealisee) => void;
};

export function DeclarationDrawer({
  open,
  onClose,
  preAxeId,
  preCode,
  onDeclared,
}: DeclarationDrawerProps) {
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLElement | null>(null);
  const section3Ref = useRef<HTMLElement | null>(null);
  const section4Ref = useRef<HTMLElement | null>(null);

  const preCnpAction = preCode ? getDeclarableAction(preCode) : undefined;
  const effectivePreAxe = preCnpAction?.axeId || preAxeId || "";

  // ─── Mode locks (entry B/C) ─────────────────────────────
  const [axeLocked, setAxeLocked] = useState<boolean>(!!effectivePreAxe);
  const [actionLocked, setActionLocked] = useState<boolean>(!!preCnpAction);
  // Bascule "Choisir manuellement par axe" depuis la recherche.
  // Ignoré en entrée C (preCode) : la cascade est imposée.
  const [manualMode, setManualMode] = useState<boolean>(false);

  // ─── Form state ─────────────────────────────────────────
  const [selectedAxeId, setSelectedAxeId] = useState<string>(effectivePreAxe);
  const [selectedActionCode, setSelectedActionCode] = useState<string>(preCnpAction?.code || "");
  const [titre, setTitre] = useState("");
  const [organisme, setOrganisme] = useState("");
  const [dateRealisation, setDateRealisation] = useState("");
  const [dureeValue, setDureeValue] = useState("");
  const [dureeUnit, setDureeUnit] = useState<"h" | "j">("h");
  const [fileName, setFileName] = useState("");
  const [attHonneurChecked, setAttHonneurChecked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Reset state when re-opening with different props
  useEffect(() => {
    if (open) {
      setAxeLocked(!!effectivePreAxe);
      setActionLocked(!!preCnpAction);
      setSelectedAxeId(effectivePreAxe);
      setSelectedActionCode(preCnpAction?.code || "");
      setManualMode(false);
      resetSection3();
      setSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, preAxeId, preCode]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll + focus drawer
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ─── Données dérivées ───────────────────────────────────
  const declaredActions = useMemo(() => (open ? loadActions() : []), [open]);
  const declaredByAxe = useMemo(() => {
    const map: Record<string, number> = {};
    referentiel.axes.forEach((axe) => {
      map[axe.id] = declaredActions.filter((a) => a.axeId === axe.id).length;
    });
    return map;
  }, [declaredActions]);
  const declaredCodesByAxe = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    referentiel.axes.forEach((axe) => {
      map[axe.id] = new Set(
        declaredActions
          .filter((a) => a.axeId === axe.id && a.code)
          .map((a) => a.code as string)
      );
    });
    return map;
  }, [declaredActions]);
  // Codes déjà déclarés (toutes axes confondus) — utile pour la recherche.
  const declaredCodes = useMemo(
    () => new Set(declaredActions.map((a) => a.code).filter(Boolean) as string[]),
    [declaredActions]
  );

  const selectedAxe = selectedAxeId ? getAxeById(selectedAxeId) : null;
  const axeNum = selectedAxeId ? selectedAxeId.split("-")[1] : "";
  const selectedAction: DeclarableAction | null = selectedActionCode
    ? getDeclarableAction(selectedActionCode) || null
    : null;
  const declarableActionsForAxe = selectedAxeId
    ? getDeclarableActionsForAxe(selectedAxeId)
    : [];

  // ─── Visibility cascade ─────────────────────────────────
  const showSection2 = !!selectedAxeId;
  const showSection3 = !!selectedActionCode;

  const section3Complete = useMemo(() => {
    if (!selectedAction) return false;
    if (!titre.trim() || !organisme.trim() || !dateRealisation) return false;
    if (selectedAction.attestation_honneur) return attHonneurChecked;
    return !!fileName;
  }, [selectedAction, titre, organisme, dateRealisation, attHonneurChecked, fileName]);

  const showSection4 = section3Complete;

  // ─── Auto-scroll on cascade (intra-drawer) ──────────────
  useEffect(() => {
    if (showSection2 && section2Ref.current) {
      section2Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedAxeId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (showSection3 && section3Ref.current) {
      section3Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedActionCode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (showSection4 && section4Ref.current) {
      section4Ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [showSection4]);

  // ─── Resets ─────────────────────────────────────────────
  function resetSection3() {
    setTitre("");
    setOrganisme("");
    setDateRealisation("");
    setDureeValue("");
    setDureeUnit("h");
    setFileName("");
    setAttHonneurChecked(false);
    setErrors({});
  }

  function handleSelectAxe(axeId: string) {
    setSelectedAxeId(axeId);
    setSelectedActionCode("");
    resetSection3();
  }

  function handleSelectAction(code: string) {
    setSelectedActionCode(code);
    resetSection3();
  }

  function handleEditAxe() {
    // Si on vient de la recherche (entrée A, pas en mode manuel),
    // "Modifier l'axe" = retour complet à la recherche.
    if (!effectivePreAxe && !manualMode) {
      setSelectedAxeId("");
      setSelectedActionCode("");
      setAxeLocked(false);
      setActionLocked(false);
      resetSection3();
      return;
    }
    // Sinon (mode manuel ou entrée B/C avec pré-fill) : on déverrouille
    // simplement, l'utilisateur reste dans la cascade.
    setAxeLocked(false);
    setActionLocked(false);
    setSelectedActionCode("");
    resetSection3();
  }

  function handleEditAction() {
    setActionLocked(false);
    setSelectedActionCode("");
    resetSection3();
  }

  function handleSearchSelect(action: DeclarableAction, query: string) {
    setSelectedAxeId(action.axeId);
    setSelectedActionCode(action.code);
    setAxeLocked(true);
    setActionLocked(true);
    resetSection3();
    // Pré-remplit l'intitulé avec le texte de recherche (modifiable)
    setTitre(query.trim());
  }

  function handleSwitchToManual() {
    setManualMode(true);
    // En entrée A on reste sur l'axe vide, en entrée B on garde l'axe pré-fill.
    if (!effectivePreAxe) {
      setSelectedAxeId("");
    }
    setSelectedActionCode("");
    setAxeLocked(!!effectivePreAxe);
    setActionLocked(false);
    resetSection3();
  }

  function handleBackToSearch() {
    setManualMode(false);
    if (!effectivePreAxe) {
      setSelectedAxeId("");
    }
    setSelectedActionCode("");
    setAxeLocked(!!effectivePreAxe);
    setActionLocked(false);
    resetSection3();
  }

  function validateAndConfirm() {
    if (!selectedAction) return;
    const newErrors: Record<string, string> = {};
    if (!titre.trim()) newErrors.titre = "Saisissez l'intitulé de l'action.";
    else if (titre.length > 200) newErrors.titre = "200 caractères maximum.";
    if (!organisme.trim()) newErrors.organisme = "Saisissez le nom de l'organisme ou de la structure.";
    if (!dateRealisation) newErrors.dateRealisation = "Indiquez la date de réalisation.";
    else if (dateRealisation > TODAY_ISO) newErrors.dateRealisation = "La date ne peut pas être dans le futur.";
    if (!selectedAction.attestation_honneur && !fileName)
      newErrors.preuve = "Joignez votre justificatif.";
    if (selectedAction.attestation_honneur && !attHonneurChecked)
      newErrors.preuve = "Cochez l'attestation sur l'honneur pour confirmer.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const newAction: ActionRealisee = {
      id: `ar-cnp-${Date.now()}`,
      axeId: selectedAxeId,
      code: selectedAction.code,
      libelle: selectedAction.libelle,
      title: titre,
      org: organisme,
      date: isoToFr(dateRealisation),
      type: selectedAction.type,
      themeId: selectedAction.themeId,
      duration: dureeValue ? `${dureeValue}${dureeUnit === "h" ? "h" : "j"}` : undefined,
      source: "manual",
      declaredOn: isoToFr(TODAY_ISO),
      attachment: fileName || undefined,
      validation: "pending",
    };
    const all = loadActions();
    all.push(newAction);
    saveActions(all);

    // ─── Détection cycle complet (8 actions ET 4 axes couverts) ───
    const allAxesCovered = referentiel.axes.every((axe) => {
      const count = all.filter((a) => a.axeId === axe.id).length;
      return count >= axe.min_actions;
    });
    if (all.length >= 8 && allAxesCovered) {
      onDeclared?.(newAction);
      onClose();
      navigate("/maquette/succes");
      return;
    }

    setSubmitted(true);
    onDeclared?.(newAction);
  }

  function resetFormForAnother(opts?: {
    keepAxe?: boolean;
    keepAction?: boolean;
  }) {
    const keepAxe = opts?.keepAxe ?? !!effectivePreAxe;
    const keepAction = opts?.keepAction ?? !!preCnpAction;
    setSelectedAxeId(keepAxe ? effectivePreAxe : "");
    setSelectedActionCode(keepAction ? preCnpAction?.code || "" : "");
    setAxeLocked(keepAxe);
    setActionLocked(keepAction);
    resetSection3();
    setSubmitted(false);
    drawerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!open) return null;

  // ─── ÉCRAN DE SUCCÈS dans le drawer ─────────────────────
  if (submitted && selectedAxe && selectedAction) {
    const axeCount = (declaredByAxe[selectedAxeId] || 0) + 1;
    const totalActions = declaredActions.length + 1;
    const minActions = selectedAxe.min_actions;
    const axeJustCovered = axeCount === minActions;
    const axeOverflow = axeCount > minActions;
    const remaining = minActions - axeCount;
    const { years, months } = getTempsRestant();

    const cameFromReferentiel = !!preCode;
    const cameFromAxe = !cameFromReferentiel && !!preAxeId;

    let footerButtons: [ButtonProps, ...ButtonProps[]];
    if (cameFromReferentiel) {
      footerButtons = [
        {
          priority: "primary",
          children: "Retour au référentiel",
          onClick: onClose,
        },
        {
          priority: "secondary",
          iconId: "fr-icon-add-line",
          iconPosition: "left",
          children: "Déclarer une autre action",
          onClick: () =>
            resetFormForAnother({ keepAxe: false, keepAction: false }),
        },
        {
          priority: "tertiary no outline",
          children: "Fermer",
          onClick: onClose,
        },
      ];
    } else if (cameFromAxe) {
      footerButtons = [
        {
          priority: "primary",
          iconId: "fr-icon-add-line",
          iconPosition: "left",
          children: "Déclarer une autre action sur cet axe",
          onClick: () => resetFormForAnother({ keepAxe: true }),
        },
        {
          priority: "secondary",
          children: "Voir le détail de l'axe",
          onClick: () => {
            onClose();
            navigate(`/maquette/axe/${selectedAxeId}`);
          },
        },
        {
          priority: "tertiary no outline",
          children: "Fermer",
          onClick: onClose,
        },
      ];
    } else {
      footerButtons = [
        {
          priority: "primary",
          iconId: "fr-icon-add-line",
          iconPosition: "left",
          children: axeJustCovered
            ? "Déclarer pour un autre axe"
            : "Déclarer une autre action",
          onClick: () => resetFormForAnother({ keepAxe: false }),
        },
        {
          priority: "tertiary no outline",
          children: "Fermer",
          onClick: onClose,
        },
      ];
    }

    return (
      <>
        <div className="maq-drawer-overlay" onClick={onClose} />
        <aside
          ref={drawerRef}
          className="maq-drawer maq-drawer--decl"
          role="dialog"
          aria-modal="true"
          aria-label="Déclaration enregistrée"
          tabIndex={-1}
        >
          <div className="maq-drawer__header">
            <span />
            <button
              className="maq-drawer__close"
              onClick={onClose}
              aria-label="Fermer"
              type="button"
            >
              <span className="fr-icon-close-line" aria-hidden="true" />
            </button>
          </div>

          {/* ZONE 1 — Confirmation sobre */}
          <Alert
            severity="success"
            small
            description="Déclaration enregistrée. Votre Ordre pourra la consulter dans les prochains jours."
            className={fr.cx("fr-mb-4w")}
          />

          {/* ZONE 2 — Votre progression */}
          <section className="maq-decl-progress">
            <h3 className={fr.cx("fr-h6", "fr-mb-2w")}>Votre progression</h3>

            <div className="maq-decl-progress__row">
              <MiniRing done={totalActions} total={8} size={72} />

              <div className="maq-decl-progress__details">
                <p className="maq-decl-progress__axe-label">
                  Axe {axeNum} — {selectedAxe.label_court}
                </p>

                <div className="maq-decl-progress__axe-state">
                  <span className="maq-decl-progress__dots">
                    {Array.from({ length: minActions }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < axeCount
                            ? "maq-axe-dot maq-axe-dot--done"
                            : "maq-axe-dot"
                        }
                        aria-hidden="true"
                      >
                        {i < axeCount && (
                          <span className="fr-icon-check-line" />
                        )}
                      </span>
                    ))}
                  </span>
                  {axeOverflow ? (
                    <span className="maq-decl-progress__status">
                      {axeCount} actions (min. {minActions})
                    </span>
                  ) : axeJustCovered ? (
                    <span className="maq-decl-progress__status maq-decl-progress__status--success">
                      Couvert
                    </span>
                  ) : (
                    <span className="maq-decl-progress__status">
                      Encore {remaining} action{remaining > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <p className="maq-decl-progress__time">
                  {years} ans {months} mois restants
                </p>
              </div>
            </div>
          </section>

          {/* ZONE 3 — Ce que vous venez de déclarer */}
          <section className={fr.cx("fr-mt-4w")}>
            <div className="maq-decl-recap-card">
              <span className="maq-decl-recap-card__overline">
                Action déclarée
              </span>
              <h4 className="maq-decl-recap-card__title">{titre}</h4>
              <p className="maq-decl-recap-card__meta">
                <span>{organisme}</span>
                <span
                  className="maq-decl-recap-card__sep"
                  aria-hidden="true"
                >
                  ·
                </span>
                <span>{formatDateLong(dateRealisation)}</span>
              </p>
              <p className="maq-decl-recap-card__ref">
                <span className="maq-decl-recap__code">
                  {selectedAction.code}
                </span>
                <span className="maq-decl-recap-card__libelle">
                  {selectedAction.libelle}
                </span>
              </p>
              <Badge severity="warning" small noIcon>
                En attente de validation
              </Badge>
            </div>
          </section>

          {/* FOOTER — CTA contextuels */}
          <div className="maq-drawer__footer">
            <ButtonsGroup
              inlineLayoutWhen="never"
              buttonsEquisized
              buttons={footerButtons}
            />
          </div>
        </aside>
      </>
    );
  }

  // ─── DRAWER FORMULAIRE EN CASCADE ───────────────────────
  return (
    <>
      <div className="maq-drawer-overlay" onClick={onClose} />
      <aside
        ref={drawerRef}
        className="maq-drawer maq-drawer--decl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="decl-drawer-title"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="maq-drawer__header">
          <span />
          <button
            className="maq-drawer__close"
            onClick={onClose}
            aria-label="Fermer"
            type="button"
          >
            <span className="fr-icon-close-line" aria-hidden="true" />
          </button>
        </div>

        <h2 id="decl-drawer-title" className="maq-drawer__title">
          Déclarer une action
        </h2>
        <p
          className={fr.cx("fr-text--sm", "fr-mb-4w")}
          style={{ color: "var(--text-mention-grey)", marginTop: "-0.5rem" }}
        >
          {preCnpAction
            ? `Vous déclarez l'action ${preCnpAction.code} du référentiel.`
            : "Décrivez l'action que vous avez réalisée. Les sections apparaissent au fur et à mesure."}
        </p>

        {/* ═══ Barre de recherche (entrées A et B, jusqu'à sélection) ═══ */}
        {/* La search ne s'affiche qu'à l'état vierge : pas de preCode, pas
            de mode manuel, et aucune sélection en cours (ni axe ni action).
            Une fois la cascade engagée, on n'affiche plus la search pour
            éviter la double UI. */}
        {!preCode && !manualMode && !selectedAxeId && !selectedActionCode && (
          <ActionSearch
            axeIdFilter={effectivePreAxe || undefined}
            declaredCodes={declaredCodes}
            onSelect={handleSearchSelect}
            onSwitchToManual={handleSwitchToManual}
          />
        )}

        {/* Lien retour vers la recherche (uniquement en mode manuel A/B) */}
        {manualMode && !preCode && (
          <button
            type="button"
            className="maq-decl-back-to-search"
            onClick={handleBackToSearch}
          >
            <span className="fr-icon-arrow-left-line" aria-hidden="true" />
            Revenir à la recherche
          </button>
        )}

        {/* ═══ SECTION 1 — Axe (cascade visible si pré-fill, mode manuel ou après sélection) ═══ */}
        {(preCode || manualMode || selectedAxeId || selectedActionCode) && (
          <section className="maq-decl-section maq-decl-section--visible">
            <h3 className={fr.cx("fr-h6", "fr-mb-1w")}>Dans quel axe ?</h3>

            {!axeLocked && (
              <div className={fr.cx("fr-mb-2w")}>
                <Accordion label="Pas sûr du bon axe ?">
                  <ul className={fr.cx("fr-mb-0")}>
                    <li>
                      <strong>Axe 1 — Actualiser mes connaissances :</strong>{" "}
                      formations, DPC, DU/DIU, congrès, enseignement,
                      simulation, analyse réflexive
                    </li>
                    <li>
                      <strong>Axe 2 — Améliorer mes pratiques :</strong>{" "}
                      audits, RMM, CREX, analyse des pratiques en groupe,
                      protocoles
                    </li>
                    <li>
                      <strong>Axe 3 — Renforcer la relation patient :</strong>{" "}
                      relation d'aide, éthique, communication, dispositifs
                      d'annonce
                    </li>
                    <li>
                      <strong>Axe 4 — Préserver ma santé :</strong> prévention
                      des risques psychosociaux, vaccinations, santé au
                      travail, auto-évaluation
                    </li>
                  </ul>
                </Accordion>
              </div>
            )}

            {axeLocked && selectedAxe ? (
              <div className="maq-decl-readonly">
                <span className="maq-decl-readonly__label">Axe</span>
                <span className="maq-decl-readonly__value">
                  Axe {axeNum} — {selectedAxe.label_court}
                </span>
                <button
                  type="button"
                  className="maq-decl-readonly__edit"
                  onClick={handleEditAxe}
                >
                  Modifier
                </button>
              </div>
            ) : (
              <Select
                label="Axe de certification"
                hint="Chaque action doit être liée à un des 4 axes."
                nativeSelectProps={{
                  value: selectedAxeId,
                  onChange: (e) => handleSelectAxe(e.target.value),
                }}
                options={referentiel.axes.map((axe) => {
                  const num = axe.id.split("-")[1];
                  const done = declaredByAxe[axe.id] || 0;
                  return {
                    value: axe.id,
                    label: `Axe ${num} — ${axe.label_court} (${done}/${axe.min_actions})`,
                  };
                })}
                placeholder="Sélectionnez un axe"
              />
            )}
          </section>
        )}

        {/* ═══ SECTION 2 — Action ═══════════════════════════ */}
        {showSection2 && (
          <section
            ref={section2Ref}
            className="maq-decl-section maq-decl-section--visible"
          >
            <h3 className={fr.cx("fr-h6", "fr-mb-1w")}>
              Quelle action du référentiel ?
            </h3>

            {actionLocked && selectedAction ? (
              <div className="maq-decl-readonly maq-decl-readonly--block">
                <span className="maq-decl-readonly__label">Action du référentiel</span>
                <span className="maq-decl-readonly__code">{selectedAction.code}</span>
                <span className="maq-decl-readonly__value">{selectedAction.libelle}</span>
                <button
                  type="button"
                  className="maq-decl-readonly__edit"
                  onClick={handleEditAction}
                >
                  Modifier
                </button>
              </div>
            ) : (
              <>
                <Select
                  label="Action du référentiel"
                  hint="Liste filtrée selon l'axe choisi. Les actions déjà déclarées sont grisées."
                  nativeSelectProps={{
                    value: selectedActionCode,
                    onChange: (e) => handleSelectAction(e.target.value),
                  }}
                  options={declarableActionsForAxe.map((a) => {
                    const already = declaredCodesByAxe[selectedAxeId]?.has(a.code);
                    // Tronquer pour l'affichage en option ; le libellé complet
                    // est affiché juste sous le select après sélection.
                    const short = a.libelle.length > 110 ? a.libelle.slice(0, 110) + "…" : a.libelle;
                    return {
                      value: a.code,
                      label: `${a.code} — ${short}${already ? " (déjà déclarée)" : ""}`,
                      disabled: already,
                    };
                  })}
                  placeholder="Sélectionnez une action"
                />
                {selectedAction && (
                  <>
                    <div className="maq-decl-action-preview">
                      <span className="maq-decl-action-preview__code">
                        {selectedAction.code}
                      </span>
                      <p className="maq-decl-action-preview__libelle">
                        {selectedAction.libelle}
                      </p>
                    </div>
                    {!selectedAction.attestation_honneur && (
                      <CallOut
                        className={fr.cx("fr-mt-2w")}
                        iconId="fr-icon-attachment-line"
                        title="Justificatif à préparer"
                      >
                        <p className={fr.cx("fr-mb-0", "fr-text--sm")}>
                          <strong>{selectedAction.preuve.type}</strong>{" "}
                          — {selectedAction.preuve.precision}
                        </p>
                      </CallOut>
                    )}
                  </>
                )}
                <p
                  className={fr.cx("fr-text--sm", "fr-mt-2w", "fr-mb-0")}
                  style={{ color: "var(--text-mention-grey)" }}
                >
                  Vous ne trouvez pas votre action ?{" "}
                  <button
                    type="button"
                    className={fr.cx("fr-link", "fr-text--sm")}
                    onClick={() => openContactModal("cnp")}
                  >
                    Contactez votre CNP
                  </button>
                </p>
              </>
            )}
          </section>
        )}

        {/* ═══ SECTION 3 — Détails ═══════════════════════════ */}
        {showSection3 && selectedAction && (
          <section
            ref={section3Ref}
            className="maq-decl-section maq-decl-section--visible"
          >
            <h3 className={fr.cx("fr-h6", "fr-mb-1w")}>Détails de l'action</h3>

            {selectedAction.preuve.conditions && (
              <Alert
                severity="info"
                small
                description={
                  <>
                    <strong>Conditions méthodologiques&nbsp;:</strong>{" "}
                    {selectedAction.preuve.conditions}
                  </>
                }
                className={fr.cx("fr-mb-2w")}
              />
            )}

            <Input
              label="Intitulé précis"
              hintText="Nom de la formation, titre du congrès, sujet de l'étude. 200 caractères max."
              state={errors.titre ? "error" : "default"}
              stateRelatedMessage={errors.titre}
              nativeInputProps={{
                value: titre,
                onChange: (e) => {
                  setTitre(e.target.value);
                  if (errors.titre)
                    setErrors((p) => {
                      const n = { ...p };
                      delete n.titre;
                      return n;
                    });
                },
                maxLength: 200,
                placeholder: "Ex : DU Plaies, cicatrisation et brûlures",
                required: true,
              }}
            />

            <Input
              label="Organisme ou structure"
              state={errors.organisme ? "error" : "default"}
              stateRelatedMessage={errors.organisme}
              nativeInputProps={{
                value: organisme,
                onChange: (e) => {
                  setOrganisme(e.target.value);
                  if (errors.organisme)
                    setErrors((p) => {
                      const n = { ...p };
                      delete n.organisme;
                      return n;
                    });
                },
                placeholder: "Ex : ANDPC, CHU Amiens",
                required: true,
              }}
              className={fr.cx("fr-mt-2w")}
            />

            <Input
              label="Date de réalisation"
              state={errors.dateRealisation ? "error" : "default"}
              stateRelatedMessage={errors.dateRealisation}
              nativeInputProps={{
                type: "date",
                value: dateRealisation,
                max: TODAY_ISO,
                onChange: (e) => {
                  setDateRealisation(e.target.value);
                  if (errors.dateRealisation)
                    setErrors((p) => {
                      const n = { ...p };
                      delete n.dateRealisation;
                      return n;
                    });
                },
                required: true,
              }}
              className={fr.cx("fr-mt-2w")}
            />

            <fieldset
              className={`fr-fieldset ${fr.cx("fr-mt-2w", "fr-mb-0")}`}
              style={{ padding: 0, border: "none" }}
            >
              <legend
                className="fr-fieldset__legend"
                style={{ paddingBottom: "0.5rem" }}
              >
                Durée{" "}
                <span className={fr.cx("fr-hint-text")} style={{ display: "inline" }}>
                  (optionnel)
                </span>
              </legend>
              <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
                <div className={fr.cx("fr-col-6")}>
                  <Input
                    label="Valeur"
                    hideLabel
                    nativeInputProps={{
                      type: "number",
                      min: 0,
                      value: dureeValue,
                      onChange: (e) => setDureeValue(e.target.value),
                      placeholder: "Ex : 7",
                    }}
                  />
                </div>
                <div className={fr.cx("fr-col-6")}>
                  <div className={fr.cx("fr-select-group")}>
                    <label className={`${fr.cx("fr-label")} fr-sr-only`} htmlFor="duree-unit">
                      Unité de durée
                    </label>
                    <select
                      className={fr.cx("fr-select")}
                      id="duree-unit"
                      value={dureeUnit}
                      onChange={(e) => setDureeUnit(e.target.value as "h" | "j")}
                    >
                      <option value="h">Heures</option>
                      <option value="j">Jours</option>
                    </select>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* ─── Justificatif adaptatif ─── */}
            <div className={fr.cx("fr-mt-3w")}>
              {selectedAction.attestation_honneur ? (
                <Checkbox
                  legend="Attestation sur l'honneur"
                  hintText="Cette déclaration engage votre responsabilité professionnelle. Toute fausse déclaration est passible des peines prévues à l'article 441-7 du Code pénal."
                  state={errors.preuve ? "error" : "default"}
                  stateRelatedMessage={errors.preuve}
                  options={[
                    {
                      label: "J'atteste sur l'honneur avoir réalisé cette action.",
                      nativeInputProps: {
                        checked: attHonneurChecked,
                        onChange: (e) => {
                          setAttHonneurChecked(e.target.checked);
                          if (e.target.checked && errors.preuve)
                            setErrors((p) => {
                              const n = { ...p };
                              delete n.preuve;
                              return n;
                            });
                        },
                      },
                    },
                  ]}
                />
              ) : (
                <>
                  <Upload
                    label={
                      selectedAction.preuve.type === "Diplôme"
                        ? "Justificatif — Diplôme"
                        : selectedAction.preuve.type === "Autres"
                        ? "Justificatif — Document scientifique"
                        : "Justificatif"
                    }
                    hint={`${selectedAction.preuve.precision} Formats : PDF, JPG, PNG. 5 Mo max.`}
                    state={errors.preuve ? "error" : "default"}
                    stateRelatedMessage={errors.preuve}
                    nativeInputProps={{
                      accept: ".pdf,.jpg,.jpeg,.png",
                      onChange: (e) => {
                        const f = e.target.files?.[0];
                        setFileName(f?.name || "");
                        if (f && errors.preuve)
                          setErrors((p) => {
                            const n = { ...p };
                            delete n.preuve;
                            return n;
                          });
                      },
                    }}
                  />
                  <p
                    className={fr.cx("fr-text--sm", "fr-mt-1w", "fr-mb-0")}
                    style={{ color: "var(--text-mention-grey)" }}
                  >
                    Ce document pourra être vérifié ultérieurement par votre Ordre.
                  </p>
                </>
              )}
            </div>
          </section>
        )}

        {/* ═══ SECTION 4 — Récapitulatif ═════════════════════ */}
        {showSection4 && selectedAxe && selectedAction && (
          <section
            ref={section4Ref}
            className="maq-decl-section maq-decl-section--visible"
          >
            <h3 className={fr.cx("fr-h6", "fr-mb-1w")}>Vérifiez et confirmez</h3>

            <CallOut iconId="fr-icon-checkbox-line" title="Récapitulatif">
              <dl className="maq-decl-recap">
                <div className="maq-decl-recap__row">
                  <dt>Axe</dt>
                  <dd>
                    Axe {axeNum} — {selectedAxe.label_court}
                  </dd>
                </div>
                <div className="maq-decl-recap__row">
                  <dt>Action</dt>
                  <dd>
                    <span className="maq-decl-recap__code">{selectedAction.code}</span>
                    <br />
                    {selectedAction.libelle}
                  </dd>
                </div>
                <div className="maq-decl-recap__row">
                  <dt>Intitulé</dt>
                  <dd>{titre}</dd>
                </div>
                <div className="maq-decl-recap__row">
                  <dt>Organisme</dt>
                  <dd>{organisme}</dd>
                </div>
                <div className="maq-decl-recap__row">
                  <dt>Date</dt>
                  <dd>{formatDateLong(dateRealisation)}</dd>
                </div>
                {dureeValue && (
                  <div className="maq-decl-recap__row">
                    <dt>Durée</dt>
                    <dd>
                      {dureeValue} {dureeUnit === "h" ? "heure(s)" : "jour(s)"}
                    </dd>
                  </div>
                )}
                <div className="maq-decl-recap__row">
                  <dt>Justificatif</dt>
                  <dd>
                    {selectedAction.attestation_honneur
                      ? "Attestation sur l'honneur"
                      : fileName || "—"}
                  </dd>
                </div>
              </dl>
            </CallOut>
          </section>
        )}

        {/* ─── Footer fixe ─── */}
        <div className="maq-drawer__footer">
          <ButtonsGroup
            inlineLayoutWhen="always"
            alignment="left"
            buttonsEquisized
            buttons={[
              {
                priority: "primary",
                iconId: "fr-icon-check-line",
                iconPosition: "left",
                children: "Confirmer",
                onClick: validateAndConfirm,
                disabled: !showSection4,
              },
              {
                priority: "tertiary no outline",
                children: "Annuler",
                onClick: onClose,
              },
            ]}
          />
        </div>
      </aside>
    </>
  );
}
