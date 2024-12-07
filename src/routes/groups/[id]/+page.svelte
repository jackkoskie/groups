<script lang="ts">
	import { goto } from '$app/navigation';
	import EditIcon from '$lib/icons/EditIcon.svelte';
	import type { Group } from '$lib/types';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import GroupIcon from '$lib/icons/GroupIcon.svelte';
	import DeleteIcon from '$lib/icons/DeleteIcon.svelte';
	import AddUserIcon from '$lib/icons/AddUserIcon.svelte';

	let { data }: { data: PageData } = $props();

	let group: Group = $state({
		id: data.id,
		name: `Group ${data.id}`,
		individuals: [],
		created_at: new Date()
	});

	let groups: Group[] = $state([]);
	const updateGroup = (newGroup: Group) => {
		groups = JSON.parse(localStorage.getItem('groups')!);
		group = newGroup;
		groups[newGroup.id - 1] = newGroup;
		localStorage.setItem('groups', JSON.stringify(groups));
	};

	let isInfoModalOpen = $state(false);
	// svelte-ignore state_referenced_locally
	let tempTitle = $state('');
	let tempDescription = $state('');
	const openInfoModal = () => {
		isInfoModalOpen = true;
	};
	const closeInfoModal = () => {
		group.name = tempTitle;
		group.description = tempDescription;
		updateGroup(group);
		isInfoModalOpen = false;
	};

	let isDeleteModalOpen = $state(false);
	const toggleDeleteModal = () => {
		isDeleteModalOpen = !isDeleteModalOpen;
	};
	const deleteGroup = () => {
		groups = groups.filter((g) => g.id !== group.id);
		goto('/groups');
	};

	let individualToAdd = $state('');
	let addIndividual = () => {
		group.individuals.push(individualToAdd);
		individualToAdd = '';
		updateGroup(group);
	};
	let isIndividualModalOpen = $state(false);
	let newLineIndividuals = $state('');
	const toggleIndividualModal = () => {
		if (isIndividualModalOpen) {
			group.individuals = newLineIndividuals.split('\n').filter((i) => i !== '');
			updateGroup(group);
		} else {
			newLineIndividuals = group.individuals.join('\n');
		}

		isIndividualModalOpen = !isIndividualModalOpen;
		updateGroup(group);
	};

	onMount(() => {
		if (localStorage.getItem('groups')) {
			groups = JSON.parse(localStorage.getItem('groups')!);
			if (groups.find((g) => g.id === data.id)) {
				group = groups.find((g) => g.id === data.id)!;
				tempTitle = group.name;
				tempDescription = group.description || '';
				newLineIndividuals = group.individuals.join('\n');
			} else {
				goto('/groups');
			}
		}
	});
</script>

<div class="container mx-auto min-h-[calc(100vh-4.22rem)]">
	<div class="flex items-end gap-3">
		<h1 class="pt-5 text-3xl font-semibold">{group.name}</h1>
		<button class="ms-auto text-success" onclick={toggleIndividualModal}><AddUserIcon /></button>
		<button class=" text-neutral-600" onclick={openInfoModal}><EditIcon /></button>
		<button class="text-xl text-error" onclick={toggleDeleteModal}><DeleteIcon /></button>
	</div>
	<p class="mt-3 text-sm text-neutral-400">{group.description}</p>
	<div class="divider"></div>

	<div>
		{#if group.individuals.length == 0}
			<p class="text-neutral-400">No individuals in this group</p>
		{:else}
			<h2 class="text-xl font-semibold">Individuals</h2>
			<ul class="">
				{#each group.individuals as individual, i}
					<li class="list-item">
						<div class="flex flex-row gap-3">
							<span>-</span>
							<button
								class="transition-colors hover:text-error hover:line-through"
								onclick={() => {
									group.individuals.splice(i, 1);
									updateGroup(group);
								}}>{individual}</button
							>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
		<form class="form-control mt-3 flex-row gap-2" onsubmit={addIndividual}>
			<input
				type="text"
				placeholder="Add Individual"
				class="input input-md input-bordered w-full max-w-[15rem]"
				id="add-individual-text"
				bind:value={individualToAdd}
			/>
			<button class="btn btn-circle btn-outline btn-primary" type="submit">+</button>
		</form>
	</div>

	<!-- MODALS ONLY BEYOND THIS POINT -->

	<!-- group name modal -->
	<dialog class="modal modal-bottom sm:modal-middle" class:modal-open={isInfoModalOpen}>
		<div class="modal-box">
			<h3 class="text-lg font-bold">Group Info</h3>

			<form method="dialog">
				<div class="label mt-3">
					<span class="label-text">Group Name</span>
					{#if tempTitle == ''}
						<span class="label-text">Group Name Cannot Be Blank!</span>
					{/if}
				</div>
				<div
					class="input input-bordered flex items-center gap-2"
					class:input-error={tempTitle == ''}
				>
					<input type="text" class="grow" bind:value={tempTitle} />
					<GroupIcon />
				</div>
				<div class="label mt-3"><span class="label-text">Description</span></div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered w-full"
					bind:value={tempDescription}
				/>
				<div class="modal-action">
					<button class="btn" onclick={tempTitle != '' ? closeInfoModal : () => {}}>Save</button>
				</div>
			</form>
		</div>
	</dialog>
	<!-- end group name modal -->

	<!-- delete group modal -->
	<dialog class="modal modal-bottom sm:modal-middle" class:modal-open={isDeleteModalOpen}>
		<div class="modal-box">
			<h3 class="text-lg font-bold">Delete Group</h3>
			<p>Are you sure you want to delete the group called "{group.name}"?</p>
			<form method="dialog">
				<div class="modal-action">
					<button class="btn" onclick={toggleDeleteModal}>No, Do Not Delete</button>
					<button class="btn btn-error" onclick={deleteGroup}>Yes, Delete</button>
				</div>
			</form>
		</div>
	</dialog>
	<!-- end delete group modal -->

	<!-- individual modal -->
	<dialog class="modal modal-bottom sm:modal-middle" class:modal-open={isIndividualModalOpen}>
		<div class="modal-box">
			<h3 class="text-lg font-bold">Edit Individuals</h3>
			<form method="dialog">
				<div class="label mt-3"><span class="label-text">One Individual Per Line</span></div>
				<textarea
					placeholder="Type here"
					class="input input-bordered min-h-40 w-full resize-y p-4"
					bind:value={newLineIndividuals}
				></textarea>
				<div class="modal-action">
					<button class="btn" onclick={toggleIndividualModal}>Save</button>
				</div>
			</form>
		</div>
	</dialog>
	<!-- end individual modal -->
</div>
