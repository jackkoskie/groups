<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="drawer">
	<input id="nav-sidebar" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="navbar w-full bg-base-300">
			<div class="flex-none lg:hidden">
				<label for="nav-sidebar" aria-label="open sidebar" class="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block h-6 w-6 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</label>
			</div>
			<a href="/" class="btn btn-ghost text-xl">Groups</a>
			<div class="hidden lg:flex">
				<ul class="menu menu-horizontal px-1">
					<li><a href="/">Home</a></li>
					<li><a href="/dashboard">Dashboard</a></li>
					<li><a href="/groups">Groups</a></li>
					<li><a href="https://github.com/jackkoskie/groups">GitHub</a></li>
				</ul>
			</div>
		</div>

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
	</div>
	<div class="drawer-side">
		<label for="nav-sidebar" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu min-h-full w-80 bg-base-200 p-4">
			<li><a href="/">Home</a></li>
			<li><a href="/dashboard">Dashboard</a></li>
			<li><a href="/groups">Groups</a></li>
			<li><a href="https://github.com/jackkoskie/groups">GitHub</a></li>
		</ul>
	</div>
</div>
