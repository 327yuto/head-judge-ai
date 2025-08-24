export interface UploadedImage {
	id: string;
	file: File;
	url: string;
}

export interface EvaluationResult {
	id: string;
	imageId: string;
	score: number;
	analysis: string;
	details?: {
		[key: string]: any;
	};
	rank?: number;
	timestamp: Date;
}

export interface EvaluationRequest {
	context: string;
	image1: File;
	image2: File;
}

export interface EvaluationResponse {
	text: {
		score: number;
		analysis: string;
		details?: {
			[key: string]: any;
		};
	};
}