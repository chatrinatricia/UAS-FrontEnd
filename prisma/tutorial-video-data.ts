export const initialTutorialVideos = [
  { slot: 1, youtubeId: "9C3805AvgyY", title: "Cara membuat kerak telor khas Betawi" },
  { slot: 2, youtubeId: "lrX0vnz5Wu8", title: "Resep kerak telor Betawi gurih" },
  { slot: 3, youtubeId: "x8pf_0tR6FA", title: "Cara memasak kerak telor di PRJ" },
];

export type TutorialVideo = (typeof initialTutorialVideos)[number];
