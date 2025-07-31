import { ObjectId } from "mongodb";

export interface Rating {
	nifar: number;
	afia: number;
	sijil: number;
	naim: number;
}

export interface Product {
	_id?: ObjectId;
	name: string;
	imageUrl: string;
	ratings: Rating;
	comment: string;
	createdAt?: Date;
}

export type Reviewer = keyof Rating;
