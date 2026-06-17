export type ProjectCategory = 'web' | 'ml' | 'game' | 'other';

export interface ProjectMeta {
	title: string;
	description: string;
	category: ProjectCategory;
	tags: string[];
	order?: number;
	liveUrl?: string;
	sourceUrl?: string;
	caseStudyUrl?: string;
	screenshots?: string[];
	featured?: boolean;
}

export interface ProjectEntry {
	slug: string;
	metadata: ProjectMeta;
	load: () => Promise<{ metadata: ProjectMeta; default: unknown }>;
}
