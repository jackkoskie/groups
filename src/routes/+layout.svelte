<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';

	import '../app.css';
	let { children } = $props();
</script>

<Navbar></Navbar>
<main>
	{@render children()}
</main>

<footer class="footer footer-center bg-base-300 p-4 text-base-content">
	<aside>
		<p>
			Copyright © {new Date().getFullYear()} -
			<a href="https://koskie.ca" class="hover:link">Made by Jack Koskie</a>
		</p>
	</aside>
</footer>
