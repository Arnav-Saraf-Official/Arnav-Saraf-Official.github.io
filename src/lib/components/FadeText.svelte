<script lang="ts">
    import { onMount } from 'svelte';

    interface Props {
        texts?: string[] | string;
        interval?: number;
        fadeDuration?: number;
    }

    let {
        texts = [
            'designer',
            'developer',
            'researcher',
            'creator'
        ],
        interval = 3200,
        fadeDuration = 450
    }: Props = $props();

    if (typeof texts === 'string') {
        texts = [texts];
    }

    if (!texts || texts.length === 0) {
        texts = [''];
    }

    let currentText = $state(texts[0]);
    let visible = $state(true);
    let index = 0;
    let timer: number | undefined;

    onMount(() => {
        const nextCycle = (): void => {
            timer = window.setTimeout(async () => {
                visible = false;
                await new Promise((resolve) => window.setTimeout(resolve, fadeDuration));

                index = (index + 1) % texts.length;
                currentText = texts[index];
                visible = true;

                nextCycle();
            }, interval);
        };

        nextCycle();

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    });
</script>

<span
    class="fade-text"
    class:visible={visible}
    style="transition-duration: {fadeDuration}ms"
>
    {currentText}
</span>

<style>
    .fade-text {
        opacity: 0;
        transition: opacity 0.45s ease;
        display: inline-block;
    }

    .visible {
        opacity: 1;
    }
</style>
