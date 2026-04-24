import { useEffect, useRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import {
  getAxeColor,
  getThemeLabel,
  type ActionRef,
  type ActionRealisee,
} from "../../data/maquette";
import "./maquette.css";

export function ReferentielActionDrawer({
  action,
  axeId,
  declared,
  mode,
  onClose,
  onDeclare,
  onViewDeclaration,
}: {
  action: ActionRef | null;
  axeId: string;
  declared: ActionRealisee | undefined;
  mode: "private" | "public";
  onClose: () => void;
  onDeclare: () => void;
  onViewDeclaration?: () => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const isPublic = mode === "public";

  useEffect(() => {
    if (!action) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [action, onClose]);

  useEffect(() => {
    if (action) {
      document.body.style.overflow = "hidden";
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [action]);

  if (!action) return null;

  const { color: axeColor, bgTint } = getAxeColor(axeId);
  const axeNum = axeId.split("-")[1];

  return (
    <>
      <div className="maq-drawer-overlay" onClick={onClose} />
      <aside
        ref={drawerRef}
        className="maq-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Detail de l'action du referentiel"
        tabIndex={-1}
      >
        <div className="maq-drawer__header">
          <span
            className="maq-axe-band__chip"
            style={{ background: bgTint, color: axeColor }}
          >
            AXE {axeNum}
          </span>
          <button
            type="button"
            className="maq-drawer__close"
            onClick={onClose}
            aria-label="Fermer le detail"
          >
            <span className="fr-icon-close-line" aria-hidden="true" />
          </button>
        </div>

        <p
          className={fr.cx("fr-text--sm", "fr-mb-3w")}
          style={{
            color: "var(--text-mention-grey)",
            fontFamily: "ui-monospace, Consolas, monospace",
          }}
        >
          {action.code}
        </p>

        <h2 className={fr.cx("fr-h5", "fr-mb-3w")}>{action.libelle}</h2>

        <div className="maq-ref-drawer__meta">
          <div>
            <p className="maq-ref-drawer__label">Theme</p>
            {action.themeId ? (
              <span
                className="maq-theme-chip"
                style={{ background: bgTint, color: axeColor }}
              >
                {getThemeLabel(axeId, action.themeId)}
              </span>
            ) : (
              <p className={fr.cx("fr-text--sm")}>—</p>
            )}
          </div>
          <div>
            <p className="maq-ref-drawer__label">Type d'action</p>
            <span className="maq-ref-card__type-chip">{action.type}</span>
          </div>
        </div>

        {!isPublic && declared && (
          <div className={fr.cx("fr-mt-4w")}>
            <p className="maq-ref-drawer__label">Votre declaration</p>
            <div className="maq-ref-drawer__declared">
              <Badge severity="success" small>
                Deja declaree
              </Badge>
              <span
                className={fr.cx("fr-text--sm")}
                style={{ color: "var(--text-mention-grey)" }}
              >
                le {declared.declaredOn || declared.date}
              </span>
            </div>
          </div>
        )}

        <div className="maq-drawer__footer">
          {!isPublic && declared ? (
            <Button
              priority="primary"
              iconId="fr-icon-arrow-right-line"
              iconPosition="right"
              onClick={onViewDeclaration}
            >
              Voir ma declaration
            </Button>
          ) : (
            <Button
              priority="primary"
              iconId={isPublic ? "fr-icon-lock-line" : "fr-icon-add-line"}
              iconPosition="left"
              onClick={onDeclare}
            >
              {isPublic ? "Se connecter pour declarer" : "Declarer cette action"}
            </Button>
          )}
          <Button priority="tertiary no outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </aside>
    </>
  );
}
