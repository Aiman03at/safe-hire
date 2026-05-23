export type Mode = "analyzer" | "advisor" | "auditor";

interface Props {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const TABS: { id: Mode; icon: string; label: string; audience: string }[] = [
  { id: "analyzer", icon: "shield-check",    label: "Analyze",  audience: "Job seekers" },
  { id: "advisor",  icon: "briefcase",        label: "Find jobs", audience: "Job seekers" },
  { id: "auditor",  icon: "clipboard-check",  label: "Audit",    audience: "Recruiters"  },
];

export default function ModeToggle({ mode, onModeChange }: Props) {
  return (
    <div className="inline-flex w-full sm:w-auto bg-stone-100 rounded-xl p-1 gap-1">
      {TABS.map((tab) => {
        const active = mode === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onModeChange(tab.id)}
            className={`
              flex-1 sm:flex-none flex items-center justify-center gap-2
              px-3 sm:px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200 select-none
              ${active
                ? "bg-white text-stone-900 shadow-sm shadow-stone-200/80 font-semibold"
                : "text-stone-500 hover:text-stone-700 hover:bg-white/50"
              }
            `}
          >
            <i className={`ti ti-${tab.icon} text-[15px] ${active ? "text-amber-700" : ""}`} />
            <span>{tab.label}</span>
            {active && (
              <span className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-normal leading-none">
                {tab.audience}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
