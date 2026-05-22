interface ImageProps {
  src: string;
  alt: string;
  caption?: string;
  maxWidth?: number;
}

export function Image({ src, alt, caption, maxWidth = 400 }: ImageProps) {
  return (
    <figure className="inline-block shrink-0 mt-2">
      <img src={src} alt={alt} className="rounded-xl w-full h-auto" style={{ maxWidth }} />
      {caption && <figcaption className="text-neutral-500 text-center mt-1 text-sm">{caption}</figcaption>}
    </figure>
  );
}
