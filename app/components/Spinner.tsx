interface SpinnerProps {
  className?: string;
}

export function Spinner({ className = "" }: SpinnerProps) {
  return (
    <div
      className={`h-5 w-5 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent ${className}`}
    />
  );
}
