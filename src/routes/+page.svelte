<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="hero min-h-[calc(100vh-4.22rem)] bg-base-200">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Welcome to Groups!</h1>
			<p class="py-6">
				This tool is here to help you organize groups of people, selecting individuals at random,
				and more!
			</p>
			<a href="/groups" class="btn btn-primary">Get Started</a>
		</div>
	</div>
</div>
