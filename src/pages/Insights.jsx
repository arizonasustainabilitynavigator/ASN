import React, { useState } from "react";
import { FileText, Download, ExternalLink, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const SECTIONS = [
  {
    title: "White Papers",
    items: [
      {
        name: "Understanding Barriers to Sustainability Adoption for Arizona Small Businesses, Nonprofits, and Economic Development Agencies",
        description:
          "A 45-page white paper from the IEDC / Flinn Foundation Sustainability Learning Lab, based on a statewide survey of 125 Arizona organizations, 12 stakeholder interviews, and a scan of 30+ sustainability tools and 50+ funding programs — the research foundation the Navigator is built on.",
        file: "Flinn Foundation Sustainability Learning Lab_Understanding Barriers to Sustainability Adoption for Arizona Small Businesses and Nonprofits_PUBLISH_White Paper.pdf",
      },
    ],
  },
  {
    title: "Research & Data",
    items: [
      {
        name: "Sustainable Practices Readiness Survey — Research Data Summary",
        description:
          "Raw response data from the 125-organization statewide survey referenced in the white paper above, question by question.",
        file: "International Economic Development Council_Research Data_Summary_Sustainable Practices Readiness Survey.pdf.pdf",
      },
      {
        name: "IEDC Capstone Stakeholder Interview",
        description:
          "Full interview transcript with Circular Arizona, one of the qualitative stakeholder interviews behind the research findings.",
        file: "International Economic Development Council_Capstone Interview Questions.docx.pdf",
      },
    ],
  },
  {
    title: "About the Project",
    items: [
      {
        name: "Arizona Sustainability Navigator — One Page Overview",
        description:
          "A one-page summary of the Navigator's purpose, scope, and planned site structure.",
        file: "LOCAL FIRST ARIZONA_Green Business Boot Camp_One page summary_Arizona Sustainability Navigator_Tyler Butler_One Pager_Post GBBC.pdf",
      },
      {
        name: "Collaboration for Good — Project Pitch",
        description:
          "The project's origin story and partnership pitch — how the Navigator grew out of the IEDC/Flinn Sustainability Learning Lab and Local First Arizona's Green Business Boot Camp.",
        file: "Local First Arizona Green Business Boot Camp_Project Pitch Template_Arizona Sustainability Navigator_Tyler Butler.pdf",
      },
    ],
  },
];

function fileUrl(file) {
  return `${import.meta.env.BASE_URL}insights/${encodeURIComponent(file)}`;
}

function DownloadLink({ item }) {
  return (
    <a
      href={fileUrl(item.file)}
      download={item.file}
      aria-label={`Download ${item.name}`}
      onClick={(e) => e.stopPropagation()}
      className="shrink-0 text-foreground/30 hover:text-primary transition-colors"
    >
      <Download size={18} />
    </a>
  );
}

function FeaturedCard({ item, onPreview }) {
  return (
    <button
      type="button"
      onClick={() => onPreview(item)}
      className="group w-full flex flex-col md:flex-row md:items-center gap-6 md:gap-10 p-8 md:p-10 border border-border hover:border-primary/30 transition-colors text-left bg-card"
    >
      <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(var(--accent))]/10">
        <FileText className="text-[hsl(var(--accent))]" size={26} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading text-xl md:text-2xl text-foreground mb-2 leading-snug">{item.name}</h3>
        <p className="text-foreground/70 text-sm leading-relaxed">{item.description}</p>
      </div>
      <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-3 shrink-0">
        <span className="inline-flex items-center gap-1.5 text-xs tracking-[0.1em] uppercase text-primary group-hover:text-foreground transition-colors whitespace-nowrap">
          <Info size={14} /> Preview
        </span>
        <DownloadLink item={item} />
      </div>
    </button>
  );
}

function GridCard({ item, onPreview }) {
  return (
    <button
      type="button"
      onClick={() => onPreview(item)}
      className="group flex flex-col h-full p-8 border border-border hover:border-primary/30 transition-colors text-left bg-card"
    >
      <div className="flex items-start justify-between mb-4">
        <FileText className="text-[hsl(var(--accent))]" size={28} />
        <DownloadLink item={item} />
      </div>
      <h3 className="font-heading text-lg text-foreground mb-2 leading-snug line-clamp-2">{item.name}</h3>
      <p className="text-foreground/70 text-sm leading-relaxed mb-4 line-clamp-3">{item.description}</p>
      <div className="mt-auto pt-4 border-t border-border/60">
        <span className="inline-flex items-center gap-1.5 text-xs tracking-[0.1em] uppercase text-primary group-hover:text-foreground transition-colors">
          <Info size={14} /> Preview
        </span>
      </div>
    </button>
  );
}

export default function Insights() {
  const [previewItem, setPreviewItem] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="copper-thread" />
      <Navbar />

      <div className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Insights</p>
          <h1 className="font-heading text-4xl md:text-6xl text-foreground leading-tight mb-6 max-w-3xl">
            Raw data, research, and white papers
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl leading-relaxed">
            The evidence behind the Navigator — statewide survey data, stakeholder interviews, and the research that shaped what we're building.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <div className="h-[0.5px] bg-border mb-16 md:mb-24" />

        {SECTIONS.map((section, i) => (
          <div key={section.title} className={i < SECTIONS.length - 1 ? "mb-20 md:mb-28" : ""}>
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-heading text-2xl md:text-3xl text-foreground">{section.title}</h2>
              <span className="text-xs tracking-[0.15em] uppercase text-foreground/40">
                {section.items.length} {section.items.length === 1 ? "Document" : "Documents"}
              </span>
            </div>

            {section.items.length === 1 ? (
              <FeaturedCard item={section.items[0]} onPreview={setPreviewItem} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {section.items.map((item) => (
                  <GridCard key={item.file} item={item} onPreview={setPreviewItem} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent
          className="p-6 !animate-none"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "95vw",
            height: "94vh",
            maxWidth: "1400px",
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-heading pr-8">{previewItem?.name}</DialogTitle>
            <DialogDescription className="flex items-center justify-between gap-4">
              <span>{previewItem?.description}</span>
              {previewItem && (
                <a
                  href={fileUrl(previewItem.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 text-primary hover:text-foreground transition-colors whitespace-nowrap"
                >
                  Open in new tab <ExternalLink size={14} />
                </a>
              )}
            </DialogDescription>
          </DialogHeader>
          {previewItem && (
            <iframe
              src={fileUrl(previewItem.file)}
              title={previewItem.name}
              className="w-full border border-border"
              style={{ flex: "1 1 0%", minHeight: 0 }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
