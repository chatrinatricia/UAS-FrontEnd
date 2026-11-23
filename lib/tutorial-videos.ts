import { prisma } from "@/lib/prisma";
export type { TutorialVideo } from "../prisma/tutorial-video-data";

export function getTutorialVideos() {
  return prisma.tutorialVideo.findMany({ orderBy: { slot: "asc" } });
}