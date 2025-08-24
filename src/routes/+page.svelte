<script lang="ts">
	import ContextInput from '$lib/components/ContextInput.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import ResultDisplay from '$lib/components/ResultDisplay.svelte';
	import { evaluateImage } from '$lib/api/dify';
	import type { UploadedImage, EvaluationResult } from '$lib/types';
	
	let context: string = '';
	let image1: UploadedImage | null = null;
	let image2: UploadedImage | null = null;
	let results: EvaluationResult[] = [];
	let evaluatedImages: UploadedImage[] = [];
	let isLoading = false;
	let error: string | null = null;
	
	$: canEvaluate = context.trim() !== '' && image1 !== null && image2 !== null;
	
	async function handleEvaluate() {
		if (!canEvaluate || !image1 || !image2) return;
		
		isLoading = true;
		error = null;
		
		try {
			const response = await evaluateImage({
				context: context.trim(),
				image1: image1.file,
				image2: image2.file
			});
			
			// Create evaluation result
			const evaluationResult: EvaluationResult = {
				id: crypto.randomUUID(),
				imageId: `${image1.id}_${image2.id}`,
				score: response.text.score,
				analysis: response.text.analysis,
				details: response.text.details,
				timestamp: new Date()
			};
			
			// Add to results and evaluated images
			results = [...results, evaluationResult];
			evaluatedImages = [...evaluatedImages, image1, image2];
			
			// Sort results by score (highest first)
			results = results.sort((a, b) => b.score - a.score).map((result, index) => ({
				...result,
				rank: index + 1
			}));
			
			// Clear images for next evaluation
			image1 = null;
			image2 = null;
			
		} catch (err) {
			error = err instanceof Error ? err.message : '評価処理中にエラーが発生しました';
			console.error('Evaluation error:', err);
		} finally {
			isLoading = false;
		}
	}
	
	async function handleRetry() {
		await handleEvaluate();
	}
	
	function resetAll() {
		if (image1) {
			URL.revokeObjectURL(image1.url);
		}
		if (image2) {
			URL.revokeObjectURL(image2.url);
		}
		evaluatedImages.forEach(img => URL.revokeObjectURL(img.url));
		
		context = '';
		image1 = null;
		image2 = null;
		results = [];
		evaluatedImages = [];
		error = null;
	}
</script>

<svelte:head>
	<title>画像比較評価アプリ</title>
	<meta name="description" content="コンテキストに基づいて2つの画像を比較評価" />
</svelte:head>

<div class="container">
	<header>
		<h1>画像比較評価アプリ</h1>
		<p class="subtitle">評価基準を設定して、2つの画像を比較評価します</p>
	</header>
	
	<main>
		<div class="evaluation-form">
			<ContextInput bind:context />
			<div class="images-container">
				<div class="image-upload-wrapper">
					<h3>画像1</h3>
					<ImageUploader bind:image={image1} />
				</div>
				<div class="image-upload-wrapper">
					<h3>画像2</h3>
					<ImageUploader bind:image={image2} />
				</div>
			</div>
		</div>
		
		<div class="actions">
			<button 
				class="btn btn-primary"
				on:click={handleEvaluate}
				disabled={!canEvaluate || isLoading}
			>
				{#if isLoading}
					評価中...
				{:else}
					評価実行
				{/if}
			</button>
			
			{#if results.length > 0}
				<button 
					class="btn btn-secondary"
					on:click={resetAll}
					disabled={isLoading}
				>
					全てリセット
				</button>
			{/if}
		</div>
		
		{#if error}
			<div class="error-container">
				<p class="error-message">{error}</p>
				<button class="btn btn-retry" on:click={handleRetry}>
					再試行
				</button>
			</div>
		{/if}
		
		<ResultDisplay {results} images={evaluatedImages} />
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		background: #f5f5f5;
		color: #333;
	}
	
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}
	
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}
	
	header {
		text-align: center;
		margin-bottom: 3rem;
	}
	
	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: #2c3e50;
	}
	
	.subtitle {
		font-size: 1.1rem;
		color: #666;
	}
	
	.evaluation-form {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		margin-bottom: 2rem;
	}
	
	.images-container {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}
	
	@media (min-width: 768px) {
		.images-container {
			grid-template-columns: 1fr 1fr;
		}
	}
	
	.image-upload-wrapper h3 {
		margin-bottom: 0.5rem;
		font-size: 1.1rem;
		color: #555;
	}
	
	.actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}
	
	.btn {
		padding: 0.75rem 2rem;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	
	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.btn-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}
	
	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
	}
	
	.btn-secondary {
		background: #e0e0e0;
		color: #333;
	}
	
	.btn-secondary:hover:not(:disabled) {
		background: #d0d0d0;
	}
	
	.btn-retry {
		background: #ff6b6b;
		color: white;
	}
	
	.btn-retry:hover {
		background: #ff5252;
	}
	
	.error-container {
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 8px;
		padding: 1rem;
		margin-bottom: 2rem;
		text-align: center;
	}
	
	.error-message {
		color: #c00;
		margin-bottom: 1rem;
	}
</style>