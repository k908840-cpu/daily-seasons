import type { SourceAttribution } from "@/types/content";

/** Editorial source notes. Verify exact editions and quotations before store release. */
export const SOURCES: SourceAttribution[] = [
  {
    id: "web",
    label: "World English Bible (WEB)",
    detail: "Offline Scripture text is sourced from the World English Bible (WEB). Verify the packaged edition against the upstream source before publication.",
    licenseNote: "WEB is a public-domain translation. Source: https://ebible.org/eng-web/",
  },
  {
    id: "daily-seasons-original",
    label: "One Faith original prayers",
    detail: "Original reflections and prayers written for One Faith; not official liturgical texts.",
  },
  {
    id: "bcp-1662-kyrie",
    label: "Kyrie Eleison",
    detail: "Historic wording associated with the 1662 Book of Common Prayer, Church of England.",
  },
  {
    id: "bcp-1662-gloria",
    label: "Gloria Patri (excerpt)",
    detail: "Short excerpt of the traditional doxology associated with the 1662 Book of Common Prayer.",
  },
  {
    id: "orthodox-trisagion",
    label: "Trisagion",
    detail: "Traditional Eastern Christian prayer; compare wording with Orthodox Church in America prayer resources before release.",
  },
  {
    id: "ancient-jesus-prayer",
    label: "Jesus Prayer",
    detail: "Traditional short Eastern Christian invocation.",
  },
  {
    id: "traditional",
    label: "Traditional Christian prayers",
    detail: "Historical prayer texts are identified individually where known. Attribution does not imply endorsement by a church.",
  },
];

export function getSource(id: string): SourceAttribution | undefined {
  return SOURCES.find((s) => s.id === id);
}
