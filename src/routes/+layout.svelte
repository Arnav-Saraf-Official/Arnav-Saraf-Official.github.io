<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Background from '$lib/components/Background.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</svelte:head>

<!-- @ts-ignore --> 
<Background gap={25} dotRadius={1.5} hoverRadius={380} maxOffset={5} />

<main style="position:absolute;top:0;left:0;width:100%;height:100%;">
	<Navbar />
	<slot />
	<Footer />
</main>