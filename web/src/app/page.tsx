"use client";

import { useState } from "react";
import CollectionPanel from "@/components/CollectionPanel";
import FeaturePanel from "@/components/FeaturePanel";
import Hero from "@/components/Hero";
import InsightPanel from "@/components/InsightPanel";
import ReferenceShelf from "@/components/ReferenceShelf";
import StatePanel from "@/components/StatePanel";
import StatsStrip from "@/components/StatsStrip";
import WorkspacePanel from "@/components/WorkspacePanel";
import { createInsights, createPlan } from "@/lib/api";

const APP_NAME = "Creator Batch Studio";
const TAGLINE = "Build a premium web service that turns a creator's rough YouTube-based content idea into a batchable short-form producti";
const FEATURE_CHIPS = ["hook card", "shot list", "repurpose lane", "publish queue"];
const PROOF_POINTS = ["multi-post content batch", "platform-specific hook variations", "shoot-day checklist", "first screen shows content workflow objects instead of KPI tiles"];
const SURFACE_LABELS = {"hero": "editorial production board", "workspace": "hook card", "result": "shot list", "support": "saved content batches", "collection": "hook card board"};
const PLACEHOLDERS = {"query": "Content angle, audience, or campaign brief", "preferences": "Platforms, tone, cadence, and recording constraints"};
const DEFAULT_STATS = [{"label": "multi-post content batch", "value": "4"}, {"label": "saved content batches", "value": "0"}, {"label": "Readiness score", "value": "88"}];
const READY_TITLE = "assembling a multi-post creator batch live";
const READY_DETAIL = "Show the system turning messy input into a usable short-form creator workflow artifact in one pass. / assembling a multi-post creator batch live / turning a rough angle into a publish-ready workflow";
const COLLECTION_TITLE = "Editorial Production Board stays visible after each run.";
const SUPPORT_TITLE = "Saved Content Batches";
const REFERENCE_TITLE = "Repurpose Lane";
const BUTTON_LABEL = "Generate content batch";
type LayoutKind = "storyboard" | "operations_console" | "studio" | "atlas" | "notebook" | "lab";
const LAYOUT: LayoutKind = "storyboard";
const UI_COPY_TONE = "creator-native and decisive";
const SAMPLE_ITEMS = ["multi-post content batch", "platform-specific hook variations", "shoot-day checklist", "Hook variant"];
const REFERENCE_OBJECTS = ["hook card", "shot list", "repurpose lane", "publish queue", "content batch"];
const HERO_VISUAL = "/hero-scene.svg";
const THUMBS = ["/thumb-1.svg", "/thumb-2.svg", "/thumb-3.svg"];
const DOMAIN_CLASS = "creator-batch-studio";

type PlanItem = { title: string; detail: string; score: number };
type InsightPayload = { insights: string[]; next_actions: string[]; highlights: string[] };
type PlanPayload = { summary: string; score: number; items: PlanItem[]; insights?: InsightPayload };

