<script lang="ts">
    import { onMount } from 'svelte';

    export interface Props {
        gap?: number;
        dotRadius?: number;
        hoverRadius?: number;
        maxOffset?: number;
        noiseScale?: number;
        noiseSpeed?: number;
    }

    let {
        gap = 30,
        dotRadius = 2,
        hoverRadius = 150,
        maxOffset = 16,
        noiseScale = 4,
        noiseSpeed = 0.01
    }: Props = $props();

    let canvas = $state<HTMLCanvasElement | null>(null);

    let mouse = { x: -1000, y: -1000 };
    let vmouse = { x: -1000, y: -1000 };
    let mouseEasing = 0.05; // Lower value = smoother/looser lag behind cursor
    let scrollPercent = $state<number>(0);

    function updateScroll(): void {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScroll > 0) {
            scrollPercent = window.scrollY / totalScroll;
        }
    }

    onMount(() => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let dpr = 1;

        function resize(): void {
            if (!canvas) return;
            dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
        }

        window.addEventListener('resize', resize);
        window.addEventListener('scroll', updateScroll);
        resize();
        updateScroll();

        const handleMouseMove = (e: MouseEvent): void => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = (): void => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        let time = 0;

        function render(): void {
            if (!canvas || !ctx) return;

            time += noiseSpeed;

            vmouse.x += (mouse.x - vmouse.x) * mouseEasing;
            vmouse.y += (mouse.y - vmouse.y) * mouseEasing;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const hue = Math.floor(scrollPercent * 360);
            const viewWidth = canvas.width / dpr;
            const viewHeight = canvas.height / dpr;

            ctx.save();
            ctx.scale(dpr, dpr);

            for (let x = gap / 2; x < viewWidth; x += gap) {
                for (let y = gap / 2; y < viewHeight; y += gap) {
                    
                    const smoothNoiseX = Math.sin(x * 0.015 + y * 0.008 + time) * noiseScale;
                    const smoothNoiseY = Math.cos(y * 0.015 + x * 0.008 + time) * noiseScale;

                    let drawX = x + smoothNoiseX;
                    let drawY = y + smoothNoiseY;
                    let alpha = 0.3;
                    let radius = dotRadius;

                    const dx = vmouse.x - drawX;
                    const dy = vmouse.y - drawY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < hoverRadius) {

                        const rawForce = (hoverRadius - distance) / hoverRadius;
                        const force = rawForce * rawForce; 
                        
                        const angle = Math.atan2(dy, dx);
                        const offset = force * maxOffset;

                        drawX += Math.cos(angle) * offset;
                        drawY += Math.sin(angle) * offset;

                        alpha = 0.3 + force * 0.7;
                        radius += force * 2;
                    }

                    ctx.beginPath();
                    ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${hue}, 90%, 70%, ${alpha})`;
                    ctx.fill();
                }
            }

            ctx.restore();
            animationFrameId = requestAnimationFrame(render);
        }

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('scroll', updateScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    });
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;          
        background: #0d0e12;  
        pointer-events: none; 
    }
</style>