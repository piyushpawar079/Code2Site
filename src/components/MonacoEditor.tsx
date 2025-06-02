import Editor from '@monaco-editor/react';

export default function MonacoEditor ({ file }: { file: { content?: string } }) {
  return(
    <Editor
      height="100%"
      // defaultLanguage="typescript"
      theme="vs-dark"
      value={file?.content || ''}
      options={{
        readOnly: false,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
      }}
    />
  );
};