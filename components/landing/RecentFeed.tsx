import { useEffect, useMemo, useState } from 'react';
import { RecentPostCard } from './RecentPostCard';

type FeedPost = {
  id: string;
  type:
    | 'newHire'
    | 'promotion'
    | 'transfer'
    | 'birthday'
    | 'anniversary'
    | 'event'
    | 'bestEmployee'
    | 'bestPerformer'
    | 'exit';
  title: string;
  subtitle?: string;
  caption?: string;
  date: string;
};

function toDate(value?: string) {
  return value ? new Date(value).getTime() : 0;
}

interface RecentFeedProps {
  // no props for now – we fetch from the API to build an all‑time feed
}

export default function RecentFeed(_props: RecentFeedProps) {
  const [visibleCount, setVisibleCount] = useState(10);
  const [rawEntries, setRawEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/newsletter/feed');
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(json?.error || 'Failed to load feed');
        } else {
          setRawEntries(Array.isArray(json.data) ? json.data : []);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load feed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const posts: FeedPost[] = useMemo(() => {
    const out: FeedPost[] = [];

    const mapCategoryToType = (category?: string, entryType?: string): FeedPost['type'] | null => {
      switch (category) {
        case 'newHires':
          return 'newHire';
        case 'promotions':
          return 'promotion';
        case 'transfers':
          return 'transfer';
        case 'birthdays':
          return 'birthday';
        case 'anniversaries':
          return 'anniversary';
        case 'events':
          return 'event';
        case 'exitingEmployees':
          return 'exit';
        case 'bestEmployee':
          return 'bestEmployee';
        case 'bestPerformer':
          return 'bestPerformer';
        default:
          // fallback: try to infer from entry_type if needed
          if (entryType === 'event') return 'event';
          return null;
      }
    };

    for (const row of rawEntries) {
      const type = mapCategoryToType(row.category as string | undefined, row.entry_type as string | undefined);
      if (!type) continue;

      const isEvent = type === 'event';
      const title = isEvent ? (row.title as string | undefined) : (row.name as string | undefined);
      if (!title) continue;

      const subtitle = isEvent
        ? ((row.location as string | undefined) ?? undefined)
        : ((row.position as string | undefined) ?? (row.department as string | undefined) ?? undefined);

      const caption =
        row.month && row.year ? `${String(row.month)} ${String(row.year)}` : undefined;

      const dateString =
        (row.date as string | undefined) ||
        (row.created_at as string | undefined) ||
        '';

      out.push({
        id: `${type}-${row.id}`,
        type,
        title,
        subtitle,
        caption,
        date: dateString,
      });
    }

    out.sort((a, b) => toDate(b.date) - toDate(a.date));
    return out;
  }, [rawEntries]);

  return (
    <section className="max-w-3xl mx-auto my-12">
      <h2 className="text-2xl font-bold mb-5 text-[#52275A]">Recent Posts</h2>
      {loading && (
        <div className="text-center text-gray-500 italic">Loading feed...</div>
      )}
      {error && !loading && (
        <div className="text-center text-red-500 text-sm mb-4">{error}</div>
      )}
      {posts.length === 0 && (
        <div className="text-center text-gray-500 italic">No posts yet. Check back soon!</div>
      )}
      {posts.slice(0, visibleCount).map(post => (
        <RecentPostCard
          key={post.id}
          type={post.type}
          title={post.title}
          subtitle={post.subtitle}
          caption={post.caption}
          date={post.date}
        />
      ))}
      {visibleCount < posts.length && (
        <button
          className="mt-8 mx-auto block px-8 py-3 bg-[#52275A] text-white rounded-xl shadow-md hover:bg-[#6E3371] font-bold text-lg"
          onClick={() => setVisibleCount(visibleCount + 10)}
        >
          View More
        </button>
      )}
    </section>
  );
}
