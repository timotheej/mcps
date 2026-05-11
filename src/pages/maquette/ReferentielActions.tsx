import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Pagination } from "@codegouvfr/react-dsfr/Pagination";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import Book from "@codegouvfr/react-dsfr/picto/Book";
import Search from "@codegouvfr/react-dsfr/picto/Search";
import HumanCooperation from "@codegouvfr/react-dsfr/picto/HumanCooperation";
import Health from "@codegouvfr/react-dsfr/picto/Health";
import {
  referentielsAll,
  ordresAvecReferentiels,
  loadActions,
  type ActionRef,
  type ActionRealisee,
} from "../../data/maquette";
import { DeclarationDrawer } from "./DeclarationDrawer";
import { ReferentielActionDrawer } from "./ReferentielActionDrawer";
import "./maquette.css";

const PAGE_SIZE = 8;

// Référentiel actif par défaut : Infirmières DE Généralistes
const REF_IDE_DEFAULT = "REF.60.04_1";

// Les 4 axes (labels reformulés universels, identiques sur l'accueil).
// Affichés en bas de page pour rappel pédagogique.
const AXES_INFOS: Array<{ num: number; titre: string; desc: string }> = [
  {
    num: 1,
    titre: "Actualiser mes connaissances",
    desc: "Formations, DPC, congrès, enseignement",
  },
  {
    num: 2,
    titre: "Améliorer mes pratiques",
    desc: "Audits, RMM, analyse de pratiques, simulation",
  },
  {
    num: 3,
    titre: "Renforcer la relation patient",
    desc: "Communication, éthique, droits des usagers",
  },
  {
    num: 4,
    titre: "Préserver ma santé",
    desc: "Risques psychosociaux, prévention, santé au travail",
  },
];

// Ordre d'affichage des ordres professionnels dans le sélecteur public.
const ORDRES_ORDER = [
  "medecins",
  "pharmaciens",
  "chirurgiens-dentistes",
  "sages-femmes",
  "infirmiers",
  "kine",
  "podologues",
];

type ReferentielActionsProps = {
  mode?: "private" | "public";
};

type ActionWithAxe = ActionRef & { axeId: string };

