import type { EvaluationRequest, EvaluationResponse } from '$lib/types';

const DIFY_API_URL = import.meta.env.VITE_DIFY_API_URL || 'https://api.dify.ai/v1';
const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY || '';

export class DifyAPIError extends Error {
	constructor(message: string, public statusCode?: number) {
		super(message);
		this.name = 'DifyAPIError';
	}
}

export async function evaluateImage(request: EvaluationRequest): Promise<EvaluationResponse> {
	if (!DIFY_API_KEY) {
		throw new DifyAPIError('DIFY API key is not configured');
	}

	try {
		const response = await fetch(`${DIFY_API_URL}/workflows/run`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${DIFY_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				inputs: {
					context: request.context,
					image: [{
						type: 'url',
						transfer_method: 'remote_url',
						url: `data:image/jpeg;base64,${request.image}`
					}]
				},
				response_mode: 'blocking',
				user: 'web-user'
			})
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
		
		// Mock response for now since Dify workflow needs to be configured
		// In production, parse actual Dify response from data.text
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