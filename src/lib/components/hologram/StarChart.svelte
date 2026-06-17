<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { generateStarChart } from '$lib/utils/starChartGenerator';
	import { getFilteredProjects } from '$lib/stores/projects.svelte';
	import OrbitalPlane from './OrbitalPlane.svelte';
	import ConstellationLine from './ConstellationLine.svelte';
	import StarNode from './StarNode.svelte';

	let chart = $derived(generateStarChart(getFilteredProjects()));

	// Build lookup from project slug → node
	let nodeMap = $derived.by(() => {
		const map: Record<string, (typeof chart.nodes)[number]> = {};
		for (const node of chart.nodes) {
			map[node.id] = node;
		}
		return map;
	});
</script>

<T.AmbientLight intensity={0.3} color="#002244" />

{#each chart.planes as plane (plane.category)}
	<OrbitalPlane
		radius={plane.radius}
		color={plane.color}
		tilt={plane.tilt}
		rotation={plane.rotation}
	/>
{/each}

{#each chart.constellations as [fromId, toId] (`${fromId}-${toId}`)}
	{@const fromNode = nodeMap[fromId]}
	{@const toNode = nodeMap[toId]}
	{#if fromNode && toNode}
		<ConstellationLine from={fromNode.position} to={toNode.position} color="#336699" />
	{/if}
{/each}

{#each chart.nodes as node (node.id)}
	<StarNode id={node.id} position={node.position} color={node.color} radius={node.radius} />
{/each}

<OrbitControls
	enablePan={false}
	enableZoom={false}
	enableRotate={true}
	autoRotate={true}
	autoRotateSpeed={0.4}
/>
