export interface RepoSummary {
  name: string;
  body: string;
  url: string;
  language?: string;
  languageColor?: string;
  starCount: number;
  forkCount: number;
  isPublic: boolean;
  updatedAt: string;
}