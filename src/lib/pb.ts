import { browser } from '$app/environment';
import PocketBase, { Admin, BaseAuthStore, Record } from 'pocketbase';
import type { CurrentStep } from './selectChoices';

export class CustomAuthStore extends BaseAuthStore {
	loadFromLocalStorage(): void {
		if (browser) {
			const token = window.localStorage.getItem('token');
			const model = window.localStorage.getItem('model');
			if (typeof token === 'string' && typeof model === 'string') {
				this.save(token, JSON.parse(model));
			}
		}
	}
	save(token: string, model: UserRecord | Admin | null): void {
		super.save(token, model);
		if (browser) {
			window.localStorage.setItem('token', token);
			window.localStorage.setItem('model', JSON.stringify(model));
		}
	}
	clear(): void {
		super.clear();
		if (browser) {
			window.localStorage.removeItem('token');
			window.localStorage.removeItem('model');
		}
	}
}

export const pb = new PocketBase('https://wispy-fire-1719.fly.dev/', new CustomAuthStore());

export class SurgeryRecord extends Record {
	patient!: string;
	surgeryName!: string;
	surgeon!: string;
	currentStep!: CurrentStep;
	estimatedDate!: string;
}

export class UserRecord extends Record {
	name!: string;
}

export class StepHistoryRecord extends Record {
	user!: string;
	surgery!: string;
	informedDate!: string | undefined;
	step!: CurrentStep;
	responseStatus!: ResponseStatus | undefined;
}

export enum ResponseStatus {
	Autorizada = 'autorizada',
	PendenteJustificativas = 'pendenteJustificativas',
	NovasJustificativas = 'novasJustificativas'
}
