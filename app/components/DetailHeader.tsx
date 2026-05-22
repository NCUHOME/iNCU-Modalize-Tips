interface DetailHeaderProps {
  title: string;
  image?: string | null;
}

export function DetailHeader({ title, image }: DetailHeaderProps) {
  return (
    <div className="detail-header">
      {image && <img src={image} alt="" className="brand-icon-lg" />}
      <div className="detail-header-text">
        <h1>{title}</h1>
        <p className="meta-date">最后更新：2026年5月</p>
      </div>
    </div>
  );
}
