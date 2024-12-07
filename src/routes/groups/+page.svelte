<script lang="ts">
	import type { PageData } from './$types';
	import type { Group } from '$lib/types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let groups: Group[] = $state([]);

	$effect(() => {
		if (localStorage.getItem('groups')) {
			groups = JSON.parse(localStorage.getItem('groups')!);
		}
	});

	const newGroup = () => {
		groups.push({
			id: groups.length + 1,
			name: `New Group ${groups.length + 1}`,
			individuals: [],
			created_at: new Date()
		});
		localStorage.setItem('groups', JSON.stringify(groups));
		goto(`/groups/${groups.length}`);
	};
</script>

<div class="container mx-auto min-h-[calc(100vh-4.22rem)]">
	<div class="flex w-full flex-row items-center pt-5">
		<h1 class="text-3xl font-semibold">Your Groups</h1>
		<button class="btn btn-neutral ms-auto" onclick={newGroup}>New Group</button>
	</div>
	<div class="divider pt-0"></div>
	{#if groups.length === 0}
		<p class="pt-5 text-center text-lg">You have no groups yet. Create one now!</p>
	{/if}
	<div class="flex flex-wrap gap-5">
		{#each groups as group}
			<a href="/groups/{group.id}">
				<div class="card w-96 bg-base-300 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">{group.name}</h2>
						{#if group.description}
							<p class="text-neutral-400">{group.description}</p>
						{/if}
						<p>
							{group.individuals.length} Individual{group.individuals.length == 0 ||
							group.individuals.length >= 2
								? 's'
								: ''}
							<span class="text-neutral-500"
								>Created {new Date(group.created_at).getDate()}/{new Date(
									group.created_at
								).getMonth()}/{new Date(group.created_at).getFullYear()}</span
							>
						</p>
					</div>
				</div></a
			>
		{/each}
	</div>
</div>
