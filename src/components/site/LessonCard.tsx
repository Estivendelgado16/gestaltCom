import type { Lesson } from "@/types";
import { Play, FileText } from "lucide-react";

export function LessonCard({ lesson, compact = false }: { lesson: Lesson; compact?: boolean }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-sm border border-ink/15 transition-colors hover:bg-[color-mix(in_oklab,var(--sand-light)_30%,transparent)] ${compact ? "p-3" : "p-5"}`}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-sand-light">
        <Play className="w-4 h-4 text-ink" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink">{lesson.title}</div>
        {lesson.description && (
          <div className="text-xs mt-0.5 truncate text-ink-soft">{lesson.description}</div>
        )}
      </div>
      <div className="flex gap-2">
        {lesson.video_url && (
          <a
            href={lesson.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors bg-ink text-cream"
          >
            <Play className="w-3 h-3" /> Ver
          </a>
        )}
        {lesson.pdf_url && (
          <a
            href={lesson.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border border-ink/20 text-ink-soft"
          >
            <FileText className="w-3 h-3" /> PDF
          </a>
        )}
      </div>
    </div>
  );
}
