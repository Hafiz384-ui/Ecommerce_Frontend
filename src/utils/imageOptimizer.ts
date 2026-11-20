/**
 * Utility to safely optimize image URLs (Cloudinary & Local).
 * Injects Cloudinary transformations (f_auto, q_auto, width resizing)
 * without breaking non-Cloudinary fallback URLs.
 */
export const getOptimizedImageUrl = (
  url?: string | null,
  width?: number,
  quality: "auto" | "good" | "low" = "auto"
): string => {
  if (!url || typeof url !== "string") return "";

  // Check if it's a Cloudinary-hosted image
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    const transformations: string[] = ["f_auto", `q_${quality}`];
    if (width) {
      transformations.push(`c_limit,w_${width}`);
    }

    const transformStr = transformations.join(",") + "/";

    // Avoid duplicate transformations if already present
    if (url.includes(`/upload/${transformStr}`)) {
      return url;
    }

    return url.replace("/upload/", `/upload/${transformStr}`);
  }

  // Fallback for non-Cloudinary / local images
  return url;
};

/**
 * Generates responsive srcSet for Cloudinary URLs
 */
export const getCloudinarySrcSet = (
  url?: string | null,
  widths: number[] = [320, 480, 640, 800, 1024]
): string => {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return "";
  }

  return widths
    .map((w) => `${getOptimizedImageUrl(url, w)} ${w}w`)
    .join(", ");
};
