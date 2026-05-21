import { Link } from "react-router";

interface GuideCardProps {
  title: string;
  description: string;
  href: string;
  image?: string;
  pageId: string;
  stagger?: number;
}

export function GuideCard({
  title,
  description,
  href,
  image,
  pageId,
  stagger = 1,
}: GuideCardProps) {
  const delayClass = stagger >= 1 && stagger <= 6 ? `stagger-${stagger}` : "";

  return (
    <Link
      to={href}
      className={`guide-card anim-fade-up ${delayClass}`}
    >
      <div className="guide-card-body">
        {image && (
          <img
            src={image}
            alt=""
            className="brand-icon"
            loading="lazy"
          />
        )}
        <div className="guide-card-content">
          <div className="guide-card-title">{title}</div>
          <p className="guide-card-desc">{description}</p>
        </div>
      </div>
    </Link>
  );
}
