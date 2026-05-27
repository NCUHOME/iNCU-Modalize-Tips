import { useNavigate } from "react-router";

interface BackButtonProps {
  visible: boolean;
}

export function BackButton({ visible }: BackButtonProps) {
  const navigate = useNavigate();

  if (!visible) return null;

  const handleClick = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(-1));
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleClick} className="back-btn" aria-label="返回上一页">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      <span>返回</span>
    </button>
  );
}
