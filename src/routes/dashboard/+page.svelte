<script lang="ts">
	import type { Group } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let groups: Group[] = $state([]);
	let activeGroup = $state(1);
	let group: Group = $state({ id: 0, name: '', individuals: [], created_at: new Date() });

	let utility = $state('teams');

	let generateMethod = $state('groups');
	let num = $state(1);

	let modalStatus: any = $state({});
	const toggleModal = (modal: string) => {
		if (modalStatus[modal] !== undefined) {
			modalStatus[modal] = !modalStatus[modal];
		} else {
			modalStatus[modal] = true;
		}
	};

	const clearTeams = () => {
		group.teaming = {
			teams: [],
			perGroup: undefined,
			numGroups: undefined
		};
		groups = groups.map((g) => (g.id == group.id ? group : g));
		localStorage.setItem('groups', JSON.stringify(groups));
		toggleModal('clear-teams');
	};

	const generateTeams = () => {
		const tempIndividuals = group.individuals;
		tempIndividuals.sort(() => Math.random() - 0.5);
		group.teaming = {
			teams: []
		};
		let teams = [];
		let perGroup: number;
		if (generateMethod == 'groups') {
			// generate teams based on number of groups
			perGroup = Math.floor(tempIndividuals.length / num);
			group.teaming.numGroups = num;
			for (let i = 0; i < num; i++) {
				teams.push(tempIndividuals.slice(i * perGroup, (i + 1) * perGroup));
			}
			// Evenly distribute leftovers
			let leftover = tempIndividuals.slice(num * perGroup);
			for (let i = 0; i < leftover.length; i++) {
				teams[i % num].push(leftover[i]);
			}
		} else {
			// generate teams based on number of individuals per group
			perGroup = num;
			group.teaming.perGroup = num;
			for (let i = 0; i < tempIndividuals.length; i += num) {
				teams.push(tempIndividuals.slice(i, i + num));
			}
		}

		// sort teams by length and alphabeticaly
		teams.sort((a, b) => a.length - b.length);
		teams.map((team) => team.sort((a, b) => a.localeCompare(b)));

		group.teaming = {
			teams
		};

		// Save the group
		groups = groups.map((g) => (g.id == group.id ? group : g));
		localStorage.setItem('groups', JSON.stringify(groups));

		toggleModal('teams');
	};

	let individualToMove = $state('');
	let fromTeam = $state(0);
	let toTeam = $state(0);

	const moveIndividualModal = (individual: string, from: number) => {
		individualToMove = individual;
		fromTeam = from;
		toggleModal('move-individual');
	};

	const moveIndividual = (individual: string, from: number, to: number) => {
		if (from != -1) {
			group.teaming!.teams[from] = group.teaming!.teams[from].filter((i) => i !== individual);
		}
		if (to != -1) {
			group.teaming!.teams[to].push(individual);
		}
		groups = groups.map((g) => (g.id == group.id ? group : g));
		localStorage.setItem('groups', JSON.stringify(groups));
		toggleModal('move-individual');
	};

	let teamToDelete = $state(0);
	const deleteTeam = () => {
		group.teaming!.teams.splice(teamToDelete, 1);
		groups = groups.map((g) => (g.id == group.id ? group : g));
		localStorage.setItem('groups', JSON.stringify(groups));
		toggleModal('delete-team');
	};

	const createEmptyTeam = () => {
		group.teaming!.teams.push([]);
		groups = groups.map((g) => (g.id == group.id ? group : g));
		localStorage.setItem('groups', JSON.stringify(groups));
	};

	$effect(() => {
		if (localStorage.getItem('groups')) {
			groups = JSON.parse(localStorage.getItem('groups')!);
		}
	});

	$effect(() => {
		group = groups.find((group) => group.id == activeGroup) || {
			id: 0,
			name: '',
			individuals: [],
			created_at: new Date()
		};
	});
</script>

