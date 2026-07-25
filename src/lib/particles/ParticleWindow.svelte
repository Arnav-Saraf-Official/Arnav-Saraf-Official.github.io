<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import * as THREE from 'three';
	import { engine } from './context';
	import type { Particle } from './types';

	interface Props {
		class?: string;
		style?: string;
		children?: Snippet;
	}

	let { class: className = '', style = '', children }: Props = $props();

	let container = $state<HTMLDivElement>();

	// ---- Color helpers --------------------------------------------------------

	function hslToRgb(h: number, s: number, l: number): [number, number, number] {
		h = ((h % 1) + 1) % 1;
		const a = s * Math.min(l, 1 - l);
		const f = (n: number) => {
			const k = (n + h * 12) % 12;
			return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
		};
		return [f(0), f(8), f(4)];
	}

	function particleColor(p: Particle): [number, number, number] {
		const hue = 0.57 + p.homeX * 0.04 + p.homeY * 0.03;
		const lightness = 0.5 + p.brightness * 0.35;
		return hslToRgb(hue, 0.9, lightness);
	}

	// ---- Setup per-window renderer --------------------------------------------

	onMount(() => {
		const el = container;
		const eng = engine;
		if (!el || !eng) return;

		const rect = el.getBoundingClientRect();

		// -- Renderer sized exactly to this card ---------------------------------
		const renderer = new THREE.WebGLRenderer({
			alpha: false,
			antialias: true,
			powerPreference: 'high-performance'
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(rect.width, rect.height);
		renderer.setClearColor(0x000000, 1);
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.inset = '0';
		renderer.domElement.style.pointerEvents = 'none';
		el.prepend(renderer.domElement);

		// -- Scene & camera ------------------------------------------------------
		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 1);

		// -- Sprite texture ------------------------------------------------------
		const texSize = 64;
		const texCanvas = document.createElement('canvas');
		texCanvas.width = texSize;
		texCanvas.height = texSize;
		const ctx = texCanvas.getContext('2d')!;
		const cx = texSize / 2;
		const cy = texSize / 2;
		const rx = texSize * 0.44;
		const ry = texSize * 0.14;
		const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
		grad.addColorStop(0, 'rgba(255,255,255,1)');
		grad.addColorStop(0.3, 'rgba(255,255,255,0.9)');
		grad.addColorStop(0.6, 'rgba(255,255,255,0.4)');
		grad.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = grad;
		ctx.beginPath();
		ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
		ctx.fill();
		const spriteTexture = new THREE.CanvasTexture(texCanvas);

		// -- Geometry ------------------------------------------------------------
		const count = eng.particles.length;
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(count * 3);
		const colors = new Float32Array(count * 3);
		const sizes = new Float32Array(count);
		const rotations = new Float32Array(count);
		const smoothedRotations = new Float32Array(count);
		const stretches = new Float32Array(count);

		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
		geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
		geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));
		geometry.setAttribute('stretch', new THREE.BufferAttribute(stretches, 1));

		// -- ShaderMaterial ------------------------------------------------------
		const material = new THREE.ShaderMaterial({
			uniforms: { uTexture: { value: spriteTexture } },
			vertexShader: /* glsl */ `
				attribute float size;
				attribute float rotation;
				attribute float stretch;
				varying vec3 vColor;
				varying float vRotation;
				varying float vStretch;
				void main() {
					vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
					gl_PointSize = size * (1.0 + stretch * 0.5);
					gl_Position = projectionMatrix * mvPosition;
					vColor = color;
					vRotation = rotation;
					vStretch = stretch;
				}
			`,
			fragmentShader: /* glsl */ `
				uniform sampler2D uTexture;
				varying vec3 vColor;
				varying float vRotation;
				varying float vStretch;
				void main() {
					float c = cos(vRotation);
					float s = sin(vRotation);
					vec2 uv = gl_PointCoord - 0.5;
					uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
					uv.x /= (1.0 + vStretch * 0.6);
					uv.y *= (1.0 + vStretch * 0.6);
					uv += 0.5;
					vec4 tex = texture2D(uTexture, uv);
					gl_FragColor = vec4(vColor * tex.a, tex.a);
				}
			`,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
			depthTest: false,
			transparent: true,
			vertexColors: true
		});

		scene.add(new THREE.Points(geometry, material));

		// -- ResizeObserver — match canvas to card size --------------------------
		const ro = new ResizeObserver(() => {
			const r = el.getBoundingClientRect();
			renderer.setSize(r.width, r.height);
		});
		ro.observe(el);

		// -- Animation loop ------------------------------------------------------
		let running = true;
		const BASE_SIZE = 8;

		function animate(): void {
			if (!running) return;
			requestAnimationFrame(animate);

			const now = performance.now();

			for (let i = 0; i < count; i++) {
				const p = eng!.particles[i];
				positions[i * 3] = p.x;
				positions[i * 3 + 1] = p.y;
				positions[i * 3 + 2] = 0;

				const [r, g, b] = particleColor(p);
				colors[i * 3] = r * p.brightness;
				colors[i * 3 + 1] = g * p.brightness;
				colors[i * 3 + 2] = b * p.brightness;

				sizes[i] = BASE_SIZE * p.scale;

				const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
				const targetRotation = Math.atan2(p.vy, p.vx);
				let diff = targetRotation - smoothedRotations[i];
				while (diff > Math.PI) diff -= Math.PI * 2;
				while (diff < -Math.PI) diff += Math.PI * 2;
				smoothedRotations[i] += diff * 0.25;
				rotations[i] = smoothedRotations[i];

				stretches[i] = Math.min(3, speed * 60 + Math.sin(now * 0.002 + p.homeX * 10) * 0.2 + 0.5);
			}
			geometry.attributes.position.needsUpdate = true;
			geometry.attributes.color.needsUpdate = true;
			geometry.attributes.size.needsUpdate = true;
			geometry.attributes.rotation.needsUpdate = true;
			geometry.attributes.stretch.needsUpdate = true;

			renderer.render(scene, camera);
		}

		requestAnimationFrame(animate);

		return () => {
			running = false;
			ro.disconnect();
			renderer.domElement.remove();
			renderer.dispose();
			spriteTexture.dispose();
			material.dispose();
			geometry.dispose();
		};
	});
</script>

<div
	bind:this={container}
	class="particle-window {className}"
	{style}
>
	{#if children}
		<div class="particle-window-content">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.particle-window {
		position: relative;
		overflow: hidden;
	}
	.particle-window-content {
		position: relative;
		z-index: 2;
	}
</style>
