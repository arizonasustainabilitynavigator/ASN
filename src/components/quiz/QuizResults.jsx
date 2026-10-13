import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw } from "lucide-react";
import { STEP_RECOMMENDATIONS, getTopPriorityFilterLabel } from "@/lib/quizRecommendations";
import { CURATED_RESOURCE_FILTERS } from "@/lib/constants";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/api/client";
import CuratedResourceCard from "@/components/CuratedResourceCard";
import CuratedResourceDetailPanel from "@/components/CuratedResourceDetailPanel";

// Quiz results screen (top-priority resource recommendations)
export default function QuizResults({ answers, onRestart }) {
  // State
  const { isAuthenticated } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);

  const topFilterLabel = getTopPriorityFilterLabel(answers);
  const topFilter = CURATED_RESOURCE_FILTERS.find((f) => f.label === topFilterLabel);

  // Load recommended resources for the top-priority filter
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (topFilter) {
          const { data } = await api.entities.CuratedResource.list({ categoryKeywords: topFilter.keywords, limit: 3 });
          if (!cancelled) setResources(data || []);
        } else if (!cancelled) {
          setResources([]);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setResources([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topFilterLabel]);

  const orgTypeLabel = answers.orgType === "Something else" && answers.orgTypeOther
    ? answers.orgTypeOther
    : answers.orgType;

  const resourceLinkParams = new URLSearchParams();
  if (answers.orgZipCode) resourceLinkParams.set("zip", answers.orgZipCode);
  if (topFilterLabel) resourceLinkParams.set("category", topFilterLabel);
  const resourceLinkQuery = resourceLinkParams.toString();

  // Render
  return (
    <div>
      <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Your Results</p>
      <h1 className="font-heading text-3xl md:text-5xl text-foreground leading-tight mb-4">
        Recommended resources for you
      </h1>
      <p className="text-foreground/70 text-lg mb-10">
        Based on your profile as a {orgTypeLabel} ({answers.employeeCount}), here are resources to get you started.
      </p>

      {topFilter && (
        <div className="border border-primary/30 bg-primary/5 p-6 mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-primary mb-1">Your top priority</p>
          <p className="font-heading text-xl text-foreground">{topFilter.label}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
        </div>
      ) : resources.length > 0 ? (
        <div className="space-y-6 mb-12">
          {resources.map((r) => (
            <CuratedResourceCard key={r.id} resource={r} onClick={() => setSelectedResource(r)} />
          ))}
        </div>
      ) : (
        <div className="space-y-1 mb-12">
          {STEP_RECOMMENDATIONS.other.map((item, i) => (
            <div key={i} className="border border-border p-6 bg-card">
              <h3 className="font-heading text-lg text-foreground mb-2">{item.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <Link
          to={isAuthenticated ? `/resource${resourceLinkQuery ? `?${resourceLinkQuery}` : ""}` : "/register"}
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors"
        >
          Connect with Resources <ArrowRight size={16} />
        </Link>
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-3 border border-foreground text-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-foreground hover:text-background transition-colors"
        >
          <RefreshCw size={16} />
          Retake Quiz
        </button>
      </div>

      {selectedResource && (
        <CuratedResourceDetailPanel resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}
    </div>
  );
}
