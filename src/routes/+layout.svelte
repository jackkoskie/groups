<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';

	import '../app.css';
	let { children } = $props();
</script>

<Navbar></Navbar>
<main>
	{@render children()}
</main>
