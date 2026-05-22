export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex items-center gap-2 px-6 py-4 bg-white border-b border-gray-200">
        <i className="ti ti-shield-check text-2xl text-green-600" />
        <span className="text-xl font-bold text-gray-900">SafeHire</span>
        <span className="text-sm text-gray-400 ml-1">Know before you apply.</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <i className="ti ti-shield-check text-6xl text-green-600 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">SafeHire</h1>
        <p className="text-lg text-gray-500">Know before you apply.</p>
      </main>
    </div>
  )
}
