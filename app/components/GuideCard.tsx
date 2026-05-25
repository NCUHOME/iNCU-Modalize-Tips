import { Link } from "react-router";

interface GuideCardProps {
  title: string;
  description: string;
  href: string;
  image?: string;
  pageId: string;
  stagger?: number;
  isLoading?: boolean;
  onClick?: () => void;
}

export function GuideCard({
  title,
  description,
  href,
  image,
  pageId,
  stagger = 1,
  isLoading = false,
  onClick,
}: GuideCardProps) {
  const delayClass = stagger >= 1 && stagger <= 6 ? `stagger-${stagger}` : "";

  return (
    <Link
      to={href}
      viewTransition
      className={`guide-card anim-fade-up ${delayClass} ${isLoading ? "guide-card-loading" : ""}`}
      onClick={(e) => {
        if (isLoading) {
          e.preventDefault();
          return;
        }
        onClick?.();
      }}
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
