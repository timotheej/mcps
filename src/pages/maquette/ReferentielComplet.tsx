import { useState, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { getAxeById } from "../../data/maquette";
import "./maquette.css";

export function ReferentielComplet() {
  const { id } = useParams<{ id: string }>();
  const axe = id ? getAxeById(id) : undefined;
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  if (!axe || !id) {
    return <Navigate to="/maquette/tableau-de-bord" replace />;
  }

  const axeNum = axe.id.split("-")[1];

  const types = useMemo(() => {
    const set = new Set(axe.actions.map((a) => a.type));
    return Array.from(set).sort();
  }, [axe.actions]);

  const filtered = useMemo(() => {
    let result = axe.actions;
    if (typeFilter) {
      result = result.filter((a) => a.type === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) =>
        a.libelle.toLowerCase().includes(q)
      );
    }
    return result;
  }, [axe.actions, typeFilter, search]);

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <Breadcrumb
        currentPageLabel="Referentiel complet"
        homeLinkProps={{ to: "/maquette" }}
        segments={[
          {
            label: "Tableau de bord",
            linkProps: { to: "/maquette/tableau-de-bord" },
          },
          {
            label: `Axe ${axeNum}`,
            linkProps: { to: `/maquette/axe/${id}` },
          },
        ]}
      />

      <h1 className={fr.cx("fr-mb-1w")}>
        Referentiel — Axe {axeNum}
      </h1>
      <p className={fr.cx("fr-text--lead", "fr-mb-3w")}>
        {axe.label_court}
      </p>
      <p className={`${fr.cx("fr-text--sm", "fr-mb-4w")} fr-text-mention--grey`}>
        Toutes les actions reconnues par le Conseil National Professionnel
        pour cet axe. Vous pouvez filtrer par type ou rechercher par
        mot-cle.
      </p>

      {/* Recherche */}
      <Input
        label="Rechercher dans le referentiel"
        nativeInputProps={{
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Ex: simulation, protocole, formation...",
        }}
      />

      {/* Filtres par type */}
      <div className="maq-ref__filters">
        <button
          type="button"
          className={`maq-ref__filter-tag${
            typeFilter === null ? " maq-ref__filter-tag--active" : ""
          }`}
          onClick={() => setTypeFilter(null)}
        >
          Tous ({axe.actions.length})
        </button>
        {types.map((type) => {
          const count = axe.actions.filter(
            (a) => a.type === type
          ).length;
          return (
            <button
              key={type}
              type="button"
              className={`maq-ref__filter-tag${
                typeFilter === type
                  ? " maq-ref__filter-tag--active"
                  : ""
              }`}
              onClick={() =>
                setTypeFilter(typeFilter === type ? null : type)
              }
            >
              {type} ({count})
            </button>
          );
        })}
      </div>

      {/* Resultat */}
      <p className="maq-ref__count">
        {filtered.length} action{filtered.length > 1 ? "s" : ""}{" "}
        affichee{filtered.length > 1 ? "s" : ""}
      </p>

      <div>
        {filtered.map((action) => (
          <div key={action.code} className="maq-ref__action-item">
            <p className="maq-ref__action-type">{action.type}</p>
            <p className="maq-ref__action-libelle">{action.libelle}</p>
            <p className="maq-ref__action-code">{action.code}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className={`${fr.cx("fr-text--sm")} fr-text-mention--grey`}>
            Aucune action ne correspond a votre recherche.
          </p>
        )}
      </div>

      {/* Retour */}
      <div className={fr.cx("fr-mt-6w")}>
        <Button
          priority="tertiary"
          iconId="fr-icon-arrow-left-line"
          iconPosition="left"
          linkProps={{ to: `/maquette/axe/${id}` }}
        >
          Retour a l'axe {axeNum}
        </Button>
      </div>
    </div>
  );
}
