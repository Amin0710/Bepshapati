// src/types/types.ts
export type Reviewer = "nifar" | "afia" | "sijil" | "naim";

export interface Product {
	id: number;
	imageUrl: string;
	nifar: number;
	afia: number;
	sijil: number;
	naim: number;
	comment: string;
}
