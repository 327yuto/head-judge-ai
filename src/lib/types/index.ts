export interface UploadedImage {
	id: string;
	file: File;
	url: string;
	isBase: boolean;
}

export interface ComparisonResult {
	imageId: string;
	score: number;
	rank?: number;
	analysis?: string;
}

export interface ComparisonRequest {
	baseImage: string;
	targetImages: string[];
}

export interface ComparisonResponse {
	results: Array<{
		imageIndex: number;
		score: number;
		analysis?: string;
	}>;
}