type StatutFilter = "all" | "non-declarees" | "declarees";

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function ReferentielActions({ mode = "private" }: ReferentielActionsProps) {
  const navigate = useNavigate();
  const isPublic = mode === "public";

  const [search, setSearch] = useState("");
  const [axeFilter, setAxeFilter] = useState<string | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string | "all">("all");
  const [statutFilter, setStatutFilter] = useState<StatutFilter>("all");
  // Référentiel actif : en mode public, sélectionnable. En mode privé, fixé à IDE.
  const [referentielCode, setReferentielCode] = useState<string>(REF_IDE_DEFAULT);
  const [page, setPage] = useState(1);
  const [drawerAction, setDrawerAction] = useState<{
    action: ActionRef;
    axeId: string;
  } | null>(null);
  const [declDrawerOpen, setDeclDrawerOpen] = useState(false);
  const [declDrawerCode, setDeclDrawerCode] = useState<string | undefined>(
    undefined
  );

  // Référentiel sélectionné (= référentiel utilisé pour la liste d'actions).
  const activeRef = referentielsAll[referentielCode];

  // Toutes les actions du référentiel à plat, avec axeId
  const allActions = useMemo<ActionWithAxe[]>(() => {
    if (!activeRef) return [];
    return activeRef.axes.flatMap((axe) =>
      axe.actions.map((a) => ({ ...a, axeId: axe.id }))
    );
  }, [activeRef]);

  // Types d'action uniques pour le filtre
  const allTypes = useMemo<string[]>(() => {
    return Array.from(new Set(allActions.map((a) => a.type))).sort((a, b) =>
      a.localeCompare(b, "fr")
    );
  }, [allActions]);

  // Compteurs : pour étiqueter les Tag pills "Axe 1 (46)", "Formation (78)"…
  const axeCounts = useMemo<Map<string, number>>(() => {
    const m = new Map<string, number>();
    allActions.forEach((a) => m.set(a.axeId, (m.get(a.axeId) || 0) + 1));
    return m;
  }, [allActions]);

  const typeCounts = useMemo<Map<string, number>>(() => {
    const m = new Map<string, number>();
    allActions.forEach((a) => m.set(a.type, (m.get(a.type) || 0) + 1));
    return m;
  }, [allActions]);

  // Référentiel sélectionné = pas trouvé → afficher Notice "à venir"
  const referentielDisponible = !!activeRef;

  // Actions déclarées (mode privé uniquement)
  const declaredByCode = useMemo<Map<string, ActionRealisee>>(() => {
    if (isPublic) return new Map();
    const map = new Map<string, ActionRealisee>();
    loadActions().forEach((a) => {
      if (a.code) map.set(a.code, a);
    });
    return map;
  }, [isPublic]);

  // Filtrage
  const filtered = useMemo<ActionWithAxe[]>(() => {
    let result = allActions;
    if (axeFilter !== "all") {
      result = result.filter((a) => a.axeId === axeFilter);
    }
    if (typeFilter !== "all") {
      result = result.filter((a) => a.type === typeFilter);
    }
    if (!isPublic && statutFilter !== "all") {
      result = result.filter((a) => {
        const isDeclared = declaredByCode.has(a.code);
        return statutFilter === "declarees" ? isDeclared : !isDeclared;
      });
    }
    if (search.trim()) {
      const q = normalize(search);
      result = result.filter(
        (a) =>
          normalize(a.libelle).includes(q) || normalize(a.code).includes(q)
      );
    }
    return result;
  }, [allActions, axeFilter, typeFilter, statutFilter, search, isPublic, declaredByCode]);

  const hasActiveFilters =
    search.trim() !== "" ||
    axeFilter !== "all" ||
    typeFilter !== "all" ||
    (!isPublic && statutFilter !== "all");

  function resetFilters() {
    setSearch("");
    setAxeFilter("all");
    setTypeFilter("all");
    setStatutFilter("all");
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  function handleFilterChange<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setPage(1);
  }

  function handleOpenDetail(item: ActionWithAxe) {
    setDrawerAction({ action: item, axeId: item.axeId });
  }

  function handleDeclareAction(code: string) {
    if (isPublic) {
      navigate("/");
      return;
    }
    setDeclDrawerCode(code);
    setDeclDrawerOpen(true);
  }

  function handleDeclareGlobal() {
    if (isPublic) {
      navigate("/");
      return;
    }
    setDeclDrawerCode(undefined);
    setDeclDrawerOpen(true);
  }

  // Breadcrumb : différent selon mode
  const breadcrumb = isPublic ? (
    <Breadcrumb
      currentPageLabel="Tous les référentiels"
      segments={[{ label: "Accueil", linkProps: { to: "/" } }]}
    />
  ) : (
    <Breadcrumb
      currentPageLabel="Référentiel des actions"
      segments={[
        { label: "Accueil", linkProps: { to: "/" } },
        {
          label: "Tableau de bord",
          linkProps: { to: "/maquette/tableau-de-bord" },
        },
      ]}
    />
  );

  return (
    <>
      {/* ═══ Bandeau bleu pâle — Breadcrumb + titre + actions ═══ */}
      <section className="maq-ref-band">
        <div className={fr.cx("fr-container")}>
          {breadcrumb}

          <div className="maq-ref-band__row">
            <h1 className="maq-ref-band__title">Référentiel des actions</h1>
            {/* En mode privé uniquement : CTA "Déclarer une action" reste
                contextuel (le PS connecté peut agir). En mode public, on
                allège le bandeau — la déclaration n'est pas accessible. */}
            {!isPublic && (
              <div className="maq-ref-band__actions">
                <Button
                  priority="primary"
                  iconId="fr-icon-add-line"
                  iconPosition="left"
                  onClick={handleDeclareGlobal}
                >
                  Déclarer une action
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ Layout 2 colonnes ═══════════════════════════════ */}
      <div className={`${fr.cx("fr-container", "fr-mt-4w", "fr-mb-8w")}`}>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          {/* Colonne gauche — Filtres */}
          <aside
            className={fr.cx("fr-col-12", "fr-col-md-4")}
            aria-label="Filtres"
          >
            <div className="maq-ref-filters">
              <h2 className={fr.cx("fr-h6", "fr-mb-3w")}>Filtres</h2>

              {/* Sélecteur de référentiel — mode public uniquement.
                  raw <select> avec optgroups par ordre professionnel. */}
              {isPublic && (
                <div
                  className={`maq-ref-filters__block ${fr.cx("fr-select-group", "fr-mb-3w")}`}
                >
                  <label className={fr.cx("fr-label")} htmlFor="select-ref">
                    Référentiel
                  </label>
                  <select
                    id="select-ref"
                    className={fr.cx("fr-select")}
                    value={referentielCode}
                    onChange={(e) => {
                      setReferentielCode(e.target.value);
                      setAxeFilter("all");
                      setTypeFilter("all");
                      setPage(1);
                    }}
                  >
                    {ORDRES_ORDER.map((ordreId) => {
                      const ordre = ordresAvecReferentiels[ordreId];
                      if (!ordre) return null;
                      if (ordre.referentiels.length === 0) {
                        return (
                          <optgroup
                            key={ordreId}
                            label={`${ordre.label} — bientôt disponible`}
                          >
                            <option value={`unavailable-${ordreId}`} disabled>
                              Référentiel non publié
                            </option>
                          </optgroup>
                        );
                      }
                      return (
                        <optgroup key={ordreId} label={ordre.label}>
                          {ordre.referentiels.map((r) => (
                            <option key={r.code} value={r.code}>
                              {r.label} ({r.actions_totales})
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                </div>
              )}

              <SearchBar
                label="Rechercher dans le référentiel"
                renderInput={({ className, id, type, placeholder }) => (
                  <input
                    className={className}
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => handleFilterChange(setSearch, e.target.value)}
                  />
                )}
              />

              <div className={`maq-ref-filters__block ${fr.cx("fr-mt-4w")}`}>
                <p className="maq-ref-filters__label">Axe</p>
                <ul className="fr-tags-group">
                  <li>
                    <Tag
                      pressed={axeFilter === "all"}
                      nativeButtonProps={{
                        onClick: () => handleFilterChange(setAxeFilter, "all"),
                      }}
                    >
                      Tous ({allActions.length})
                    </Tag>
                  </li>
                  {(activeRef?.axes ?? []).map((axe) => {
                    const num = axe.id.split("-")[1];
                    const count = axeCounts.get(axe.id) || 0;
                    return (
                      <li key={axe.id}>
                        <Tag
                          pressed={axeFilter === axe.id}
                          nativeButtonProps={{
                            onClick: () =>
                              handleFilterChange(
                                setAxeFilter,
                                axeFilter === axe.id ? "all" : axe.id
                              ),
                          }}
                        >
                          Axe {num} ({count})
                        </Tag>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <hr className="maq-ref-filters__sep" />

              <div className="maq-ref-filters__block">
                <p className="maq-ref-filters__label">Type d'action</p>
                <ul className="fr-tags-group">
                  <li>
                    <Tag
                      pressed={typeFilter === "all"}
                      nativeButtonProps={{
                        onClick: () => handleFilterChange(setTypeFilter, "all"),
                      }}
                    >
                      Tous
                    </Tag>
                  </li>
                  {allTypes.map((type) => {
                    const count = typeCounts.get(type) || 0;
                    return (
                      <li key={type}>
                        <Tag
                          pressed={typeFilter === type}
                          nativeButtonProps={{
                            onClick: () =>
                              handleFilterChange(
                                setTypeFilter,
                                typeFilter === type ? "all" : type
                              ),
                          }}
                        >
                          {type} ({count})
                        </Tag>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Filtre Statut — mode privé uniquement */}
              {!isPublic && (
                <>
                  <hr className="maq-ref-filters__sep" />
                  <div className="maq-ref-filters__block">
                    <p className="maq-ref-filters__label">Statut</p>
                    <ul className="fr-tags-group">
                      <li>
                        <Tag
                          pressed={statutFilter === "all"}
                          nativeButtonProps={{
                            onClick: () =>
                              handleFilterChange(setStatutFilter, "all"),
                          }}
                        >
                          Toutes
                        </Tag>
                      </li>
                      <li>
                        <Tag
                          pressed={statutFilter === "non-declarees"}
                          nativeButtonProps={{
                            onClick: () =>
                              handleFilterChange(
                                setStatutFilter,
                                statutFilter === "non-declarees"
                                  ? "all"
                                  : "non-declarees"
                              ),
                          }}
                        >
                          Non déclarées
                        </Tag>
                      </li>
                      <li>
                        <Tag
                          pressed={statutFilter === "declarees"}
                          nativeButtonProps={{
                            onClick: () =>
                              handleFilterChange(
                                setStatutFilter,
                                statutFilter === "declarees"
                                  ? "all"
                                  : "declarees"
                              ),
                          }}
                        >
                          Déjà déclarées
                        </Tag>
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {/* Réinitialiser les filtres — visible uniquement si au moins un filtre actif */}
              {hasActiveFilters && (
                <div
                  className={`maq-ref-filters__block ${fr.cx("fr-mt-3w")}`}
                >
                  <Button
                    priority="tertiary no outline"
                    size="small"
                    iconId="fr-icon-close-line"
                    iconPosition="right"
                    onClick={resetFilters}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </aside>

          {/* Colonne droite — Liste des actions */}
          <div className={fr.cx("fr-col-12", "fr-col-md-8")}>
            {isPublic && !referentielDisponible ? (
              <Notice
                title={
                  <>
                    <strong>Ce référentiel n'est pas encore publié.</strong>{" "}
                    Vous serez notifié dès sa parution. Vous pouvez consulter
                    le référentiel des Infirmiers en attendant.
                  </>
                }
                isClosable={false}
              />
            ) : (
              <>
            <div className="maq-ref-results-head">
              <h2 className={fr.cx("fr-h6", "fr-mb-0")}>
                Actions{" "}
                <span className="maq-ref-results-head__count">
                  ({filtered.length})
                </span>
              </h2>
            </div>

            <div className="maq-ref-actions">
              {pageItems.length === 0 ? (
                <div className="maq-ref-empty">
                  <p className={fr.cx("fr-text--lg", "fr-mb-1w")}>
                    Aucune action ne correspond à votre recherche.
                  </p>
                  <p
                    className={fr.cx("fr-text--sm", "fr-mb-3w")}
                    style={{ color: "var(--text-mention-grey)" }}
                  >
                    Essayez d'élargir vos filtres ou de modifier votre
                    recherche.
                  </p>
                  <Button
                    priority="secondary"
                    size="small"
                    onClick={() => {
                      setSearch("");
                      setAxeFilter("all");
                      setTypeFilter("all");
                      setPage(1);
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              ) : (
                pageItems.map((item) => {
                  const axeNum = item.axeId.split("-")[1];
                  const declared = declaredByCode.get(item.code);
                  const declaredCount = declared ? 1 : 0;
                  return (
                    <article
                      key={item.code}
                      className="maq-ref-action"
                      onClick={() => handleOpenDetail(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleOpenDetail(item);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Voir le détail de l'action ${item.code}`}
                    >
                      <div className="maq-ref-action__top">
                        <Badge severity="info" small noIcon>
                          Axe {axeNum}
                        </Badge>
                        <span className="maq-ref-action__code">
                          {item.code}
                        </span>
                      </div>
                      <h3 className="maq-ref-action__title">{item.libelle}</h3>
                      <div className="maq-ref-action__footer">
                        <Button
                          priority="secondary"
                          size="small"
                          iconId={
                            isPublic ? "fr-icon-lock-line" : "fr-icon-add-line"
                          }
                          iconPosition="left"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeclareAction(item.code);
                          }}
                        >
                          {isPublic
                            ? "Se connecter pour déclarer"
                            : "Déclarer cette action"}
                        </Button>
                        {!isPublic && declaredCount > 0 && (
                          <span className="maq-ref-action__declared">
                            <span
                              className="fr-icon-check-line"
                              aria-hidden="true"
                            />
                            {declaredCount} action
                            {declaredCount > 1 ? "s" : ""} déjà déclarée
                            {declaredCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {totalPages > 1 && (
              <div className={fr.cx("fr-mt-4w")}>
                <Pagination
                  count={totalPages}
                  defaultPage={safePage}
                  getPageLinkProps={(pageNum) => ({
                    href: "#",
                    onClick: (e: React.MouseEvent) => {
                      e.preventDefault();
                      setPage(pageNum);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    },
                  })}
                />
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Rappel des 4 axes (pédagogique, en bas de page) ═══ */}
      <section className="maq-ref-axes-band">
        <div className={fr.cx("fr-container", "fr-py-8w")}>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            {AXES_INFOS.map((axe, i) => {
              const pictos = [Book, Search, HumanCooperation, Health];
              const Picto = pictos[i];
              return (
                <div
                  key={axe.num}
                  className={fr.cx("fr-col-12", "fr-col-md-6", "fr-col-lg-3")}
                >
                  <div className="maq-ref-axe-card">
                    <Picto className="maq-ref-axe-card__pictogram" />
                    <p className="maq-ref-axe-card__num">Axe {axe.num}</p>
                    <h3 className={fr.cx("fr-h6", "fr-mb-1w")}>{axe.titre}</h3>
                    <p
                      className={fr.cx("fr-text--sm", "fr-mb-0")}
                      style={{ color: "var(--text-mention-grey)" }}
                    >
                      {axe.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Drawer détail action */}
      {drawerAction && (
        <ReferentielActionDrawer
          action={drawerAction.action}
          axeId={drawerAction.axeId}
          declared={declaredByCode.get(drawerAction.action.code)}
          mode={mode}
          onClose={() => setDrawerAction(null)}
          onDeclare={() => {
            if (!drawerAction) return;
            const code = drawerAction.action.code;
            setDrawerAction(null);
            handleDeclareAction(code);
          }}
          onViewDeclaration={() => {
            if (!drawerAction) return;
            const decl = declaredByCode.get(drawerAction.action.code);
            if (decl) {
              setDrawerAction(null);
              navigate(`/maquette/axe/${drawerAction.axeId}?action=${decl.id}`);
            }
          }}
        />
      )}

      {/* Drawer de déclaration (mode privé uniquement) */}
      {!isPublic && (
        <DeclarationDrawer
          open={declDrawerOpen}
          onClose={() => setDeclDrawerOpen(false)}
          preCode={declDrawerCode}
        />
      )}
    </>
  );
}
