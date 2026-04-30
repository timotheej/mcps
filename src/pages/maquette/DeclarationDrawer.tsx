import { useState, useEffect, useMemo, useRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { Upload } from "@codegouvfr/react-dsfr/Upload";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import {
  referentiel,
  getAxeById,
  loadActions,
  saveActions,
  getDeclarableActionsForAxe,
  getDeclarableAction,
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
  const drawerRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLElement | null>(null);
  const section3Ref = useRef<HTMLElement | null>(null);
  const section4Ref = useRef<HTMLElement | null>(null);

  const preCnpAction = preCode ? getDeclarableAction(preCode) : undefined;
  const effectivePreAxe = preCnpAction?.axeId || preAxeId || "";

  // ─── Mode locks (entry B/C) ─────────────────────────────
  const [axeLocked, setAxeLocked] = useState<boolean>(!!effectivePreAxe);
  const [actionLocked, setActionLocked] = useState<boolean>(!!preCnpAction);

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
    setSubmitted(true);
    onDeclared?.(newAction);
  }

  function resetFormForAnother() {
    setSelectedAxeId(effectivePreAxe);
    setSelectedActionCode(preCnpAction?.code || "");
    setAxeLocked(!!effectivePreAxe);
    setActionLocked(!!preCnpAction);
    resetSection3();
    setSubmitted(false);
    drawerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!open) return null;

  // ─── ÉCRAN DE SUCCÈS dans le drawer ─────────────────────
  if (submitted && selectedAxe && selectedAction) {
    const axeCount = (declaredByAxe[selectedAxeId] || 0) + 1;
    const isCovered = axeCount >= selectedAxe.min_actions;
    return (
      <>
        <div className="maq-drawer-overlay" onClick={onClose} />
        <aside
          ref={drawerRef}
          className="maq-drawer maq-drawer--decl"
          role="dialog"
          aria-modal="true"
          aria-label="Action déclarée"
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

          <div className="maq-decl-success maq-decl-success--drawer">
            <span className="maq-decl-success__icon" aria-hidden="true">
              <span className="fr-icon-check-line" aria-hidden="true" />
            </span>
            <h2 className={fr.cx("fr-h4", "fr-mb-2w")}>Action déclarée</h2>
            <p
              className={fr.cx("fr-text--md", "fr-mb-4w")}
              style={{ color: "var(--text-mention-grey)" }}
            >
              « {titre} » a été ajoutée à l'axe {axeNum}.
            </p>

            <CallOut title={`Axe ${axeNum} — ${selectedAxe.label_court}`}>
              <p className={fr.cx("fr-mb-1w")} style={{ fontSize: "1rem", fontWeight: 600 }}>
                {axeCount} action{axeCount > 1 ? "s" : ""} sur {selectedAxe.min_actions} requise
                {selectedAxe.min_actions > 1 ? "s" : ""}
              </p>
              {isCovered ? (
                <p
                  className={fr.cx("fr-mb-0", "fr-text--sm")}
                  style={{ color: "var(--text-default-success)", fontWeight: 600 }}
                >
                  <span className="fr-icon-check-line" aria-hidden="true" /> Vous avez complété cet axe.
                </p>
              ) : (
                <p
                  className={fr.cx("fr-mb-0", "fr-text--sm")}
                  style={{ color: "var(--text-mention-grey)" }}
                >
                  Encore {selectedAxe.min_actions - axeCount} action
                  {selectedAxe.min_actions - axeCount > 1 ? "s" : ""} pour couvrir cet axe.
                </p>
              )}
            </CallOut>
          </div>

          <div className="maq-drawer__footer">
            <Button
              priority="primary"
              iconId="fr-icon-add-line"
              iconPosition="left"
              onClick={resetFormForAnother}
            >
              Déclarer une autre action
            </Button>
            <Button priority="tertiary no outline" onClick={onClose}>
              Fermer
            </Button>
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

        {/* Slot future barre de recherche */}
        <div id="search-slot" className={fr.cx("fr-mb-2w")} aria-hidden="true" />

        {/* ═══ SECTION 1 — Axe ═══════════════════════════════ */}
        <section className="maq-decl-section maq-decl-section--visible">
          <h3 className={fr.cx("fr-h6", "fr-mb-1w")}>Dans quel axe ?</h3>

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
                  <div className="maq-decl-action-preview">
                    <span className="maq-decl-action-preview__code">
                      {selectedAction.code}
                    </span>
                    <p className="maq-decl-action-preview__libelle">
                      {selectedAction.libelle}
                    </p>
                  </div>
                )}
                <p
                  className={fr.cx("fr-text--sm", "fr-mt-1w", "fr-mb-0")}
                  style={{ color: "var(--text-mention-grey)" }}
                >
                  Vous ne trouvez pas votre action ?{" "}
                  <a
                    href="#"
                    className={fr.cx("fr-link", "fr-text--sm")}
                    onClick={(e) => e.preventDefault()}
                  >
                    Contactez votre CNP
                  </a>
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
