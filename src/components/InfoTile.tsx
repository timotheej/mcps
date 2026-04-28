import "./InfoTile.css";

type Props = {
  num: string;
  label: string;
  desc: string;
};

export function InfoTile({ num, label, desc }: Props) {
  return (
    <div className="maq-info-tile">
      <p className="maq-info-tile__num">{num}</p>
      <p className="maq-info-tile__label">{label}</p>
      <p className="maq-info-tile__desc">{desc}</p>
    </div>
  );
}
