import { useState, useMemo } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import {
  getAxeById,
  getAxeColor,
  getThemeLabel,
  loadActions,
  getActionsForAxe,
  loadSelectedThemes,
  referentiel,
  type ActionRef,
  type ActionRealisee,
} from "../../data/maquette";
import { ReferentielActionDrawer } from "./ReferentielActionDrawer";
import { DeclarationDrawer } from "./DeclarationDrawer";
import "./maquette.css";

function ReferentielActionCard({
  action,
  axeId,
  declared,
  onOpen,
  onDeclare,
  onViewDeclaration,
  mode,
}: {
  action: ActionRef;
  axeId: string;
  declared: ActionRealisee | undefined;
  onOpen: () => void;
  onDeclare: () => void;
  onViewDeclaration: () => void;
  mode: "private" | "public";
}) {
  const { color: axeColor, bgTint } = getAxeColor(axeId);
  const isPublic = mode === "public";

  const stop = (handler: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    handler();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <article
      className="maq-ref-card maq-ref-card--clickable"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={onKeyDown}
      aria-label={`Voir le detail de l'action ${action.code}`}
    >
      <div className="maq-ref-card__top">
        {!isPublic && declared ? (
          <Badge severity="success" small>
            Deja declaree
          </Badge>
        ) : (
          <span />
        )}
        <span className="maq-ref-card__code">{action.code}</span>
      </div>

      <h3 className="maq-ref-card__libelle">{action.libelle}</h3>

      <p className="maq-ref-card__type-line">Type : {action.type}</p>

      <div className="maq-ref-card__chips">
        {action.themeId && (
          <span
            className="maq-theme-chip"
            style={{ background: bgTint, color: axeColor }}
          >
            {getThemeLabel(axeId, action.themeId)}
          </span>
        )}
      </div>

      <div className="maq-ref-card__footer">
        {!isPublic && declared ? (
          <Button
            priority="tertiary no outline"
            size="small"
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            onClick={stop(onViewDeclaration)}
          >
            Voir ma declaration du {declared.declaredOn || declared.date}
          </Button>
        ) : (
          <Button
            priority="secondary"
            size="small"
            iconId={isPublic ? "fr-icon-lock-line" : "fr-icon-add-line"}
            iconPosition="left"
            onClick={stop(onDeclare)}
          >
            {isPublic ? "Se connecter pour declarer" : "Declarer cette action"}
          </Button>
        )}
      </div>
    </article>
  );
}

