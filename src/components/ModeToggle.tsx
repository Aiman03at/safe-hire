export type Mode = "analyzer" | "advisor" | "auditor";

interface Props {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const tabs: { id: Mode; label: string; icon: string; desc: string }[] = [
  { id: "analyzer", label: "Analyze a posting",  icon: "shield-check",    desc: "Job seekers" },
  { id: "advisor",  label: "Find remote jobs",    icon: "briefcase",       desc: "Job seekers" },
  { id: "auditor",  label: "Audit your posting",  icon: "clipboard-check", desc: "Recruiters" },
];

export default function ModeToggle({ mode, onModeChange }: Props) {
  return (
    <div className="flex rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          onClick={() => onModeChange(tab.id)}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-colors ${
            i > 0 ? "border-l border-gray-200" : ""
          } ${
            mode === tab.id
              ? "bg-green-600 text-white"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <i className={`ti ti-${tab.icon}`} />
          <span>{tab.label}</span>
          <span
            className={`hidden sm:inline text-xs font-normal px-1.5 py-0.5 rounded-full ${
              mode === tab.id
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {tab.desc}
          </span>
        </button>
      ))}
    </div>
  );
}
