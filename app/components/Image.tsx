interface ImageProps {
  src: string;
  alt: string;
  caption?: string;
  maxWidth?: number;
}

export function Image({ src, alt, caption, maxWidth = 400 }: ImageProps) {
  return (
    <figure className="mt-2 inline-block shrink-0">
      <img
        src={src}
        alt={alt}
        className="h-auto w-full rounded-xl"
        style={{ maxWidth }}
      />
      {caption && (
        <figcaption className="mt-1 text-center text-sm text-neutral-600">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
