'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EmployeeGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  initialCount?: number;
}

export function EmployeeGrid<T extends { id: string }>({ 
  items, 
  renderItem, 
  initialCount = 4 
}: EmployeeGridProps<T>) {
  const [showAll, setShowAll] = useState(false);

  // Ensure we show latest items first
  const sortedItems = [...items].reverse();
  const visibleItems = showAll ? sortedItems : sortedItems.slice(0, initialCount);
  const hasMore = items.length > initialCount;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleItems.map((item) => (
          <React.Fragment key={item.id}>
            {renderItem(item)}
          </React.Fragment>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all shadow-sm hover:shadow-md"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp size={18} />
              </>
            ) : (
              <>
                View More ({items.length - initialCount} more) <ChevronDown size={18} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