export default function Page() {
  const [query, setQuery] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<PlanPayload | null>(null);
  const [saved, setSaved] = useState<PlanPayload[]>([]);
  const layoutClass = LAYOUT.replace(/_/g, "-");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const nextPlan = await createPlan({ query, preferences });
      const insightPayload = await createInsights({
        selection: nextPlan.items?.[0]?.title ?? query,
        context: preferences || query,
      });
      const composed = { ...nextPlan, insights: insightPayload };
      setPlan(composed);
      setSaved((previous) => [composed, ...previous].slice(0, 4));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const stats = DEFAULT_STATS.map((stat, index) => {
    if (index === 0) return { ...stat, value: String(FEATURE_CHIPS.length) };
    if (index === 1) return { ...stat, value: String(saved.length) };
    if (index === 2) return { ...stat, value: plan ? String(plan.score) : stat.value };
    return stat;
  });

  const heroNode = (
    <Hero
      appName={APP_NAME}
      tagline={TAGLINE}
      proofPoints={PROOF_POINTS}
      eyebrow={SURFACE_LABELS.hero}
      visualSrc={HERO_VISUAL}
    />
  );
  const statsNode = <StatsStrip stats={stats} />;
  const workspaceNode = (
    <WorkspacePanel
      query={query}
      preferences={preferences}
      onQueryChange={setQuery}
      onPreferencesChange={setPreferences}
      onGenerate={handleGenerate}
      loading={loading}
      features={FEATURE_CHIPS}
      eyebrow={SURFACE_LABELS.workspace}
      queryPlaceholder={PLACEHOLDERS.query}
      preferencesPlaceholder={PLACEHOLDERS.preferences}
      actionLabel={BUTTON_LABEL}
    />
  );
  const primaryNode = error ? (
    <StatePanel eyebrow="Request blocked" title="Request blocked" tone="error" detail={error} />
  ) : plan ? (
    <InsightPanel plan={plan} eyebrow={SURFACE_LABELS.result} />
  ) : (
    <StatePanel eyebrow={SURFACE_LABELS.result} title={READY_TITLE} tone="neutral" detail={READY_DETAIL} />
  );
  const featureNode = (
    <FeaturePanel eyebrow={SURFACE_LABELS.support} title={SUPPORT_TITLE} features={FEATURE_CHIPS} proofPoints={PROOF_POINTS} />
  );
  const collectionNode = <CollectionPanel eyebrow={SURFACE_LABELS.collection} title={COLLECTION_TITLE} saved={saved} />;
  const referenceNode = (
    <ReferenceShelf
      eyebrow={SURFACE_LABELS.support}
      title={REFERENCE_TITLE}
      items={SAMPLE_ITEMS}
      objects={REFERENCE_OBJECTS}
      tone={UI_COPY_TONE}
      thumbs={THUMBS}
    />
  );

  function renderLayout() {
    if (DOMAIN_CLASS === "creator-batch-studio") {
      return (
        <section className="creator-shell">
          <div className="creator-topline">
            <div className="creator-workbench">
              {workspaceNode}
              {statsNode}
            </div>
            {heroNode}
          </div>
          <div className="creator-editorial-stage">
            <div className="creator-side-rail">
              {featureNode}
            </div>
            <div className="creator-primary-rail">{primaryNode}</div>
            <div className="creator-library-rail">
              {referenceNode}
            </div>
          </div>
          <div className="creator-bottomline">
            <div className="creator-collection-rail">
              {collectionNode}
            </div>
            <div className="creator-proof-rail">{referenceNode}</div>
          </div>
        </section>
      );
    }

    if (DOMAIN_CLASS === "weekender-route-postcards") {
      return (
        <section className="travel-shell">
          {heroNode}
          {statsNode}
          <div className="travel-ribbon">{referenceNode}</div>
          <div className="travel-planner-grid">
            <div className="travel-brief-column">{workspaceNode}</div>
            <div className="travel-result-column">
              {primaryNode}
              {collectionNode}
            </div>
            <div className="travel-proof-column">
              {featureNode}
            </div>
          </div>
        </section>
      );
    }

    if (DOMAIN_CLASS === "meal-prep-atlas") {
      return (
        <section className="meal-shell">
          <div className="meal-top-row">
            {heroNode}
            <div className="meal-proof-stack">
              {statsNode}
              {featureNode}
            </div>
          </div>
          <div className="meal-main-grid">
            <div className="meal-planner-column">{workspaceNode}</div>
            <div className="meal-reference-column">{referenceNode}</div>
          </div>
          <div className="meal-bottom-row">
            {primaryNode}
            {collectionNode}
          </div>
        </section>
      );
    }

    if (LAYOUT === "storyboard") {
      return (
        <>
          {heroNode}
          {statsNode}
          <section className="storyboard-stage">
            <div className="storyboard-main">
              {workspaceNode}
              {primaryNode}
            </div>
            <div className="storyboard-side">
              {referenceNode}
              {featureNode}
            </div>
          </section>
          {collectionNode}
        </>
      );
    }

    if (LAYOUT === "operations_console") {
      return (
        <section className="console-shell">
          <div className="console-top">
            {heroNode}
            {statsNode}
          </div>
          <div className="console-grid">
            <div className="console-operator-lane">
              {workspaceNode}
              {referenceNode}
            </div>
            <div className="console-timeline-lane">{primaryNode}</div>
            <div className="console-support-lane">
              {featureNode}
              {collectionNode}
            </div>
          </div>
        </section>
      );
    }

    if (LAYOUT === "studio") {
      return (
        <section className="studio-shell">
          <div className="studio-top">
            {heroNode}
            {primaryNode}
          </div>
          {statsNode}
          <div className="studio-bottom">
            <div className="studio-left">
              {workspaceNode}
              {collectionNode}
            </div>
            <div className="studio-right">
              {referenceNode}
              {featureNode}
            </div>
          </div>
        </section>
      );
    }

    if (LAYOUT === "atlas") {
      return (
        <section className="atlas-shell">
          <div className="atlas-hero-row">
            {heroNode}
            <div className="atlas-side-stack">
              {statsNode}
              {referenceNode}
            </div>
          </div>
          <div className="atlas-main-row">
            <div className="atlas-primary-stack">
              {primaryNode}
              {collectionNode}
            </div>
            <div className="atlas-secondary-stack">
              {workspaceNode}
              {featureNode}
            </div>
          </div>
        </section>
      );
    }

    if (LAYOUT === "notebook") {
      return (
        <section className="notebook-shell">
          {heroNode}
          <div className="notebook-top">
            <div className="notebook-left">
              {primaryNode}
              {referenceNode}
            </div>
            <div className="notebook-right">
              {workspaceNode}
              {featureNode}
            </div>
          </div>
          <div className="notebook-bottom">
            {collectionNode}
            {statsNode}
          </div>
        </section>
      );
    }

    return (
      <>
        {heroNode}
        {statsNode}
        <section className="content-grid">
          {workspaceNode}
          <div className="stack">
            {primaryNode}
            {referenceNode}
            {featureNode}
          </div>
        </section>
        {collectionNode}
      </>
    );
  }

  return (
    <main className={`page-shell layout-${layoutClass} domain-${DOMAIN_CLASS}`}>
      {renderLayout()}
    </main>
    );
}
