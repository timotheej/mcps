import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import {
  referentiel,
  getAxeById,
  formationsMock,
  loadActions,
  saveActions,
  ACTION_TYPES,
  getActionTypeLabel,
  type ActionRealisee,
} from "../../data/maquette";
import "./maquette.css";

type Step = "type" | "axe" | "form" | "confirm" | "success";

const MODALITES = ["Presentiel", "Distanciel", "Mixte", "E-learning"];
const DUREES = [
  "Moins d'une journee",
  "1 journee",
  "2 a 3 jours",
  "1 semaine",
  "Plus d'une semaine",
];

export function Declaration() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preAxeId = searchParams.get("axe");
  const preFormationId = searchParams.get("formation");
  const preFormation = preFormationId
    ? formationsMock.find((f) => f.id === preFormationId)
    : null;

  // Determine initial step based on pre-filled data
  const initialStep: Step = preFormation
    ? "form"
    : preAxeId
    ? "type"
    : "type";

  const [step, setStep] = useState<Step>(initialStep);
  const [selectedAxeId, setSelectedAxeId] = useState<string | null>(
    preAxeId
  );
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(
    preFormation?.typeAction || null
  );

  const [titre, setTitre] = useState(preFormation?.titre || "");
  const [organisme, setOrganisme] = useState(
    preFormation?.organisme || ""
  );
  const [date, setDate] = useState("");
  const [duree, setDuree] = useState(
    preFormation
      ? DUREES.find((d) =>
          d.toLowerCase().includes(
            parseInt(preFormation.duree) <= 7
              ? "journee"
              : parseInt(preFormation.duree) <= 14
              ? "2 a 3"
              : "semaine"
          )
        ) || ""
      : ""
  );
  const [modalite, setModalite] = useState(
    preFormation?.modalite || ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set today as default date
  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    setDate(`${dd}/${mm}/${yyyy}`);
  }, []);

  const selectedAxe = selectedAxeId
    ? getAxeById(selectedAxeId)
    : null;
  const axeNum = selectedAxeId
    ? selectedAxeId.split("-")[1]
    : null;
  const selectedType = selectedTypeId
    ? ACTION_TYPES.find((t) => t.id === selectedTypeId)
    : null;

  function handleSelectType(typeId: string) {
    setSelectedTypeId(typeId);
    if (preAxeId) {
      setStep("form");
    } else {
      setStep("axe");
    }
  }

  function handleSelectAxe(axeId: string) {
    setSelectedAxeId(axeId);
    setStep("form");
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};
    if (!titre.trim())
      newErrors.titre = "Saisissez l'intitule de l'action";
    if (!organisme.trim())
      newErrors.organisme = "Saisissez le nom de l'organisme";
    if (!date.trim()) newErrors.date = "Saisissez la date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmitForm() {
    if (!validateForm()) return;
    setStep("confirm");
  }

  function handleConfirm() {
    if (!selectedAxeId || !selectedTypeId) return;
    const actions = loadActions();
    const newAction: ActionRealisee = {
      id: `ar-new-${Date.now()}`,
      axeId: selectedAxeId,
      libelle: titre,
      date: date,
      type: getActionTypeLabel(selectedTypeId),
    };
    actions.push(newAction);
    saveActions(actions);
    setStep("success");
  }

  // ─── Stepper logic ──────────────────────────────────────
  // Steps vary based on what's pre-filled:
  // Full flow: type → axe → form → confirm
  // With preAxeId: type → form → confirm
  // With preFormation: form → confirm
  const hasAxeStep = !preAxeId;
  const hasTypeStep = !preFormation;
  const stepNames: Step[] = [
    ...(hasTypeStep ? ["type" as Step] : []),
    ...(hasAxeStep ? ["axe" as Step] : []),
    "form",
    "confirm",
  ];
  const totalSteps = stepNames.length;
  const currentStepIdx = stepNames.indexOf(step);
  const adjustedStep = currentStepIdx >= 0 ? currentStepIdx + 1 : 1;

  function getStepTitle(s: Step): string {
    switch (s) {
      case "type":
        return "Type d'action";
      case "axe":
        return "Choisir l'axe";
      case "form":
        return "Decrire l'action";
      case "confirm":
        return "Confirmer";
      default:
        return "";
    }
  }

  const nextStepName = stepNames[currentStepIdx + 1];

  // ─── Form label adapts to type ──────────────────────────
  const formTitle =
    selectedTypeId === "formation"
      ? "Declarer une formation"
      : selectedTypeId === "action-libre"
      ? "Declarer une action libre"
      : `Declarer une action`;
  const inputLabel =
    selectedTypeId === "formation"
      ? "Intitule de la formation"
      : "Intitule de l'action";
  const inputPlaceholder =
    selectedTypeId === "formation"
      ? "Ex : Formation a la prevention des TMS"
      : selectedTypeId === "gestion-risques"
      ? "Ex : RETEX sur les erreurs medicamenteuses"
      : selectedTypeId === "analyse-pratiques"
      ? "Ex : Audit clinique patient traceur"
      : selectedTypeId === "programme-integre"
      ? "Ex : Simulation haute-fidelite en situation critique"
      : "Ex : Description de votre action";
  const orgLabel =
    selectedTypeId === "formation"
      ? "Organisme de formation"
      : "Organisme ou structure";

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <Breadcrumb
        currentPageLabel="Declarer une action"
        homeLinkProps={{ to: "/maquette" }}
        segments={[
          {
            label: "Tableau de bord",
            linkProps: { to: "/maquette/tableau-de-bord" },
          },
          ...(selectedAxe
            ? [
                {
                  label: `Axe ${axeNum}`,
                  linkProps: {
                    to: `/maquette/axe/${selectedAxeId}`,
                  },
                },
              ]
            : []),
        ]}
      />

      {step !== "success" && (
        <Stepper
          currentStep={adjustedStep}
          stepCount={totalSteps}
          title={getStepTitle(step)}
          nextTitle={nextStepName ? getStepTitle(nextStepName) : undefined}
        />
      )}

      {/* === STEP: Type selection === */}
      {step === "type" && (
        <>
          <h1 className={fr.cx("fr-mb-2w")}>
            Qu'avez-vous fait ?
          </h1>
          <p className={`${fr.cx("fr-text--sm", "fr-mb-4w")} fr-text-mention--grey`}>
            Choisissez le type d'action que vous souhaitez declarer.
            Chaque type compte pour votre certification.
          </p>
          <div className="maq-decl__types">
            {ACTION_TYPES.map((actionType) => (
              <button
                key={actionType.id}
                type="button"
                className="maq-decl__type-tile"
                onClick={() => handleSelectType(actionType.id)}
              >
                <span
                  className={`${actionType.icon} maq-decl__type-tile-icon`}
                  aria-hidden="true"
                />
                <div className="maq-decl__type-tile-content">
                  <span className="maq-decl__type-tile-title">
                    {actionType.label}
                  </span>
                  <span className="maq-decl__type-tile-desc">
                    {actionType.description}
                  </span>
                </div>
                <span
                  className="fr-icon-arrow-right-s-line maq-decl__type-tile-arrow"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </>
      )}

      {/* === STEP: Axe selection === */}
      {step === "axe" && (
        <>
          <h1 className={fr.cx("fr-mb-2w")}>
            Pour quel axe declarez-vous cette action ?
          </h1>
          <p className={`${fr.cx("fr-text--sm", "fr-mb-4w")} fr-text-mention--grey`}>
            {selectedType && (
              <>
                <strong>{selectedType.label}</strong> &middot;{" "}
              </>
            )}
            Choisissez l'axe qui correspond le mieux. En cas de doute,
            choisissez celui qui vous semble le plus proche — vous pourrez
            modifier plus tard.
          </p>
          <div className="maq-decl__axes">
            {referentiel.axes.map((axe) => {
              const num = axe.id.split("-")[1];
              return (
                <button
                  key={axe.id}
                  type="button"
                  className="maq-decl__axe-tile"
                  onClick={() => handleSelectAxe(axe.id)}
                >
                  <span className="maq-decl__axe-tile-num">
                    Axe {num}
                  </span>
                  <span className="maq-decl__axe-tile-title">
                    {axe.label_court}
                  </span>
                  <span className="maq-decl__axe-tile-ps">
                    {axe.label_ps}
                  </span>
                  <span
                    className="fr-icon-arrow-right-s-line maq-decl__axe-tile-arrow"
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
          <div className={fr.cx("fr-mt-2w")}>
            <Button
              priority="tertiary"
              onClick={() => {
                setSelectedTypeId(null);
                setStep("type");
              }}
            >
              Retour
            </Button>
          </div>
        </>
      )}

      {/* === STEP: Form === */}
      {step === "form" && selectedAxe && (
        <>
          <h1 className={fr.cx("fr-mb-1w")}>
            {formTitle}
          </h1>
          <p className={`${fr.cx("fr-text--sm", "fr-mb-4w")} fr-text-mention--grey`}>
            {selectedType && (
              <span className="maq-decl__type-badge">
                {selectedType.label}
              </span>
            )}
            Axe {axeNum} — {selectedAxe.label_court}
            {preFormation && (
              <>
                {" "}
                · Pre-rempli depuis la suggestion
              </>
            )}
          </p>

          <div className="maq-decl__form">
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              <div className={fr.cx("fr-col-12")}>
                <Input
                  label={inputLabel}
                  state={errors.titre ? "error" : "default"}
                  stateRelatedMessage={errors.titre}
                  nativeInputProps={{
                    value: titre,
                    onChange: (e) => {
                      setTitre(e.target.value);
                      if (errors.titre)
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.titre;
                          return next;
                        });
                    },
                    placeholder: inputPlaceholder,
                  }}
                />
              </div>
              <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                <Input
                  label={orgLabel}
                  state={errors.organisme ? "error" : "default"}
                  stateRelatedMessage={errors.organisme}
                  nativeInputProps={{
                    value: organisme,
                    onChange: (e) => {
                      setOrganisme(e.target.value);
                      if (errors.organisme)
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.organisme;
                          return next;
                        });
                    },
                    placeholder: "Ex : ANFH, ANDPC, HAS...",
                  }}
                />
              </div>
              <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                <Input
                  label="Date de realisation"
                  state={errors.date ? "error" : "default"}
                  stateRelatedMessage={errors.date}
                  nativeInputProps={{
                    value: date,
                    onChange: (e) => {
                      setDate(e.target.value);
                      if (errors.date)
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.date;
                          return next;
                        });
                    },
                    placeholder: "JJ/MM/AAAA",
                  }}
                />
              </div>
              <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                <div className={fr.cx("fr-select-group")}>
                  <label className={fr.cx("fr-label")} htmlFor="duree">
                    Duree (optionnel)
                  </label>
                  <select
                    className={fr.cx("fr-select")}
                    id="duree"
                    value={duree}
                    onChange={(e) => setDuree(e.target.value)}
                  >
                    <option value="" disabled>
                      Selectionnez une duree
                    </option>
                    {DUREES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                <div className={fr.cx("fr-select-group")}>
                  <label
                    className={fr.cx("fr-label")}
                    htmlFor="modalite"
                  >
                    Modalite (optionnel)
                  </label>
                  <select
                    className={fr.cx("fr-select")}
                    id="modalite"
                    value={modalite}
                    onChange={(e) => setModalite(e.target.value)}
                  >
                    <option value="" disabled>
                      Selectionnez une modalite
                    </option>
                    {MODALITES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={fr.cx("fr-col-12")}>
                <div className={fr.cx("fr-upload-group")}>
                  <label className={fr.cx("fr-label")} htmlFor="attestation">
                    Attestation (optionnel)
                    <span className={fr.cx("fr-hint-text")}>
                      Formats acceptes : PDF, JPG, PNG. Taille max : 5 Mo.
                    </span>
                  </label>
                  <input
                    className={fr.cx("fr-upload")}
                    type="file"
                    id="attestation"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
            </div>

            {/* ─── Parcourir le referentiel ─────────────── */}
            <div className={fr.cx("fr-mt-4w", "fr-pb-2w")}
              style={{ borderBottom: "1px solid var(--border-default-grey)" }}
            >
              <p className={fr.cx("fr-text--sm", "fr-mb-1v")}>
                <strong>Vous ne trouvez pas votre action dans la liste ?</strong>
              </p>
              <Link
                to={`/maquette/axe/${selectedAxeId}/referentiel`}
                className={fr.cx("fr-link", "fr-link--icon-right", "fr-icon-arrow-right-line")}
              >
                Parcourir le referentiel de l'axe {axeNum} ({selectedAxe.actions_count} actions)
              </Link>
            </div>

            <div className="maq-decl__actions">
              <Button
                priority="tertiary"
                onClick={() => {
                  if (preFormation) {
                    navigate(-1);
                  } else if (preAxeId) {
                    setStep("type");
                  } else {
                    setStep("axe");
                  }
                }}
              >
                Retour
              </Button>
              <Button priority="primary" onClick={handleSubmitForm}>
                Verifier et confirmer
              </Button>
            </div>
          </div>
        </>
      )}

      {/* === STEP: Confirm === */}
      {step === "confirm" && selectedAxe && (
        <>
          <h1 className={fr.cx("fr-mb-2w")}>Confirmez votre declaration</h1>
          <p className={`${fr.cx("fr-text--sm", "fr-mb-4w")} fr-text-mention--grey`}>
            Verifiez les informations ci-dessous avant de valider.
          </p>

          <div className="maq-decl__recap">
            <div className="maq-decl__recap-row">
              <span className="maq-decl__recap-label">Type</span>
              <span className="maq-decl__recap-value">
                {selectedType?.label || "—"}
              </span>
            </div>
            <div className="maq-decl__recap-row">
              <span className="maq-decl__recap-label">Axe</span>
              <span className="maq-decl__recap-value">
                Axe {axeNum} — {selectedAxe.label_court}
              </span>
            </div>
            <div className="maq-decl__recap-row">
              <span className="maq-decl__recap-label">Intitule</span>
              <span className="maq-decl__recap-value maq-decl__recap-value--strong">
                {titre}
              </span>
            </div>
            <div className="maq-decl__recap-row">
              <span className="maq-decl__recap-label">Organisme</span>
              <span className="maq-decl__recap-value">{organisme}</span>
            </div>
            <div className="maq-decl__recap-row">
              <span className="maq-decl__recap-label">Date</span>
              <span className="maq-decl__recap-value">{date}</span>
            </div>
            {duree && (
              <div className="maq-decl__recap-row">
                <span className="maq-decl__recap-label">Duree</span>
                <span className="maq-decl__recap-value">{duree}</span>
              </div>
            )}
            {modalite && (
              <div className="maq-decl__recap-row">
                <span className="maq-decl__recap-label">Modalite</span>
                <span className="maq-decl__recap-value">{modalite}</span>
              </div>
            )}
          </div>

          <div className="maq-decl__actions">
            <Button
              priority="tertiary"
              onClick={() => setStep("form")}
            >
              Modifier
            </Button>
            <Button
              priority="primary"
              iconId="fr-icon-check-line"
              iconPosition="left"
              onClick={handleConfirm}
            >
              Confirmer la declaration
            </Button>
          </div>
        </>
      )}

      {/* === STEP: Success === */}
      {step === "success" && selectedAxe && (
        <div className="maq-decl__success">
          <Alert
            severity="success"
            title="Action declaree"
            description={`"${titre}" a ete ajoutee a l'axe ${axeNum} — ${selectedAxe.label_court}.`}
            className={fr.cx("fr-mb-4w")}
          />

          <div className="maq-decl__success-recap">
            <p className="maq-decl__success-count">
              {(() => {
                const actions = loadActions();
                const axeCount = actions.filter(
                  (a) => a.axeId === selectedAxeId
                ).length;
                const totalCount = actions.length;
                const isCovered = axeCount >= (selectedAxe?.min_actions || 2);
                return (
                  <>
                    <strong>
                      Axe {axeNum} : {axeCount} / {selectedAxe.min_actions}
                    </strong>
                    {isCovered && (
                      <span className="maq-decl__success-badge">
                        Axe couvert
                      </span>
                    )}
                    <br />
                    <span className={`${fr.cx("fr-text--sm")} fr-text-mention--grey`}>
                      Total : {totalCount} / {referentiel.min_total}{" "}
                      actions declarees
                    </span>
                  </>
                );
              })()}
            </p>
          </div>

          <div className="maq-decl__success-actions">
            <Button
              priority="secondary"
              iconId="fr-icon-add-line"
              iconPosition="left"
              onClick={() => {
                setStep("type");
                setSelectedTypeId(null);
                if (!preAxeId) setSelectedAxeId(null);
                setTitre("");
                setOrganisme("");
                setDuree("");
                setModalite("");
                setErrors({});
              }}
            >
              Declarer une autre action
            </Button>
            <Button
              priority="primary"
              linkProps={{ to: "/maquette/tableau-de-bord" }}
            >
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