<div class="content">
	{#if groups.length == 0}
		<div class="hero min-h-screen">
			<div class="hero-content text-center">
				<div class="max-w-md">
					<h1 class="text-5xl font-bold">No Groups!</h1>
					<p class="py-6">
						It looks like you haven't created any groups yet. Before you can get started, you'll
						need to create a group. Head on over to the groups page to get started!
					</p>
					<a href="/groups" class="btn btn-primary">Your Groups</a>
				</div>
			</div>
		</div>
	{:else if groups.map((group) => group.individuals.length).reduce((a, b) => a + b) == 0}
		<div class="hero min-h-screen">
			<div class="hero-content text-center">
				<div class="max-w-md">
					<h1 class="text-5xl font-bold">Not Individuals!</h1>
					<p class="py-6">
						It looks like you haven't added any individuals to your groups yet. Before you can get
						started, you'll need to add some individuals to your groups. Head on over to the groups
						page to get started!
					</p>
					<a href="/groups" class="btn btn-primary">Your Groups</a>
				</div>
			</div>
		</div>
	{:else if !groups.some((g) => g.individuals.length >= 2)}
		<div class="hero min-h-screen">
			<div class="hero-content text-center">
				<div class="max-w-md">
					<h1 class="text-5xl font-bold">Not Enough Individuals!</h1>
					<p class="py-6">
						It looks like you haven't added enough individuals to your groups yet. Before you can
						get started, you'll need 1 group with at least 2 people. Head on over to the groups page
						to get started!
					</p>
					<a href="/groups" class="btn btn-primary">Your Groups</a>
				</div>
			</div>
		</div>
	{:else}
		<div class="mt-5 flex w-full flex-row items-center gap-10">
			<h1 class="text-3xl font-semibold">Utilities</h1>
			<div class="join">
				<input
					type="radio"
					name="utility"
					class="btn btn-outline join-item btn-sm"
					aria-label="Make Teams"
					value="teams"
					bind:group={utility}
				/>
				<input
					type="radio"
					name="utility"
					class="btn btn-outline join-item btn-sm"
					aria-label="Selector"
					value="selector"
					bind:group={utility}
				/>
			</div>
			<label class="form-control ms-auto w-full max-w-xs">
				<div class="label">
					<span class="label-text">Active Group</span>
					<a href="/groups" class="link-hover label-text">Edit Your Groups</a>
				</div>
				<select class="select select-bordered" bind:value={activeGroup}>
					{#each groups as group, i}
						<option selected={i == 0} value={group.id}>{group.name}</option>
					{/each}
				</select>
			</label>
		</div>
		<div class="divider w-full"></div>
		{#if utility == 'teams'}
			<div class="w-full">
				<div class="flex gap-3">
					<button class="btn btn-success mb-5" onclick={() => toggleModal('teams')}
						>Generate Teams</button
					>
					<button class="btn btn-outline btn-warning mb-5" onclick={createEmptyTeam}
						>Create Empty Team</button
					>
					<button class="btn btn-outline btn-error mb-5" onclick={() => toggleModal('clear-teams')}
						>Clear Teams</button
					>
				</div>
				{#if group.teaming?.teams && group.teaming.teams.length > 0}
					<div class="flex flex-wrap gap-3">
						{#each group.teaming!.teams as team, i}
							<div class="card w-60 bg-neutral text-neutral-content">
								<div class="card-body">
									<h2 class="card-title">
										<button
											class="hover:text-error hover:underline"
											onclick={() => {
												teamToDelete = i;
												toggleModal('delete-team');
											}}>Team {i + 1}</button
										>
									</h2>
									<ul class="list-none">
										{#each team as individual}
											<li>
												- <button
													class="hover:text-error hover:underline"
													onclick={() => moveIndividualModal(individual, i)}>{individual}</button
												>
											</li>
										{/each}
									</ul>
								</div>
							</div>
						{/each}
						{#if group.teaming.teams.reduce((c, r) => c + r.length, 0) < group.individuals.length}
							<div class="card w-60 bg-neutral-800 text-neutral-content">
								<div class="card-body">
									<h2
										class="card-title
										"
									>
										Unteamed
									</h2>
									<ul class="list-none">
										{#each group.individuals as individual}
											{#if !group.teaming.teams.some((team) => team.includes(individual))}
												<li>
													- <button
														class="hover:text-error hover:underline"
														onclick={() => moveIndividualModal(individual, -1)}>{individual}</button
													>
												</li>
											{/if}
										{/each}
									</ul>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{:else if utility == 'selector'}
			<div class="flex w-full justify-center">
				<p>Selector</p>
			</div>
		{:else}
			<div class="flex w-full justify-center">
				<p>Please Select a Utility</p>
			</div>
		{/if}
	{/if}

	<!-- modals -->
	<!-- make teams modal -->
	<dialog class="modal modal-bottom sm:modal-middle" class:modal-open={modalStatus['teams']}>
		<div class="modal-box">
			<h3 class="text-lg font-bold">Generate Teams</h3>
			<form method="dialog">
				<div class="form-control mt-3">
					<div class="join">
						<input
							type="radio"
							name="teamGenerateType"
							class="btn join-item btn-sm"
							aria-label="# Of Groups"
							value="groups"
							bind:group={generateMethod}
						/>
						<input
							type="radio"
							name="teamGenerateType"
							class="btn join-item btn-sm"
							aria-label="# Per Group"
							value="perGroup"
							bind:group={generateMethod}
						/>
					</div>
					<div class="my-3">
						{#if generateMethod == 'groups'}
							<div class="label"><span class="label-text">Number of Groups</span></div>
						{/if}
						{#if generateMethod == 'perGroup'}
							<div class="label">
								<span class="label-text">Number of Individuals Per Group</span>
							</div>
						{/if}
						<input type="number" bind:value={num} class="input input-bordered" />
					</div>
				</div>
				<div class="modal-action">
					<button class="btn" onclick={generateTeams}>Generate</button>
				</div>
			</form>
		</div>
	</dialog>
	<!-- end make teams modal -->

	<!-- Clear Teams modal -->
	<dialog class="modal modal-bottom sm:modal-middle" class:modal-open={modalStatus['clear-teams']}>
		<div class="modal-box">
			<h3 class="text-lg font-bold">Clear Teams</h3>
			<p>Are you sure you want to clear the teams?</p>
			<form method="dialog">
				<div class="modal-action">
					<button class="btn" onclick={() => toggleModal('clear-teams')}
						>No, Do Not Clear Teams</button
					>
					<button class="btn btn-error" onclick={clearTeams}>Yes, Clear Teams</button>
				</div>
			</form>
		</div>
	</dialog>
	<!-- end delete group modal -->

	<!-- move individual modal -->
	<dialog
		class="modal modal-bottom sm:modal-middle"
		class:modal-open={modalStatus['move-individual']}
	>
		<div class="modal-box">
			<h3 class="text-lg font-bold">Move {individualToMove}</h3>
			<form method="dialog">
				<div class="form-control mt-3">
					<div class="label">
						<span class="label-text">Move {individualToMove} to which team?</span>
					</div>
					<select bind:value={toTeam} class="select select-bordered min-w-48">
						{#each group.teaming?.teams ?? [] as team, i}
							<option value={i}>Team {i + 1}</option>
						{/each}
						<option value={-1}>Unteam</option>
					</select>
				</div>
				<div class="modal-action">
					<button class="btn" onclick={() => moveIndividual(individualToMove, fromTeam, toTeam)}
						>Move</button
					>
				</div>
			</form>
		</div>
	</dialog>
	<!-- end move individual modal -->

	<!-- delete team modal -->
	<dialog class="modal modal-bottom sm:modal-middle" class:modal-open={modalStatus['delete-team']}>
		<div class="modal-box">
			<h3 class="text-lg font-bold">Delete Team</h3>
			<p>Are you sure you want to delete Team {teamToDelete + 1}?</p>
			<form method="dialog">
				<div class="modal-action">
					<button class="btn" onclick={() => toggleModal('delete-team')}>No, Do Not Delete</button>
					<button class="btn btn-error" onclick={deleteTeam}>Yes, Delete</button>
				</div>
			</form>
		</div>
	</dialog>
	<!-- end delete team modal -->
</div>
