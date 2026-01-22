import { create } from './create.remote';
import { get } from './get';
import { list } from './list.remote';
import { member } from './member';
import { update } from './update.remote';

export const organization = {
	list,
	create,
	update,

	member,

	get
};
