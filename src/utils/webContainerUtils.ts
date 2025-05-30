// utils/webContainerUtils.ts
interface fileItems {
  name: string; 
  type: 'file' | 'folder';
  path: string;
  children?: fileItems[];
  content?: string;
}

type WebContainerMount = {
  [key: string]: {
    directory?: WebContainerMount;
    file?: {
      contents: string;
    };
  };
};

export const convertToWebContainerMount = (fileStructure: fileItems): WebContainerMount => {
  const processItem = (item: fileItems): any => {
    if (item.type === 'folder') {
      const directory: WebContainerMount = {};
      
      if (item.children) {
        item.children.forEach(child => {
          directory[child.name] = processItem(child);
        });
      }
      
      return { directory };
    } else if (item.type === 'file') {
      return {
        file: {
          contents: item.content || ''
        }
      };
    }
  };

  // Skip the root "my-app" folder and process its children directly
  const result: WebContainerMount = {};
  
  if (fileStructure.children) {
    fileStructure.children.forEach(child => {
      result[child.name] = processItem(child);
    });
  }
  
  return result;
};

export const setupWebContainer = async (
  webContainer: any, 
  fileStructure: fileItems,
  setUrl: (url: string) => void,
  setIsLoading?: (loading: boolean) => void
) => {
  if (!webContainer) {
    console.error('WebContainer not available');
    return;
  }

  try {
    setIsLoading?.(true);
    
    // 1. First mount the file structure
    const mountStructure = convertToWebContainerMount(fileStructure);
    console.log('Mounting structure:', mountStructure);
    await webContainer.mount(mountStructure);

    // 2. Check if package.json exists, if not create a basic one
    const hasPackageJson = await checkForPackageJson(fileStructure);
    if (!hasPackageJson) {
      const defaultPackageJson = createDefaultPackageJson();
      await webContainer.fs.writeFile('/package.json', defaultPackageJson);
    }

    // 3. Install dependencies
    console.log('Installing dependencies...');
    const installProcess = await webContainer.spawn('npm', ['install']);
    
    const installExitCode = await installProcess.exit;
    if (installExitCode !== 0) {
      console.error('Failed to install dependencies');
      setIsLoading?.(false);
      return;
    }

    // 4. Start the development server
    console.log('Starting development server...');
    const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
    
    // 5. Listen for server-ready event
    webContainer.on('server-ready', (port: number, url: string) => {
      console.log(`Server ready on port ${port}: ${url}`);
      setUrl(url);
      setIsLoading?.(false);
    });

    // 6. Handle process output for debugging
    devProcess.output.pipeTo(new WritableStream({
      write(data) {
        console.log('Dev server output:', data);
      }
    }));

  } catch (error) {
    console.error('Error setting up WebContainer:', error);
    setIsLoading?.(false);
  }
};

// Helper function to check if package.json exists in file structure
const checkForPackageJson = (fileStructure: fileItems): boolean => {
  const checkRecursively = (item: fileItems): boolean => {
    if (item.type === 'file' && item.name === 'package.json') {
      return true;
    }
    if (item.children) {
      return item.children.some(child => checkRecursively(child));
    }
    return false;
  };
  
  return checkRecursively(fileStructure);
};

// Create a default package.json for basic web projects
const createDefaultPackageJson = (): string => {
  return JSON.stringify({
    "name": "generated-website",
    "version": "1.0.0",
    "description": "AI Generated Website",
    "main": "index.js",
    "scripts": {
      "dev": "npx serve . -p 3000",
      "start": "npx serve . -p 3000",
      "build": "echo 'Build complete'"
    },
    "dependencies": {
      "serve": "^14.2.0"
    },
    "devDependencies": {},
    "keywords": [],
    "author": "",
    "license": "ISC"
  }, null, 2);
};

// Alternative setup for React/Next.js projects
export const setupReactWebContainer = async (
  webContainer: any, 
  fileStructure: fileItems,
  setUrl: (url: string) => void,
  setIsLoading?: (loading: boolean) => void
) => {
  if (!webContainer) {
    console.error('WebContainer not available');
    return;
  }

  try {
    setIsLoading?.(true);
    
    // Mount file structure
    const mountStructure = convertToWebContainerMount(fileStructure);
    await webContainer.mount(mountStructure);

    // Check for React/Next.js specific files and create default package.json
    const hasPackageJson = await checkForPackageJson(fileStructure);
    if (!hasPackageJson) {
      const reactPackageJson = createReactPackageJson();
      await webContainer.fs.writeFile('/package.json', reactPackageJson);
    }

    // Install dependencies
    const installProcess = await webContainer.spawn('npm', ['install']);
    await installProcess.exit;

    // Start development server
    const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
    
    webContainer.on('server-ready', (port: number, url: string) => {
      console.log(`React server ready: ${url}`);
      setUrl(url);
      setIsLoading?.(false);
    });

  } catch (error) {
    console.error('Error setting up React WebContainer:', error);
    setIsLoading?.(false);
  }
};

const createReactPackageJson = (): string => {
  return JSON.stringify({
    "name": "react-generated-app",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-scripts": "5.0.1"
    },
    "scripts": {
      "start": "react-scripts start",
      "dev": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    },
    "eslintConfig": {
      "extends": [
        "react-app",
        "react-app/jest"
      ]
    },
    "browserslist": {
      "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
      ],
      "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ]
    }
  }, null, 2);
};