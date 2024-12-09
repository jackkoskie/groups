export type Group = {
	id: number;
	name: string;
	description?: string;
	created_at: Date;
	individuals: string[];
	teaming?: {
		numGroups?: number;
		perGroup?: number;
		teams: string[][];
	};
};
