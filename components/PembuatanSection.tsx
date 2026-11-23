import Section from "@/components/Section";

import { getTutorialVideos } from "@/lib/tutorial-videos";

export default async function PembuatanSection() {
  const videos = await getTutorialVideos();
  return (
    <Section
      id="pembuatan"
      label="Langkah demi langkah"
      title="Cara Pembuatan Kerak Telor"
      description="Simak langkah-langkah pembuatan kerak telor khas Betawi melalui video berikut."
    >
      <div className="row row-cols-1 row-cols-lg-3 g-4">
        {videos.map(({ slot, youtubeId, title }) => (
          <div className="col" key={slot}>
            <article className="card h-100 rounded-3 overflow-hidden" style={{ borderColor: "#ae866c", backgroundColor: "#fffaf4" }}>
              <div className="ratio ratio-16x9 bg-dark">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <h3 className="card-body h6 mb-0 text-center" style={{ textWrap: "balance" }}>{title}</h3>
            </article>
          </div>
        ))}
      </div>
    </Section>
  );
}
