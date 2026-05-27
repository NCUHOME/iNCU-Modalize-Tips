import { useEffect, useRef, useState } from "react";
import { Skeleton } from "~/components/Skeleton";
import { Spinner } from "~/components/Spinner";

interface ImageProps {
  src: string;
  alt: string;
  caption?: string;
  /** 图片最大宽度（px），传给外层 figure */
  maxWidth?: number;
  /** 图片宽度（px），指定后容器与 <img> 均锁定此值 */
  width?: number;
  /** 图片高度（px），指定后骨架屏可占精确尺寸 */
  height?: number;
  /** 外层 figure 的额外 class */
  className?: string;
  /** <img> 的额外 class */
  imageClassName?: string;
}

export function Image({
  src,
  alt,
  caption,
  maxWidth = 400,
  width,
  height,
  className = "",
  imageClassName = "",
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // 用原生事件 + img.complete 绕过 React 合成事件不可靠的问题
  useEffect(() => {
    setLoaded(false);
    setErrored(false);

    const img = imgRef.current;
    if (!img) return;

    // 图片已由浏览器缓存加载完毕
    if (img.complete) {
      setErrored(img.naturalWidth === 0);
      setLoaded(true);
      return;
    }

    const onLoad = () => setLoaded(true);
    const onError = () => {
      setErrored(true);
      setLoaded(true);
    };

    img.addEventListener("load", onLoad, { once: true });
    img.addEventListener("error", onError, { once: true });

    return () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    };
  }, [src]);

  // ---------- 容器尺寸 ----------
  const figureStyle: React.CSSProperties = { maxWidth };
  if (width) figureStyle.width = width;

  const wrapperStyle: React.CSSProperties = {};
  if (width) wrapperStyle.width = width;
  if (height) {
    wrapperStyle.height = height;
  } else {
    wrapperStyle.minHeight = 80;
  }

  return (
    <figure
      className={`relative mt-2 inline-block shrink-0 overflow-hidden rounded-xl ${className}`}
      style={figureStyle}
    >
      <div className="relative overflow-hidden rounded-xl" style={wrapperStyle}>
        {/* ----- 骨架 / 加载中 ----- */}
        {!loaded && !errored && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2">
            <Skeleton className="absolute inset-0 h-full w-full" />
            <Spinner />
            <span className="z-20 text-xs text-neutral-400">加载中...</span>
          </div>
        )}

        {/* ----- 加载失败 ----- */}
        {errored && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1">
            <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800" />
            <span className="z-20 text-xs text-neutral-400">图片加载失败</span>
          </div>
        )}

        {/* ----- img ----- */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`w-full rounded-xl object-cover align-middle transition-opacity duration-300 ${
            loaded && !errored ? "opacity-100" : "opacity-0"
          } ${imageClassName}`}
        />
      </div>

      {/* ----- 图注 ----- */}
      {caption && (
        <figcaption className="mt-1.5 text-center text-sm text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
