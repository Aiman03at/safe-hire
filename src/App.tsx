import { useState } from "react";
import ModeToggle from "./components/ModeToggle";
import AnalyzerMode from "./components/AnalyzerMode";
import AdvisorMode from "./components/AdvisorMode";

type Mode = "analyzer" | "advisor";

export default function App() {
  const [mode, setMode] = useState<Mode>("analyzer");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex items-center gap-2 px-6 py-4 bg-white border-b border-gray-200">
        <i className="ti ti-shield-check text-2xl text-green-600" />
        <span className="text-xl font-bold text-gray-900">SafeHire</span>
        <span className="text-sm text-gray-400 ml-1">Know before you apply.</span>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-12 gap-8">
        <ModeToggle mode={mode} onModeChange={setMode} />
        {mode === "analyzer" ? <AnalyzerMode /> : <AdvisorMode />}
      </main>
    </div>
  );
}
