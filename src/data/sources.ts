import type { SourceAttribution } from "@/types/content";

export const SOURCES: SourceAttribution[] = [
  {
    id: "web",
    label: "World English Bible (WEB)",
    detail: "Public-domain scripture translation. Edition and license to be confirmed by content owner.",
    licenseNote: "Placeholder — confirm WEB edition before release.",
  },
  {
    id: "traditional",
    label: "Traditional public-domain prayers",
    detail: "Historic Christian prayers in wording verified as public domain.",
  },
  {
    id: "placeholder",
    label: "Content pending",
    detail: "Passage or prayer text not yet supplied; replace before release.",
  },
];

export function getSource(id: string): SourceAttribution | undefined {
  return SOURCES.find((s) => s.id === id);
}
