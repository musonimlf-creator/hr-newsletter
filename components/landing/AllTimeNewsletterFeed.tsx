'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { NewsletterPreview } from '@/components/preview/NewsletterPreview';
import type { NewsletterData } from '@/types/newsletter';

type Period = {
  month: string;
  year: string;
  updatedAt: string | null;
  createdAt: string | null;
};

function periodKey(p: { month: string; year: string }) {
  return `${p.month}-${p.year}`;
}

export function AllTimeNewsletterFeed() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [issuesByKey, setIssuesByKey] = useState<Record<string, NewsletterData | null>>({});
  const [loadingPeriods, setLoadingPeriods] = useState(true);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    let cancelled = false;
    async function loadPeriods() {
      setLoadingPeriods(true);
      setError(null);
      try {
        const res = await fetch('/api/newsletter/periods?limit=50&offset=0');
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(json?.error || 'Failed to load newsletter periods');
          setPeriods([]);
          return;
        }
        const data = Array.isArray(json?.data) ? (json.data as Period[]) : [];
        // Filter out empty months/years just in case
        setPeriods(data.filter((p) => p.month && p.year));
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load newsletter periods');
      } finally {
        if (!cancelled) setLoadingPeriods(false);
      }
    }
    loadPeriods();
    return () => {
      cancelled = true;
    };
  }, []);

  const visiblePeriods = useMemo(() => periods.slice(0, visibleCount), [periods, visibleCount]);

  useEffect(() => {
    let cancelled = false;
    async function loadVisibleIssues() {
      if (visiblePeriods.length === 0) return;
      setLoadingIssues(true);
      try {
        const toFetch = visiblePeriods.filter((p) => issuesByKey[periodKey(p)] === undefined);
        if (toFetch.length === 0) return;

        const results = await Promise.all(
          toFetch.map(async (p) => {
            const res = await fetch(`/api/newsletter?month=${encodeURIComponent(p.month)}&year=${encodeURIComponent(p.year)}`);
            const json = await res.json();
            if (!res.ok) {
              return [periodKey(p), null] as const;
            }
            return [periodKey(p), (json?.data as NewsletterData) ?? null] as const;
          })
        );
        if (cancelled) return;
        setIssuesByKey((prev) => {
          const next = { ...prev };
          for (const [k, v] of results) next[k] = v;
          return next;
        });
      } finally {
        if (!cancelled) setLoadingIssues(false);
      }
    }
    loadVisibleIssues();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCount, periods.length]);

  if (loadingPeriods) {
    return <div className="py-12 text-center text-gray-500 italic">Loading newsletters...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">{error}</div>;
  }

  if (periods.length === 0) {
    return <div className="py-12 text-center text-gray-500 italic">No newsletters published yet.</div>;
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#52275A]">All Updates</h2>
        <p className="text-sm text-gray-500">Newest newsletters first. Scroll down for older editions.</p>
      </div>

      {visiblePeriods.map((p) => {
        const k = periodKey(p);
        const issue = issuesByKey[k];
        return (
          <div key={k} className="mb-14">
            <div className="mb-6 flex items-baseline justify-between">
              <h3 className="text-xl font-extrabold text-[#52275A]">
                {p.month} {p.year}
              </h3>
              <div className="text-xs text-gray-400">
                {p.updatedAt ? `Updated ${new Date(p.updatedAt).toLocaleString()}` : p.createdAt ? `Created ${new Date(p.createdAt).toLocaleString()}` : null}
              </div>
            </div>

            {issue === undefined || (loadingIssues && issue === undefined) ? (
              <div className="py-8 text-center text-gray-500 italic">Loading edition...</div>
            ) : issue === null ? (
              <div className="py-8 text-center text-gray-500 italic">Could not load this edition.</div>
            ) : (
              <NewsletterPreview data={issue} />
            )}
          </div>
        );
      })}

      {visibleCount < periods.length && (
        <div className="flex justify-center pt-2 pb-10">
          <button
            type="button"
            className="px-8 py-3 rounded-2xl font-bold shadow-xl border-2 hover:opacity-90 bg-[#52275A] text-white border-[#6E3371]"
            onClick={() => setVisibleCount((c) => Math.min(c + 2, periods.length))}
          >
            View More
          </button>
        </div>
      )}
    </section>
  );
}

