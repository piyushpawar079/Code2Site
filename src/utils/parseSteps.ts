import { Step, StepType } from '@/types/steps';

export function parseXml(response: string): Step[] {
  const steps: Step[] = [];
  let stepId = 1;

  // Check for boltArtifact format (legacy)
  const xmlMatch = response.match(/<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/);
  
  if (xmlMatch) {
    // Handle legacy boltArtifact format
    const xmlContent = xmlMatch[1];
    
    const titleMatch = response.match(/title="([^"]*)"/);
    const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';

    steps.push({
      id: stepId++,
      title: artifactTitle,
      description: '',
      type: StepType.CreateFolder,
      status: 'pending'
    });

    const actionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;
    
    let match;
    while ((match = actionRegex.exec(xmlContent)) !== null) {
      const [, type, filePath, content] = match;

      if (type === 'file') {
        steps.push({
          id: stepId++,
          title: `Create ${filePath || 'file'}`,
          description: '',
          type: StepType.CreateFile,
          status: 'pending',
          code: content.trim(),
          path: filePath
        });
      } else if (type === 'shell') {
        steps.push({
          id: stepId++,
          title: 'Run command',
          description: '',
          type: StepType.RunScript,
          status: 'pending',
          code: content.trim()
        });
      }
    }
  } else {
    // Handle new text-based format
    const lines = response.split('\n');
    let currentFile = '';
    let currentContent = '';
    let inCodeBlock = false;
    let codeBlockLanguage = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for file headers (e.g., "eslint.config.js:", "src/App.tsx:")
      const fileMatch = line.match(/^([a-zA-Z0-9._/-]+\.(js|ts|tsx|jsx|json|html|css|md|txt|config\.js|config\.ts)):\s*$/);
      
      if (fileMatch) {
        // Save previous file if exists
        if (currentFile && currentContent.trim()) {
          steps.push({
            id: stepId++,
            title: `Create ${currentFile}`,
            description: '',
            type: StepType.CreateFile,
            status: 'pending',
            code: currentContent.trim(),
            path: currentFile
          });
        }

        // Start new file
        currentFile = fileMatch[1];
        currentContent = '';
        inCodeBlock = false;
        continue;
      }

      // Check for code block start
      const codeBlockStart = line.match(/^```(\w+)?/);
      if (codeBlockStart) {
        inCodeBlock = true;
        codeBlockLanguage = codeBlockStart[1] || '';
        continue;
      }

      // Check for code block end
      if (line === '```' && inCodeBlock) {
        inCodeBlock = false;
        continue;
      }

      // Add content to current file
      if (currentFile && inCodeBlock) {
        currentContent += line + '\n';
      }
    }

    // Save last file
    if (currentFile && currentContent.trim()) {
      steps.push({
        id: stepId++,
        title: `Create ${currentFile}`,
        description: '',
        type: StepType.CreateFile,
        status: 'pending',
        code: currentContent.trim(),
        path: currentFile
      });
    }

    // Check for shell commands in the response
    const shellCommandRegex = /```(?:bash|shell|sh)\n([\s\S]*?)\n```/g;
    let shellMatch;
    while ((shellMatch = shellCommandRegex.exec(response)) !== null) {
      const command = shellMatch[1].trim();
      if (command) {
        steps.push({
          id: stepId++,
          title: 'Run command',
          description: '',
          type: StepType.RunScript,
          status: 'pending',
          code: command
        });
      }
    }

    // If no files found but there's structured content, try to extract it
    if (steps.length === 0) {
      // Look for any code blocks
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
      let codeMatch;
      while ((codeMatch = codeBlockRegex.exec(response)) !== null) {
        const [, language, code] = codeMatch;
        const cleanCode = code.trim();
        
        if (cleanCode) {
          // Try to determine if it's a file or command
          const isShellCommand = language === 'bash' || language === 'shell' || language === 'sh' || 
                               cleanCode.startsWith('npm ') || cleanCode.startsWith('yarn ') || 
                               cleanCode.startsWith('cd ') || cleanCode.startsWith('mkdir ');

          if (isShellCommand) {
            steps.push({
              id: stepId++,
              title: 'Run command',
              description: '',
              type: StepType.RunScript,
              status: 'pending',
              code: cleanCode
            });
          } else {
            // Treat as file content
            const fileName = language ? `file.${language}` : 'file.txt';
            steps.push({
              id: stepId++,
              title: `Create ${fileName}`,
              description: '',
              type: StepType.CreateFile,
              status: 'pending',
              code: cleanCode,
              path: fileName
            });
          }
        }
      }
    }
  }

  console.log('Parsed steps:', steps);
  return steps;
}