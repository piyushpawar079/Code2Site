export default function MonacoEditor ({ value, language, theme = "vs-dark" }) {
  return (
    <div className="w-full h-full bg-gray-900 rounded-lg border border-gray-700 p-4 font-mono text-sm text-gray-300 overflow-auto">
      <pre className="whitespace-pre-wrap">{value || `// ${language} code will appear here...`}</pre>
    </div>
  );
};