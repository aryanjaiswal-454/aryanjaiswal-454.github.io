interface SectionHeadingProps {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({
  id,
  number,
  eyebrow,
  title,
  description
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div className="section-heading__meta">
        <span className="section-heading__number">{number}</span>
        <span className="section-heading__eyebrow">{eyebrow}</span>
      </div>
      <div className="section-heading__content">
        <h2 id={id}>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
