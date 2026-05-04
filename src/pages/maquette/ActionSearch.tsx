import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import {
  searchDeclarableActions,
  tokenizeQuery,
  normalizeWithMap,
  getAxeById,
  type DeclarableAction,
  type SearchResult,
} from "../../data/maquette";

const DEBOUNCE_MS = 300;
const MIN_CHARS = 3;

export type ActionSearchProps = {
  /** Si fourni, restreint la recherche à cet axe (entrée B). */
  axeIdFilter?: string;
  /** Codes des actions déjà déclarées. */
  declaredCodes: Set<string>;
  /** Appelé quand le PS clique sur un résultat. Reçoit l'action et la requête saisie. */
  onSelect: (action: DeclarableAction, query: string) => void;
  /** Notifié à chaque modification du champ. */
  onQueryChange?: (query: string) => void;
  /** Bascule en mode manuel (cascade axe → action). */
  onSwitchToManual: () => void;
};

export function ActionSearch({
  axeIdFilter,
  declaredCodes,
  onSelect,
  onQueryChange,
  onSwitchToManual,
}: ActionSearchProps) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (!containerRef.current) return;
      if (e.target instanceof Node && !containerRef.current.contains(e.target)) {
        setDismissed(true);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const trimmed = debounced.trim();
  const results = useMemo<SearchResult[]>(() => {
    if (trimmed.length < MIN_CHARS) return [];
    return searchDeclarableActions(debounced, { axeIdFilter, declaredCodes });
  }, [debounced, trimmed, axeIdFilter, declaredCodes]);

  const terms = useMemo(() => tokenizeQuery(debounced), [debounced]);

  const isSearching = query.trim().length >= MIN_CHARS;
  const showDropdown = isSearching && !dismissed;
  const showResults = showDropdown && results.length > 0;
  const showEmpty = showDropdown && trimmed.length >= MIN_CHARS && results.length === 0;
  const showIdleHint = !isSearching;

  return (
    <div ref={containerRef} className="maq-decl-search">
      <div className="maq-decl-search__field">
        <Input
          label="Rechercher une action"
          hintText="Décrivez l'action que vous avez réalisée — par exemple « DU plaies », « groupe d'analyse de pratiques », « calendrier vaccinal »."
          nativeInputProps={{
            type: "search",
            value: query,
            placeholder: "Décrivez ce que vous avez fait…",
            onChange: (e) => {
              const v = e.target.value;
              setQuery(v);
              setDismissed(false);
              onQueryChange?.(v);
            },
            onFocus: () => setDismissed(false),
          }}
        />
        <span
          className={`maq-decl-search__icon fr-icon-search-line`}
          aria-hidden="true"
        />
      </div>

      {showResults && (
        <div
          className="maq-decl-search__results"
          role="listbox"
          aria-label="Résultats de la recherche"
        >
          {results.map((r) => (
            <ResultCard
              key={r.action.code}
              result={r}
              terms={terms}
              showAxeBadge={!axeIdFilter}
              onSelect={(a) => onSelect(a, debounced)}
            />
          ))}
        </div>
      )}

      {showEmpty && (
        <div className="maq-decl-search__empty">
          <p className={fr.cx("fr-text--sm", "fr-mb-2w")}>
            <strong>Aucune action ne correspond.</strong>
            <br />
            Essayez d'autres mots-clés, ou choisissez votre action en parcourant le référentiel par axe.
          </p>
          <Button
            priority="primary"
            iconId="fr-icon-list-unordered"
            iconPosition="left"
            onClick={onSwitchToManual}
          >
            Choisir manuellement par axe
          </Button>
        </div>
      )}

      {showIdleHint && (
        <p className={`maq-decl-search__idle ${fr.cx("fr-text--sm")}`}>
          Vous préférez parcourir le référentiel ?{" "}
          <button
            type="button"
            className="maq-decl-search__manual-link"
            onClick={onSwitchToManual}
          >
            Choisir manuellement par axe
          </button>
        </p>
      )}
    </div>
  );
}

function ResultCard({
  result,
  terms,
  showAxeBadge,
  onSelect,
}: {
  result: SearchResult;
  terms: string[];
  showAxeBadge: boolean;
  onSelect: (action: DeclarableAction) => void;
}) {
  const { action, alreadyDeclared } = result;
  const axe = getAxeById(action.axeId);
  const axeNum = action.axeId.split("-")[1];
  const className = `maq-decl-search__card${
    alreadyDeclared ? " maq-decl-search__card--disabled" : ""
  }`;
  const onClick = () => {
    if (!alreadyDeclared) onSelect(action);
  };
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={alreadyDeclared}
      aria-disabled={alreadyDeclared}
    >
      <div className="maq-decl-search__card-head">
        {showAxeBadge && axe && (
          <span className="maq-decl-search__card-axe">
            Axe {axeNum} · {axe.label_court}
          </span>
        )}
        <Badge small noIcon severity="info">
          {action.type}
        </Badge>
      </div>
      <p className="maq-decl-search__card-libelle">
        {highlightTerms(action.libelle, terms)}
      </p>
      <p className="maq-decl-search__card-code">
        {action.code}
        {alreadyDeclared && (
          <span className="maq-decl-search__card-state"> · déjà déclarée</span>
        )}
      </p>
    </button>
  );
}

function highlightTerms(text: string, terms: string[]): ReactNode[] {
  if (terms.length === 0) return [text];
  const { norm, map } = normalizeWithMap(text);
  const ranges: Array<[number, number]> = [];
  for (const term of terms) {
    if (!term) continue;
    let idx = 0;
    while ((idx = norm.indexOf(term, idx)) !== -1) {
      const startOrig = map[idx];
      const endIdx = idx + term.length - 1;
      const endOrig = endIdx < map.length ? map[endIdx] + 1 : text.length;
      ranges.push([startOrig, endOrig]);
      idx += term.length;
    }
  }
  if (ranges.length === 0) return [text];
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) {
      last[1] = Math.max(last[1], r[1]);
    } else {
      merged.push([r[0], r[1]]);
    }
  }
  const out: ReactNode[] = [];
  let pos = 0;
  for (let i = 0; i < merged.length; i++) {
    if (pos < merged[i][0]) out.push(text.slice(pos, merged[i][0]));
    out.push(
      <mark key={i} className="maq-decl-search__match">
        {text.slice(merged[i][0], merged[i][1])}
      </mark>
    );
    pos = merged[i][1];
  }
  if (pos < text.length) out.push(text.slice(pos));
  return out;
}
