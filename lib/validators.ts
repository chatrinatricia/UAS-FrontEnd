const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const isUrlOrPath = (v: string) => v.startsWith("/") || /^https?:\/\//.test(v);

export type HeroInput = { title: string; subtitle: string; imageUrl: string };

export function parseHero(b: Partial<Record<keyof HeroInput, unknown>>): HeroInput | string {
  const data: HeroInput = { title: text(b.title), subtitle: text(b.subtitle), imageUrl: text(b.imageUrl) };
  if (!data.title) return "Judul slide wajib diisi.";
  if (!isUrlOrPath(data.imageUrl)) return "Gambar harus berupa path (/images/...) atau URL.";
  return data;
}

export type AboutInput = {
  title: string; heading: string; paragraph: string; quote: string; image: string;
  feature1Title: string; feature1Text: string; feature2Title: string; feature2Text: string;
};

export function parseAbout(b: Partial<Record<keyof AboutInput, unknown>>): AboutInput | string {
  const data: AboutInput = {
    title: text(b.title), heading: text(b.heading), paragraph: text(b.paragraph),
    quote: text(b.quote), image: text(b.image),
    feature1Title: text(b.feature1Title), feature1Text: text(b.feature1Text),
    feature2Title: text(b.feature2Title), feature2Text: text(b.feature2Text),
  };
  if (!data.title || !data.heading || !data.paragraph) return "Judul, sub-judul, dan paragraf wajib diisi.";
  if (!isUrlOrPath(data.image)) return "Gambar harus berupa path (/images/...) atau URL.";
  return data;
}
