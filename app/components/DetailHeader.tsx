interface DetailHeaderProps {
  categoryTitle: string;
  title: string;
  description: string;
  image?: string | null;
}

export function DetailHeader({ categoryTitle, title, description, image }: DetailHeaderProps) {
  return (
    <div className="detail-header">
      <div
        style={{
          width: 3,
          height: 28,
          borderRadius: 2,
          backgroundColor: "var(--accent)",
          flexShrink: 0,
        }}
      />
      <div className="detail-header-text">
        <p className="category-label">{categoryTitle}</p>
        <h1>{title}</h1>
        <p className="detail-description">{description}</p>
      </div>
      {image && <img src={image} alt="" className="brand-icon-lg" />}
    </div>
  );
}
