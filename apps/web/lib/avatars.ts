/**
 * Anime illustrated avatar helper utilizing Dicebear Lorelei (Anime/Manga style).
 * Provides consistent, high-contrast illustrated avatars for students and club leadership.
 */

export const ANIME_AVATARS: Record<string, string> = {
  "rahul-sharma": "https://api.dicebear.com/9.x/lorelei/svg?seed=Rahul&backgroundColor=b6e3f4,c0aede,d1d4f9",
  "ananya-singh": "https://api.dicebear.com/9.x/lorelei/svg?seed=Ananya&backgroundColor=ffd5dc,ffdfbf",
  "dev-kapoor": "https://api.dicebear.com/9.x/lorelei/svg?seed=Dev&backgroundColor=d1d4f9,c0aede",
  "priya-verma": "https://api.dicebear.com/9.x/lorelei/svg?seed=Priya&backgroundColor=ffdfbf,ffd5dc",
};

export function getAnimeAvatar(slugOrName?: string, fallbackSeed?: string): string {
  if (!slugOrName) {
    return "https://api.dicebear.com/9.x/lorelei/svg?seed=CampusStudent&backgroundColor=c0aede";
  }
  const key = slugOrName.toLowerCase().trim().replace(/\s+/g, "-");
  if (ANIME_AVATARS[key]) {
    return ANIME_AVATARS[key];
  }
  const seed = fallbackSeed || slugOrName;
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}
