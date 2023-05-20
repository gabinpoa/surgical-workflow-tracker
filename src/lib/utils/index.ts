import { CurrentStep, nextStepMap } from '$lib/selectChoices';
import type { ResponseStatus } from '$lib/selectChoices';
import { error } from '@sveltejs/kit';

export enum Filter {
	OnGoing = 'ongoing',
	All = 'all',
	Finished = 'finished'
}

export const toBase64 = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result ? reader.result.toString() : '');
		reader.onerror = (error) => reject(error);
	});

export const fileToBase64 = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			let encoded = event.target?.result?.toString().replace(/^data:(.*,)?/, '');
			if (encoded && encoded.length % 4 > 0) {
				encoded += '='.repeat(4 - (encoded.length % 4));
			}
			encoded && resolve(encoded);
		};
		reader.readAsDataURL(file);
	});

export interface EncodedFile {
	filename: string;
	content: string;
	encoding: 'base64';
}

export const multipleFilesToBase64 = async (fileList: FileList): Promise<EncodedFile[]> => {
	try {
		let encodedFiles: EncodedFile[] = [];

		for (let index = 0; index < fileList.length; index++) {
			encodedFiles.push({
				content: await fileToBase64(fileList[index]),
				filename: fileList[index].name,
				encoding: 'base64'
			});
		}

		return encodedFiles;
	} catch (err) {
		console.error(err);
		throw new Error('Não foi possivel converter arquivos');
	}
};

export function getNextStep(currentStep: CurrentStep, response?: ResponseStatus): CurrentStep {
	const firstStep = nextStepMap.get(currentStep);

	if (typeof firstStep === 'string') {
		return firstStep;
	} else if (response && typeof firstStep === 'object') {
		const secondStep = firstStep.get(response);

		if (secondStep) {
			return secondStep;
		}
	}
	throw error(500, { message: 'Não foi possível encontrar etapa' });
}
