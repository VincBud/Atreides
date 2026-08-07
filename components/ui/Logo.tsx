import Image from "next/image";
import Link from "next/link";

import logo from "@/public/brand/atreides-logo-horizontal-dark-2400.png";

type LogoProps = {
  /** Rendered width in pixels; height follows the asset's aspect ratio. */
  width?: number;
  className?: string;
  priority?: boolean;
};

/**
 * The supplied asset is optimised for dark backgrounds and already carries its
 * own clear space. It is never recoloured or stretched — width is set and the
 * height is derived from the imported image's intrinsic ratio.
 */
export function LogoImage({ width = 190, className = "", priority = false }: LogoProps) {
  const height = Math.round((width * logo.height) / logo.width);

  return (
    <Image
      src={logo}
      alt="Atreides — Venue Intelligence"
      width={width}
      height={height}
      priority={priority}
      sizes={`${width}px`}
      className={className}
      style={{ width, height: "auto" }}
    />
  );
}

export function LogoLink({ width = 190, className = "", priority = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center rounded-[4px] ${className}`}
      aria-label="Atreides — zur Startseite"
    >
      <LogoImage width={width} priority={priority} />
    </Link>
  );
}
