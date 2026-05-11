import { useMemo, useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import {
  FAQ_ITEMS,
  CONTACTS_BY_PROFESSION,
  type FaqCategorie,
  type Interlocuteur,
} from "../../data/interlocuteurs";

// La catégorie "Outil MCPS" est exclue : ses sujets (connexion, bug)
// sont traités en §1 dans le sous-bloc Support technique.
const FAQ_CATEGORIES_VISIBLES: FaqCategorie[] = [
  "Référentiel",
  "Cycle",
  "Mes données",
];

function InterlocuteurBadge({ value }: { value: Interlocuteur }) {
  if (value === "ANS" || value === "DPO") {
    return (
      <Badge small noIcon>
        {value === "DPO" ? "DPO de l'ANS" : "Équipe MCPS (ANS)"}
      </Badge>
    );
  }
  return (
    <Badge severity="info" small noIcon>
      {value === "CNP" ? "Votre CNP" : "Votre Ordre"}
    </Badge>
  );
}

export function Aide() {
  const [professionId, setProfessionId] = useState<string>("");

  const itemsByCategorie = useMemo(() => {
    const map: Record<FaqCategorie, typeof FAQ_ITEMS> = {
      Référentiel: [],
      Cycle: [],
      "Mes données": [],
      "Outil MCPS": [],
    };
    FAQ_ITEMS.forEach((it) => map[it.categorie].push(it));
    return map;
  }, []);

  const selectedProfession = CONTACTS_BY_PROFESSION.find(
    (p) => p.id === professionId
  );

  return (
    <div className={`${fr.cx("fr-container", "fr-mt-4w", "fr-mb-8w")}`}>
      <Breadcrumb
        currentPageLabel="Aide"
        segments={[{ label: "Accueil", linkProps: { to: "/" } }]}
      />

      {/* En-tête */}
      <div className={fr.cx("fr-grid-row", "fr-mb-6w")}>
        <div className={fr.cx("fr-col-12", "fr-col-lg-9")}>
          <h1 className={fr.cx("fr-mb-2w")}>Besoin d'aide&nbsp;?</h1>
          <p className={fr.cx("fr-text--lead", "fr-mb-2w")}>
            Trouvez vos points de contact selon votre besoin. Pour les
            questions métier (référentiel, actions, cycle), votre Ordre ou
            votre CNP est le bon interlocuteur. Pour un problème technique sur
            l'outil, contactez l'équipe MCPS.
          </p>
        </div>
      </div>

      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        {/* Sommaire latéral */}
        <aside
          className={fr.cx("fr-col-12", "fr-col-md-3")}
          aria-label="Sur cette page"
        >
          <nav className="maq-toc" aria-label="Sommaire">
            <p className="maq-toc__title">Sur cette page</p>
            <ul className="maq-toc__list">
              <li>
                <a className="maq-toc__link" href="#contacts">
                  Vos points de contact
                </a>
              </li>
              <li>
                <a className="maq-toc__link" href="#questions">
                  Questions fréquentes
                </a>
              </li>
              <li>
                <a className="maq-toc__link" href="#ressources">
                  Pour aller plus loin
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Contenu */}
        <div className={fr.cx("fr-col-12", "fr-col-md-9")}>
          {/* §1 — Vos points de contact (Ordre / CNP + support technique) */}
          <section className="maq-info-section" aria-labelledby="contacts">
            <h2 id="contacts" className={fr.cx("fr-h3", "fr-mb-2w")}>
              Vos points de contact
            </h2>
            <p className={fr.cx("fr-text--md", "fr-mb-3w")}>
              Sélectionnez votre profession pour afficher les coordonnées de
              votre Ordre et de votre CNP.
            </p>

            <div
              role="radiogroup"
              aria-label="Sélection de la profession"
              className="maq-aide-tiles"
            >
              {CONTACTS_BY_PROFESSION.map((p) => {
                const isSelected = professionId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`maq-aide-tile${isSelected ? " maq-aide-tile--selected" : ""}`}
                    onClick={() => setProfessionId(p.id)}
                  >
                    <span
                      className={`${p.icon} maq-aide-tile__icon`}
                      aria-hidden="true"
                    />
                    <span className="maq-aide-tile__label">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {selectedProfession ? (
              <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
                <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                  <div className="maq-info-axis">
                    <Badge severity="info" small noIcon>
                      Votre Ordre
                    </Badge>
                    <h3 className={fr.cx("fr-h6", "fr-mt-2w", "fr-mb-2w")}>
                      {selectedProfession.ordre.nom}
                    </h3>
                    <ul className="maq-info-list">
                      <li>
                        <a
                          className={fr.cx(
                            "fr-link",
                            "fr-link--icon-right",
                            "fr-icon-external-link-line"
                          )}
                          href={selectedProfession.ordre.site}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {selectedProfession.ordre.siteLabel}
                        </a>
                      </li>
                      {selectedProfession.ordre.trouver && (
                        <li>
                          <a
                            className={fr.cx(
                              "fr-link",
                              "fr-link--icon-right",
                              "fr-icon-external-link-line"
                            )}
                            href={selectedProfession.ordre.trouver.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {selectedProfession.ordre.trouver.label}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                  <div className="maq-info-axis">
                    <Badge severity="info" small noIcon>
                      Votre CNP
                    </Badge>
                    <h3 className={fr.cx("fr-h6", "fr-mt-2w", "fr-mb-2w")}>
                      {selectedProfession.cnp.nom}
                    </h3>
                    {selectedProfession.cnp.site && (
                      <ul className="maq-info-list">
                        <li>
                          <a
                            className={fr.cx(
                              "fr-link",
                              "fr-link--icon-right",
                              "fr-icon-external-link-line"
                            )}
                            href={selectedProfession.cnp.site}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Site officiel
                          </a>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="maq-empty-card" role="status">
                <span
                  className="fr-icon-information-line"
                  aria-hidden="true"
                />
                <p className={fr.cx("fr-mb-0", "fr-text--md")}>
                  Sélectionnez votre profession ci-dessus pour afficher les
                  coordonnées de votre Ordre national et de votre Conseil
                  National Professionnel.
                </p>
              </div>
            )}

            <Notice
              className={fr.cx("fr-mt-3w")}
              title="Une fois connecté à Ma Certif' Pro Santé, vos coordonnées Ordre et CNP s'affichent automatiquement selon votre inscription RPPS."
              isClosable={false}
            />

            {/* ─── Support technique ANS (sous-bloc, déprioritisé) ─── */}
            <div className="maq-aide-support">
              <h3 className={fr.cx("fr-h6", "fr-mb-2w")}>
                Problème technique sur l'outil
              </h3>
              <p className={fr.cx("fr-text--sm", "fr-mb-2w")}>
                Avant de nous écrire, vérifiez&nbsp;:
              </p>
              <ul className={`maq-info-list ${fr.cx("fr-text--sm")}`}>
                <li>
                  Que vous utilisez bien votre carte CPS ou l'application e-CPS
                </li>
                <li>Que votre carte est en cours de validité</li>
                <li>
                  Que votre RPPS est bien enregistré auprès de votre Ordre
                </li>
              </ul>
              <ul
                className={`maq-info-list ${fr.cx("fr-mt-2w", "fr-text--sm")}`}
              >
                <li>
                  <a
                    className={fr.cx(
                      "fr-link",
                      "fr-link--icon-right",
                      "fr-icon-external-link-line",
                      "fr-link--sm"
                    )}
                    href="https://esante.gouv.fr/produits-services/pro-sante-connect"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Aide Pro Santé Connect (problème d'authentification)
                  </a>
                </li>
                <li>
                  <a
                    className={fr.cx(
                      "fr-link",
                      "fr-link--icon-left",
                      "fr-icon-mail-line",
                      "fr-link--sm"
                    )}
                    href="mailto:support-mcps@esante.gouv.fr"
                  >
                    Bug ou anomalie sur MCPS&nbsp;: support-mcps@esante.gouv.fr
                  </a>
                </li>
                <li>
                  <a
                    className={fr.cx(
                      "fr-link",
                      "fr-link--icon-left",
                      "fr-icon-mail-line",
                      "fr-link--sm"
                    )}
                    href="mailto:dpo@esante.gouv.fr"
                  >
                    Exercice de vos droits (RGPD)&nbsp;: dpo@esante.gouv.fr
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* §2 — Questions fréquentes (référence) */}
          <section className="maq-info-section" aria-labelledby="questions">
            <h2 id="questions" className={fr.cx("fr-h3", "fr-mb-2w")}>
              Questions fréquentes
            </h2>
            <p className={fr.cx("fr-text--md", "fr-mb-3w")}>
              Si vous ne savez pas qui contacter, ces questions peuvent vous
              orienter. Chaque réponse précise l'interlocuteur compétent.
            </p>

            {FAQ_CATEGORIES_VISIBLES.map((cat) => {
              const items = itemsByCategorie[cat];
              if (items.length === 0) return null;
              return (
                <div key={cat} className={fr.cx("fr-mb-4w")}>
                  <h3 className={fr.cx("fr-h6", "fr-mb-2w")}>{cat}</h3>
                  <div className={fr.cx("fr-accordions-group")}>
                    {items.map((it) => (
                      <Accordion key={it.q} label={it.q}>
                        <p className={fr.cx("fr-mb-2w")}>{it.a}</p>
                        <div className="maq-faq-interlocuteur">
                          <span className="maq-faq-interlocuteur__label">
                            Pour aller plus loin&nbsp;:
                          </span>
                          <InterlocuteurBadge value={it.interlocuteur} />
                        </div>
                      </Accordion>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          {/* §3 — Pour aller plus loin */}
          <section className="maq-info-section" aria-labelledby="ressources">
            <h2 id="ressources" className={fr.cx("fr-h3", "fr-mb-3w")}>
              Pour aller plus loin
            </h2>
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                <Card
                  border
                  enlargeLink
                  title="Comprendre la certification périodique"
                  titleAs="h3"
                  desc="Cadre légal, cycle, axes, acteurs : tout ce qu'il faut savoir avant de vous connecter."
                  linkProps={{ to: "/en-savoir-plus" }}
                />
              </div>
              <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                <Card
                  border
                  enlargeLink
                  title="Tous les référentiels"
                  titleAs="h3"
                  desc="Découvrez les actions par profession et par axe, sans vous connecter."
                  linkProps={{ to: "/referentiel" }}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
