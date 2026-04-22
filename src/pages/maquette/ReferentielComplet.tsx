import { useState, useMemo } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
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
  formationsMock,
  type ActionRef,
  type ActionRealisee,
} from "../../data/maquette";
import "./maquette.css";

function countFormationsForCode(code: string): number {
  return formationsMock.filter((f) => f.id === code).length;
}

function ReferentielActionCard({
  action,
  axeId,
  declared,
  onDeclare,
}: {
  action: ActionRef;
  axeId: string;
  declared: ActionRealisee | undefined;
  onDeclare: () => void;
}) {
  const { color: axeColor, bgTint } = getAxeColor(axeId);
  const formationsCount = countFormationsForCode(action.code);

  return (
    <article className="maq-ref-card">
      <div className="maq-ref-card__top">
        {declared ? (
          <Badge severity="success" small>
            Deja declaree
          </Badge>
        ) : (
          <span />
        )}
        <span className="maq-ref-card__code">{action.code}</span>
      </div>

      <h3 className="maq-ref-card__libelle">{action.libelle}</h3>

      <div className="maq-ref-card__chips">
        {action.themeId && (
          <span
            className="maq-theme-chip"
            style={{ background: bgTint, color: axeColor }}
          >
            {getThemeLabel(axeId, action.themeId)}
          </span>
        )}
        <span className="maq-ref-card__type-chip">{action.type}</span>
      </div>

      <div className="maq-ref-card__footer">
        {declared ? (
          <Button
            priority="tertiary no outline"
            size="small"
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
          >
            Voir ma declaration du {declared.declaredOn || declared.date}
          </Button>
        ) : (
          <>
            <Button
              priority="secondary"
              size="small"
              iconId="fr-icon-add-line"
              iconPosition="left"
              onClick={onDeclare}
            >
              Declarer cette action
            </Button>
            {formationsCount > 0 && (
              <Button
                priority="tertiary no outline"
                size="small"
                iconId="fr-icon-book-2-line"
                iconPosition="left"
              >
                Voir formations proposees ({formationsCount})
              </Button>
            )}
          </>
        )}
      </div>
    </article>
  );
}

export function ReferentielComplet() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const axe = id ? getAxeById(id) : undefined;

  const [search, setSearch] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>(() => {
    const saved = loadSelectedThemes();
    return saved && id ? saved[id] || [] : [];
  });
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  if (!axe || !id) {
    return <Navigate to="/maquette/tableau-de-bord" replace />;
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
            currentPageLabel="Referentiel complet"
            homeLinkProps={{ to: "/maquette" }}
            segments={[
              { label: "Tableau de bord", linkProps: { to: "/maquette/tableau-de-bord" } },
              { label: `Axe ${axeNum}`, linkProps: { to: `/maquette/axe/${id}` } },
            ]}
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
              <Button
                priority="primary"
                iconId="fr-icon-add-line"
                iconPosition="left"
                size="small"
                onClick={() => navigate(`/maquette/declarer?axe=${id}`)}
              >
                Declarer une action
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Filtres sticky ═════════════════════════════════ */}
      <div className={fr.cx("fr-container")}>
        <div className="maq-ref-filters">
          <div className="maq-ref-filters__row">
            <Input
              label="Rechercher une action"
              hideLabel
              iconId="fr-icon-search-line"
              nativeInputProps={{
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "Rechercher par mot-cle (simulation, protocole, formation...)",
                "aria-label": "Rechercher une action dans le referentiel",
              }}
            />
          </div>

          <div className="maq-ref-filters__row">
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

          <div className="maq-ref-filters__row">
            <Accordion label="Plus de filtres" defaultExpanded={false}>
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
            </Accordion>
          </div>

          <div className="maq-ref-counter">
            <span>
              <strong>{filtered.length}</strong> action{filtered.length > 1 ? "s" : ""} affichee{filtered.length > 1 ? "s" : ""}
              {declaredCount > 0 && (
                <>
                  {" "}· dont <strong>{declaredCount}</strong> deja declaree{declaredCount > 1 ? "s" : ""} par vous
                </>
              )}
            </span>
            {hasActiveFilters && (
              <Button
                priority="tertiary no outline"
                size="small"
                iconId="fr-icon-close-line"
                iconPosition="right"
                onClick={resetFilters}
              >
                Reinitialiser les filtres
              </Button>
            )}
          </div>
        </div>

        {/* ═══ Liste de cards ═══════════════════════════════ */}
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
            filtered.map((action) => (
              <ReferentielActionCard
                key={action.code}
                action={action}
                axeId={id}
                declared={declaredByCode.get(action.code)}
                onDeclare={() => navigate(`/maquette/declarer?axe=${id}&code=${action.code}`)}
              />
            ))
          )}
        </div>

        {/* ═══ CallOut action libre ═════════════════════════ */}
        <div className={fr.cx("fr-mt-5w")}>
          <CallOut
            title="Votre action ne figure pas dans cette liste ?"
            iconId="fr-icon-information-line"
            buttonProps={{
              priority: "primary",
              children: "Declarer une action libre",
              onClick: () => navigate(`/maquette/declarer?axe=${id}&type=action-libre`),
            }}
          >
            Vous pouvez declarer une action libre. Elle sera examinee par votre CNP pour validation au titre de cet axe.
          </CallOut>
        </div>

        {/* ═══ Navigation inter-axes ════════════════════════ */}
        <div className={fr.cx("fr-mt-5w", "fr-mb-6w")}>
          <nav className="maq-ref-axe-nav" aria-label="Navigation entre axes">
            <Button
              priority="tertiary"
              iconId="fr-icon-arrow-left-line"
              iconPosition="left"
              linkProps={{ to: `/maquette/axe/${id}` }}
            >
              Retour a l'axe {axeNum}
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
                    linkProps={{ to: `/maquette/axe/${a.id}/referentiel` }}
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
                onChange: (e) => navigate(`/maquette/axe/${e.target.value}/referentiel`),
              }}
              options={referentiel.axes.map((a) => ({
                value: a.id,
                label: `Axe ${a.id.split("-")[1]} — ${a.label_court}`,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
