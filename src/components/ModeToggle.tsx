type Mode = "analyzer" | "advisor";

interface Props {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export default function ModeToggle({ mode, onModeChange }: Props) {
  return (
    <div className="flex rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => onModeChange("analyzer")}
        className={`px-5 py-2.5 text-sm font-semibold transition-colors ${
          mode === "analyzer"
            ? "bg-green-600 text-white"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        Analyze a posting
      </button>
      <button
        onClick={() => onModeChange("advisor")}
        className={`px-5 py-2.5 text-sm font-semibold transition-colors border-l border-gray-200 ${
          mode === "advisor"
            ? "bg-green-600 text-white"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        Find remote jobs
      </button>
    </div>
  );
}
