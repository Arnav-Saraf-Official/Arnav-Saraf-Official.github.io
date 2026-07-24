<script lang="ts">
    import { onMount } from 'svelte';

    interface Props {
        data?: Record<string, string[]> | string;
    }

    let {
        data = {
            "Hello there, I am": ["Arnav Saraf.", "a coder.", "an independent researcher."],
            "I like to": ["play piano.", "play minecraft."]
        }
    }: Props = $props();

    const parsedData: Record<string, string[]> =
        typeof data === 'string' ? JSON.parse(data) : data;

    const colors = [
        'var(--color-accent-blue)',
        'var(--color-accent-yellow)',
        'var(--color-accent-red)',
        'var(--color-accent-green)'
    ];

    let currentPrefix = $state('');
    let currentSuffix = $state('');
    let currentColor = $state(colors[0]);

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    onMount(() => {
        let active = true;
        let colorIndex = 0;

        async function startTypewriter() {
            const entries = Object.entries(parsedData);

            while (active) {
                for (const [prefix, suffixes] of entries) {
                    if (!active) break;

                    for (let i = 0; i <= prefix.length; i++) {
                        if (!active) break;
                        currentPrefix = prefix.slice(0, i);
                        await sleep(50);
                    }

                    for (const suffix of suffixes) {
                        if (!active) break;

                        currentColor = colors[colorIndex % colors.length];
                        colorIndex++;

                        for (let i = 0; i <= suffix.length; i++) {
                            if (!active) break;
                            currentSuffix = suffix.slice(0, i);
                            await sleep(60);
                        }

                        await sleep(1500);

                        for (let i = suffix.length; i >= 0; i--) {
                            if (!active) break;
                            currentSuffix = suffix.slice(0, i);
                            await sleep(30); // Erasing speed
                        }

                        await sleep(200);
                    }

                    for (let i = prefix.length; i >= 0; i--) {
                        if (!active) break;
                        currentPrefix = prefix.slice(0, i);
                        await sleep(25);
                    }

                    await sleep(300);
                }
            }
        }

        startTypewriter();

        return () => {
            active = false;
        };
    });
</script>

<p id="typewriter" class="text-[3vh] font-mono text-white flex items-center">
    <span>{currentPrefix}</span>
    <span style="color: {currentColor}">&nbsp;{currentSuffix}</span>
    <span class="blinking-cursor">|</span>
</p>

<style>
    .blinking-cursor {
        animation: blink 1s infinite;
        margin-left: 2px;
        color: #9aa0a6;
    }

    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
</style>