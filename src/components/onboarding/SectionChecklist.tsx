"use client";

import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FormSection } from "@/lib/formSchema";

type Status = "Not Started" | "In Progress" | "Completed";

interface SectionChecklistProps {
  sections: FormSection[];
  activeSectionId: string;
  statuses: Record<string, Status>;
  onSelect: (sectionId: string) => void;
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "Completed") {
    return <CheckCircle2 className="size-4 text-[#2A674D]" aria-hidden="true" />;
  }
  if (status === "In Progress") {
    return <Clock3 className="size-4 text-[#B0985B]" aria-hidden="true" />;
  }
  return <Circle className="size-4 text-slate-300" aria-hidden="true" />;
}

export function SectionChecklist({
  sections,
  activeSectionId,
  statuses,
  onSelect,
}: SectionChecklistProps) {
  return (
    <>
      <div className="lg:hidden">
        <label
          htmlFor="section-jump"
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-[#475569]"
        >
          Section
        </label>
        <select
          id="section-jump"
          value={activeSectionId}
          onChange={(event) => onSelect(event.target.value)}
          className="focus-ring h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#083A25] transition duration-200 ease-out"
        >
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.title} - {statuses[section.id] ?? "Not Started"}
            </option>
          ))}
        </select>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-28 space-y-3">
          <p className="px-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#B0985B]">
            Onboarding checklist
          </p>
          <nav aria-label="Onboarding sections" className="space-y-2">
            {sections.map((section) => {
              const status = statuses[section.id] ?? "Not Started";
              const isActive = section.id === activeSectionId;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => onSelect(section.id)}
                  className={cn(
                    "focus-ring w-full rounded-2xl border p-4 text-left transition duration-200 ease-out active:scale-[0.995]",
                    isActive
                      ? "border-[#DACDA6] bg-[#F7F4EC] shadow-sm"
                      : "border-transparent bg-transparent hover:border-[#E5E7EB] hover:bg-white",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1">
                      <StatusIcon status={status} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#111827]">
                        {section.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#475569]">
                        {section.description}
                      </span>
                      <Badge
                        tone={
                          status === "Completed"
                            ? "complete"
                            : status === "In Progress"
                              ? "progress"
                              : "neutral"
                        }
                        className="mt-3"
                      >
                        {status}
                      </Badge>
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