export function ReferentielComplet({
  mode = "private",
}: {
  mode?: "private" | "public";
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const axe = id ? getAxeById(id) : undefined;
  const isPublic = mode === "public";

  const [search, setSearch] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>(() => {
    const saved = loadSelectedThemes();
    return saved && id ? saved[id] || [] : [];
  });
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [drawerAction, setDrawerAction] = useState<ActionRef | null>(null);
  const [declDrawerOpen, setDeclDrawerOpen] = useState(false);
  const [declDrawerCode, setDeclDrawerCode] = useState<string | undefined>(undefined);

  if (!axe || !id) {
    return <Navigate to={isPublic ? "/referentiel" : "/maquette/tableau-de-bord"} replace />;
  }

  const axeNum = axe.id.split("-")[1];
  const { color, bgTint } = getAxeColor(id);

  const types = useMemo(() => {
    return Array.from(new Set(axe.actions.map((a) => a.type))).sort();
  }, [axe.actions]);

  const declaredByCode = useMemo(() => {
    const map = new Map<string, ActionRealisee>();
    const mine = getActionsForAxe(id, loadActions());
    mine.forEach((a) => {
      if (a.code) map.set(a.code, a);
    });
    return map;
  }, [id]);

  const filtered = useMemo(() => {
    let result = axe.actions;
    if (selectedThemes.length > 0) {
      result = result.filter(
        (a) => a.themeId && selectedThemes.includes(a.themeId)
      );
    }
    if (typeFilter) {
      result = result.filter((a) => a.type === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.libelle.toLowerCase().includes(q) ||
          a.code.toLowerCase().includes(q)
      );
    }
    return result;
  }, [axe.actions, selectedThemes, typeFilter, search]);

  const declaredCount = useMemo(
    () => filtered.filter((a) => declaredByCode.has(a.code)).length,
    [filtered, declaredByCode]
  );

  const toggleTheme = (themeId: string) => {
    setSelectedThemes((s) =>
      s.includes(themeId) ? s.filter((x) => x !== themeId) : [...s, themeId]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedThemes([]);
    setTypeFilter(null);
  };

  const hasActiveFilters =
    search !== "" || selectedThemes.length > 0 || typeFilter !== null;

  return (
    <div style={{ background: "var(--background-default-grey)", minHeight: "100vh" }}>
      {/* ═══ Bandeau d'orientation ══════════════════════════ */}
      <section
        className="maq-axe-band"
        style={{ background: bgTint, borderBottomColor: color + "22" }}
      >
        <div className={fr.cx("fr-container")} style={{ padding: "1.25rem 0 2.25rem" }}>
          <Breadcrumb
            currentPageLabel={
              isPublic ? `Axe ${axeNum} — ${axe.label_court}` : "Referentiel complet"
            }
            homeLinkProps={{ to: isPublic ? "/" : "/maquette" }}
            segments={
              isPublic
                ? [
                    {
                      label: "Referentiel de certification",
                      linkProps: { to: "/referentiel" },
                    },
                  ]
                : [
                    { label: "Tableau de bord", linkProps: { to: "/maquette/tableau-de-bord" } },
                    { label: `Axe ${axeNum}`, linkProps: { to: `/maquette/axe/${id}` } },
                  ]
            }
          />

          <div className="maq-axe-band__grid">
            <div>
              <span className="maq-axe-band__chip">AXE {axeNum}</span>
              <h1 className="maq-axe-band__title" style={{ color }}>
                Referentiel complet
              </h1>
              <p className="maq-axe-band__desc">
                {axe.label_court} — {axe.actions_count} actions reconnues par le CNP Infirmier
              </p>
            </div>

            <div className="maq-axe-band__actions">
              <Button
                priority="secondary"
                iconId="fr-icon-external-link-line"
                iconPosition="left"
                size="small"
              >
                Consulter le CNP
              </Button>
              {isPublic ? (
                <Button
                  priority="primary"
                  iconId="fr-icon-lock-line"
                  iconPosition="left"
                  size="small"
                  onClick={() => navigate("/maquette")}
                >
                  Se connecter pour declarer
                </Button>
              ) : (
                <Button
                  priority="primary"
                  iconId="fr-icon-add-line"
                  iconPosition="left"
                  size="small"
                  onClick={() => {
                    setDeclDrawerCode(undefined);
                    setDeclDrawerOpen(true);
                  }}
                >
                  Declarer une action
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Layout 2 colonnes : filtres + liste ════════════ */}
      <div className={fr.cx("fr-container", "fr-mt-3w")}>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          {/* ─── Colonne filtres (col-3) ─────────────────── */}
          <div className={fr.cx("fr-col-12", "fr-col-md-3")}>
            <aside className="maq-ref-sidebar" aria-label="Filtres">
              <div className="maq-ref-sidebar__block">
                <Input
                  label="Rechercher une action"
                  hideLabel
                  iconId="fr-icon-search-line"
                  nativeInputProps={{
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    placeholder: "Mot-cle, code...",
                    "aria-label": "Rechercher une action dans le referentiel",
                  }}
                />
              </div>

              <div className="maq-ref-sidebar__block">
                <p className="maq-ref-filters__label">Theme</p>
                <div className="maq-ref-filters__tags">
                  <Tag
                    pressed={selectedThemes.length === 0}
                    nativeButtonProps={{
                      onClick: () => setSelectedThemes([]),
                      "aria-label": "Afficher toutes les actions",
                    }}
                  >
                    Tous
                  </Tag>
                  {axe.themes.map((t) => {
                    const active = selectedThemes.includes(t.id);
                    return (
                      <Tag
                        key={t.id}
                        pressed={active}
                        nativeButtonProps={{
                          onClick: () => toggleTheme(t.id),
                          "aria-pressed": active,
                        }}
                      >
                        {t.label}
                      </Tag>
                    );
                  })}
                </div>
              </div>

              <div className="maq-ref-sidebar__block">
                <p className="maq-ref-filters__label">Type d'action</p>
                <div className="maq-ref-filters__tags">
                  <Tag
                    pressed={typeFilter === null}
                    nativeButtonProps={{ onClick: () => setTypeFilter(null) }}
                  >
                    Tous ({axe.actions.length})
                  </Tag>
                  {types.map((type) => {
                    const count = axe.actions.filter((a) => a.type === type).length;
                    const active = typeFilter === type;
                    return (
                      <Tag
                        key={type}
                        pressed={active}
                        nativeButtonProps={{
                          onClick: () => setTypeFilter(active ? null : type),
                        }}
                      >
                        {type} ({count})
                      </Tag>
                    );
                  })}
                </div>
              </div>

              {hasActiveFilters && (
                <div className="maq-ref-sidebar__block">
                  <Button
                    priority="tertiary no outline"
                    size="small"
                    iconId="fr-icon-close-line"
                    iconPosition="right"
                    onClick={resetFilters}
                  >
                    Reinitialiser les filtres
                  </Button>
                </div>
              )}
            </aside>
          </div>

          {/* ─── Colonne actions (col-9) ─────────────────── */}
          <div className={fr.cx("fr-col-12", "fr-col-md-9")}>
            <div className="maq-ref-counter">
              <span>
                <strong>{filtered.length}</strong> action{filtered.length > 1 ? "s" : ""} affichee{filtered.length > 1 ? "s" : ""}
                {!isPublic && declaredCount > 0 && (
                  <>
                    {" "}· dont <strong>{declaredCount}</strong> deja declaree{declaredCount > 1 ? "s" : ""} par vous
                  </>
                )}
              </span>
            </div>

            <div className="maq-ref-list">
              {filtered.length === 0 ? (
                <div className="maq-ref-empty">
                  <span
                    className="fr-icon-search-line"
                    aria-hidden="true"
                    style={{
                      fontSize: "2.5rem",
                      color: "var(--text-mention-grey)",
                      display: "block",
                      marginBottom: "1rem",
                    }}
                  />
                  <p className={fr.cx("fr-text--lg", "fr-mb-1w")}>
                    Aucune action ne correspond a votre recherche.
                  </p>
                  <p
                    className={fr.cx("fr-text--sm", "fr-mb-3w")}
                    style={{ color: "var(--text-mention-grey)" }}
                  >
                    Essayez d'elargir vos filtres ou de modifier votre recherche.
                  </p>
                  <Button priority="secondary" size="small" onClick={resetFilters}>
                    Reinitialiser les filtres
                  </Button>
                </div>
              ) : (
                filtered.map((action) => {
                  const decl = declaredByCode.get(action.code);
                  return (
                    <ReferentielActionCard
                      key={action.code}
                      action={action}
                      axeId={id}
                      declared={decl}
                      mode={mode}
                      onOpen={() => setDrawerAction(action)}
                      onDeclare={() => {
                        if (isPublic) {
                          navigate("/maquette");
                          return;
                        }
                        setDeclDrawerCode(action.code);
                        setDeclDrawerOpen(true);
                      }}
                      onViewDeclaration={() =>
                        decl && navigate(`/maquette/axe/${id}?action=${decl.id}`)
                      }
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ═══ CallOut action libre ═════════════════════════ */}
        <div className={fr.cx("fr-mt-5w")}>
          {isPublic ? (
            <CallOut
              title="Votre situation est specifique ?"
              iconId="fr-icon-information-line"
              buttonProps={{
                priority: "primary",
                children: "Creer mon compte",
                onClick: () => navigate("/maquette"),
              }}
            >
              Une fois connecte, vous pourrez declarer une action libre. Elle sera examinee par votre CNP pour validation au titre de cet axe.
            </CallOut>
          ) : (
            <CallOut
              title="Votre action ne figure pas dans cette liste ?"
              iconId="fr-icon-information-line"
              buttonProps={{
                priority: "primary",
                children: "Declarer une action libre",
                onClick: () => {
                  setDeclDrawerCode(undefined);
                  setDeclDrawerOpen(true);
                },
              }}
            >
              Vous pouvez declarer une action libre. Elle sera examinee par votre CNP pour validation au titre de cet axe.
            </CallOut>
          )}
        </div>

        {/* ═══ Navigation inter-axes ════════════════════════ */}
        <div className={fr.cx("fr-mt-5w", "fr-mb-6w")}>
          <nav className="maq-ref-axe-nav" aria-label="Navigation entre axes">
            <Button
              priority="tertiary"
              iconId="fr-icon-arrow-left-line"
              iconPosition="left"
              linkProps={{ to: isPublic ? "/referentiel" : `/maquette/axe/${id}` }}
            >
              {isPublic ? "Retour aux 4 axes" : `Retour a l'axe ${axeNum}`}
            </Button>

            <div className="maq-ref-axe-nav__others">
              <span className="maq-ref-axe-nav__label">Naviguer vers :</span>
              {referentiel.axes.map((a) => {
                const n = a.id.split("-")[1];
                const isCurrent = a.id === id;
                return (
                  <Button
                    key={a.id}
                    priority={isCurrent ? "tertiary" : "tertiary no outline"}
                    size="small"
                    linkProps={{
                      to: isPublic
                        ? `/referentiel/${a.id}`
                        : `/maquette/axe/${a.id}/referentiel`,
                    }}
                    disabled={isCurrent}
                  >
                    Axe {n}
                  </Button>
                );
              })}
            </div>
          </nav>

          <div className="maq-ref-axe-nav__mobile">
            <Select
              label="Aller a un autre axe"
              nativeSelectProps={{
                value: id,
                onChange: (e) =>
                  navigate(
                    isPublic
                      ? `/referentiel/${e.target.value}`
                      : `/maquette/axe/${e.target.value}/referentiel`
                  ),
              }}
              options={referentiel.axes.map((a) => ({
                value: a.id,
                label: `Axe ${a.id.split("-")[1]} — ${a.label_court}`,
              }))}
            />
          </div>
        </div>
      </div>

      <ReferentielActionDrawer
        action={drawerAction}
        axeId={id}
        declared={drawerAction ? declaredByCode.get(drawerAction.code) : undefined}
        mode={mode}
        onClose={() => setDrawerAction(null)}
        onDeclare={() => {
          if (!drawerAction) return;
          if (isPublic) {
            setDrawerAction(null);
            navigate("/maquette");
            return;
          }
          const code = drawerAction.code;
          setDrawerAction(null);
          setDeclDrawerCode(code);
          setDeclDrawerOpen(true);
        }}
        onViewDeclaration={() => {
          if (!drawerAction) return;
          const decl = declaredByCode.get(drawerAction.code);
          if (decl) {
            setDrawerAction(null);
            navigate(`/maquette/axe/${id}?action=${decl.id}`);
          }
        }}
      />

      {/* ═══ Declaration drawer ═════════════════════════════ */}
      <DeclarationDrawer
        open={declDrawerOpen}
        onClose={() => setDeclDrawerOpen(false)}
        preAxeId={id}
        preCode={declDrawerCode}
      />
    </div>
  );
}
