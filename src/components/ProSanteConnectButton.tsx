import "./ProSanteConnectButton.css";

type Props = {
  onClick?: () => void;
  label?: string;
};

export function ProSanteConnectButton({
  onClick,
  label = "S'identifier avec Pro Santé Connect",
}: Props) {
  return (
    <button type="button" className="psc-button" onClick={onClick}>
      <span
        className="fr-icon-health-book-line psc-button__icon"
        aria-hidden="true"
      />
      <span className="psc-button__label">{label}</span>
    </button>
  );
}
