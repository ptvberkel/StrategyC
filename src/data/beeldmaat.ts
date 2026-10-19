/** Echte afmetingen van een beeld in public/ (voor width/height, tegen layoutverschuiving). */
import sharp from "sharp";
export async function beeldMaat(src: string): Promise<{ breedte: number; hoogte: number }> {
  const m = await sharp(`public${src}`).metadata();
  return { breedte: m.width ?? 1200, hoogte: m.height ?? 900 };
}
