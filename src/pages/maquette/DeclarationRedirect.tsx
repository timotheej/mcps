import { Navigate, useSearchParams } from "react-router-dom";

/**
 * Route legacy : /maquette/declarer (avec éventuels ?axe=…&code=…)
 * → redirige vers le tableau de bord en propageant les params + drapeau d'ouverture
 *   du drawer de déclaration. Le Dashboard lit ce drapeau au mount.
 */
export function DeclarationRedirect() {
  const [searchParams] = useSearchParams();
  const next = new URLSearchParams();
  next.set("declarer", "1");
  const axe = searchParams.get("axe");
  const code = searchParams.get("code");
  if (axe) next.set("axe", axe);
  if (code) next.set("code", code);
  return <Navigate to={`/maquette/tableau-de-bord?${next.toString()}`} replace />;
}
