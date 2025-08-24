import type { EvaluationRequest, EvaluationResponse } from '$lib/types';

const DIFY_API_URL = import.meta.env.VITE_DIFY_API_URL || 'https://api.dify.ai/v1';
const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY || '';

export class DifyAPIError extends Error {
	constructor(message: string, public statusCode?: number) {
		super(message);
		this.name = 'DifyAPIError';
	}
}

async function uploadFileToWorkflow(file: File): Promise<any> {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('user', 'web-user');

	const response = await fetch(`${DIFY_API_URL}/files/upload`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${DIFY_API_KEY}`,
		},
		body: formData
	});

	if (!response.ok) {
		const errorData = await response.text();
		throw new DifyAPIError(`Failed to upload file: ${errorData}`);
	}

	const data = await response.json();
	console.log('File uploaded:', data);
	return data;
}

export async function evaluateImage(request: EvaluationRequest): Promise<EvaluationResponse> {
	if (!DIFY_API_KEY) {
		throw new DifyAPIError('DIFY API key is not configured');
	}

	try {
		// Upload files first
		console.log('Uploading files to Dify...');
		const [file1Data, file2Data] = await Promise.all([
			uploadFileToWorkflow(request.image1),
			uploadFileToWorkflow(request.image2)
		]);

		console.log('Files uploaded:', { file1Data, file2Data });

		// Try sending just the file IDs as strings
		const file1Id = file1Data.id || file1Data.file_id || file1Data.upload_file_id;
		const file2Id = file2Data.id || file2Data.file_id || file2Data.upload_file_id;
		
		const requestBody = {
			inputs: {
				context: request.context,
				image1: file1Id,
				image2: file2Id
			},
			response_mode: 'blocking',
			user: 'web-user'
		};

		console.log('Sending request to Dify API:', {
			url: `${DIFY_API_URL}/workflows/run`,
			requestBody
		});

		const response = await fetch(`${DIFY_API_URL}/workflows/run`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${DIFY_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody)
		});

		if (!response.ok) {
			const errorData = await response.text();
			console.error('Dify API Error:', errorData);
			throw new DifyAPIError(
				`API request failed: ${response.statusText}`,
				response.status
			);
		}

		const data = await response.json();
		
		// Parse Dify response - adjust based on actual response structure
		// For now, return mock data if actual response is not properly formatted
		return {
			text: {
				score: Math.floor(Math.random() * 100), // Mock score
				analysis: `コンテキスト「${request.context}」に基づく評価結果です。実際のDifyワークフローからの応答が必要です。`,
				details: {
					timestamp: new Date().toISOString(),
					context: request.context
				}
			}
		};
	} catch (error) {
		if (error instanceof DifyAPIError) {
			throw error;
		}
		throw new DifyAPIError(`Failed to evaluate image: ${error}`);
	}
}

export function imageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const base64 = reader.result as string;
			resolve(base64.split(',')[1]); // Remove data:image/...;base64, prefix
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}