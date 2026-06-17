// Generate prerender entries from project markdown files
// In dev mode, just prerender a placeholder
export const entries = () => {
	// These files exist at build time — hardcode to match src/projects/*.svx
	return [{ slug: 'example-project' }, { slug: 'neural-simulator' }, { slug: 'asteroid-miner' }];
};

export const prerender = true;
