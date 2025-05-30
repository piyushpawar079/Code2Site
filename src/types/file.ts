export interface fileItems{
    name: string; 
    type: 'file' | 'folder';
    path: string;
    children?: fileItems[];
    content?: string;
}