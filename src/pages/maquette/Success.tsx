import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import {
  referentiel,
  profileMock,
  loadActions,
  getActionsForAxe,
  getAxeColor,
} from "../../data/maquette";
import "./maquette.css";

/* ─── Small ring for recap ───────────────────────────── */

function MiniRing({ percent, color }: { percent: number; color: string }) {
  const size = 96;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--grey-950-100)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${c * percent} ${c * (1 - percent)}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: "1.375rem", color,
      }}>
        {Math.round(percent * 100)}%
      </div>
    </div>
  );
}

/* ─── AxisProgressRow (reused) ───────────────────────── */

function ProgressDot({ filled, overflow, color }: { filled: boolean; overflow?: boolean; color: string }) {
  const size = 16;
  if (overflow) {
    return (
      <span
        className="maq-progress-dot maq-progress-dot--overflow"
        style={{ width: size, height: size, background: color, borderColor: color, fontSize: "0.625rem" }}
      >+</span>
    );
  }
  if (filled) {
    return (
      <span
        className="maq-progress-dot maq-progress-dot--filled"
        style={{ width: size, height: size, background: color, borderColor: color }}
      />
    );
  }
  return <span className="maq-progress-dot" style={{ width: size, height: size }} />;
}

function AxisProgressRow({ done, required, color }: { done: number; required: number; color: string }) {
  const slots = Math.max(required, done);
  const dots = [];
  for (let i = 0; i < slots; i++) {
    if (i < required) {
      dots.push(<ProgressDot key={i} filled={i < done} color={color} />);
    } else {
      dots.push(<ProgressDot key={i} filled overflow color={color} />);
    }
  }
  return <div className="maq-progress-row">{dots}</div>;
}

/* ─── Success page ───────────────────────────────────── */

export function Success() {
  const actions = loadActions();
  const totalActions = actions.length;
  // Build per-axe stats
  const axeStats = referentiel.axes.map((axe) => {
    const count = getActionsForAxe(axe.id, actions).length;
    return { axe, count };
  });

  const totalExtra = totalActions - referentiel.min_total;

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")} style={{ maxWidth: "60rem" }}>
      <Breadcrumb
        currentPageLabel="Certification validee"
        homeLinkProps={{ to: "/maquette" }}
        segments={[
          { label: "Tableau de bord", linkProps: { to: "/maquette/tableau-de-bord" } },
        ]}
      />

      {/* ═══ Hero success ════════════════════════════════════ */}
      <section className="maq-success-hero">
        {/* Tricolore strip */}
        <div className="maq-success-hero__strip" />

        <div className="maq-success-hero__icon">
          <span className="fr-icon-check-line" aria-hidden="true" style={{ fontSize: "3rem", color: "var(--text-default-success)" }} />
        </div>

        <p className="maq-success-hero__label">Cycle de certification valide</p>
        <h1 className="maq-success-hero__title">
          Felicitations {profileMock.prenom}, vous avez rempli votre obligation de certification periodique.
        </h1>
        <p className="maq-success-hero__desc">
          Vos {totalActions} actions ont ete declarees dans les 4 axes du referentiel
          « {referentiel.label} ». Votre dossier a ete transmis a l'<strong>Ordre national des infirmiers</strong>.
        </p>

        {/* Summary ring */}
        <div className="maq-success-hero__summary">
          <MiniRing percent={1} color="var(--success-425-625)" />
          <div style={{ textAlign: "left" }}>
            <p className={fr.cx("fr-text--sm", "fr-mb-1v")} style={{ color: "var(--text-mention-grey)" }}>
              Cycle {profileMock.debutCycle} → {profileMock.finCycle}
            </p>
            <p style={{ fontWeight: 700, fontSize: "1.25rem", marginBottom: "0.125rem" }}>
              {totalActions} actions declarees sur {referentiel.min_total} requises
            </p>
            <p className={fr.cx("fr-text--sm", "fr-mb-0")} style={{ color: "var(--text-default-success)" }}>
              4 axes complétés{totalExtra > 0 && <> · {totalExtra} action{totalExtra > 1 ? "s" : ""} au-dela du minimum</>}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Button
            priority="primary"
            iconId="fr-icon-download-line"
            iconPosition="left"
          >
            Telecharger l'attestation (PDF)
          </Button>
          <Button
            priority="secondary"
            linkProps={{ to: "/maquette/tableau-de-bord" }}
          >
            Retour au tableau de bord
          </Button>
        </div>
      </section>

      {/* ═══ Recap par axe ══════════════════════════════════�� */}
      <section className={fr.cx("fr-mt-5w")}>
        <h2 className={fr.cx("fr-h4", "fr-mb-3w")}>Recapitulatif par axe</h2>
        <div className="maq-success-axes">
          {axeStats.map(({ axe, count }) => {
            const { color, bgTint } = getAxeColor(axe.id);
            const axeNum = axe.id.split("-")[1];
            const isCovered = count >= axe.min_actions;
            return (
              <div
                key={axe.id}
                className="maq-success-axe-card"
                style={{ borderColor: isCovered ? "var(--success-425-625)" : "var(--border-default-grey)" }}
              >
                <div className="maq-success-axe-card__accent" style={{ background: color }} />
                <span
                  className="maq-success-axe-card__num"
                  style={{ background: bgTint, color }}
                >
                  {axeNum}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.125rem" }}>
                    {axe.label_court}
                  </p>
                  <p className={fr.cx("fr-text--sm", "fr-mb-0")} style={{ color: "var(--text-default-success)" }}>
                    <span className="fr-icon-check-line" aria-hidden="true" style={{ fontSize: "0.75rem" }} />{" "}
                    {count} action{count > 1 ? "s" : ""} declaree{count > 1 ? "s" : ""}
                  </p>
                </div>
                <AxisProgressRow done={count} required={axe.min_actions} color="var(--success-425-625)" />
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ Next cycle ══════════════════════════════════════ */}
      <section className="maq-success-next">
        <h3 className={fr.cx("fr-h5", "fr-mb-2w")}>Et maintenant ?</h3>
        <p className={fr.cx("fr-text--sm")}>
          Votre prochain cycle debutera automatiquement a la fin du cycle en cours.
          Vous recevrez une notification par courriel pour en consulter le nouveau referentiel.
          D'ici la, votre espace reste accessible en lecture seule.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a className={fr.cx("fr-link")} href="#" onClick={(e) => e.preventDefault()}>Consulter mes archives</a>
          <a className={fr.cx("fr-link")} href="#" onClick={(e) => e.preventDefault()}>Parametrer les notifications</a>
          <a className={fr.cx("fr-link")} href="#" onClick={(e) => e.preventDefault()}>Contacter l'Ordre des infirmiers</a>
        </div>
      </section>
    </div>
  );
}
