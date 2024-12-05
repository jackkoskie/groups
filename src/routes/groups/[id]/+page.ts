import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	return { id: Number(params.id) };
}) satisfies PageLoad;
