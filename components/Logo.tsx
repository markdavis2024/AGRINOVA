import Image from "next/image";

/**
 * AGRINOVA logo — single source of truth for the whole app.
 * The wordmark ("AGRINOVA") is baked into the PNG, so no
 * separate text is needed next to it.
 *
 * Usage:
 *   <Logo />                 // default size (navbar)
 *   <Logo width={130} />     // smaller (footer)
 *   <Logo width={220} />     // larger (auth pages, hero)
 */
export default function Logo({
  width = 160,
  className = "",
}: {
  width?: number;
  className?: string;
}) {
  const height = Math.round((width * 720) / 1325); // locked aspect ratio

  return (
    <Image
      src="/agrinova-logo.png"
      alt="AGRINOVA"
      width={width}
      height={height}
      priority
      className={`agrinova-logo-image ${className}`.trim()}
    />
  );
}