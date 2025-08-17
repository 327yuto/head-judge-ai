<script lang="ts">
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import ResultDisplay from '$lib/components/ResultDisplay.svelte';
	import { compareImages, imageToBase64 } from '$lib/api/dify';
	import type { UploadedImage, ComparisonResult } from '$lib/types';
	
	let baseImages: UploadedImage[] = [];
	let targetImages: UploadedImage[] = [];
	let results: ComparisonResult[] = [];
	let isLoading = false;
	let error: string | null = null;
	
	$: canCompare = baseImages.length === 1 && targetImages.length > 0;
	
	async function handleCompare() {
		if (!canCompare) return;
		
		isLoading = true;
		error = null;
		results = [];
		
		try {
			const baseImage64 = await imageToBase64(baseImages[0].file);
			const targetImages64 = await Promise.all(
				targetImages.map(img => imageToBase64(img.file))
			);
			
			const response = await compareImages({
				baseImage: baseImage64,
				targetImages: targetImages64
			});
			
			results = response.results.map((result, index) => ({
				imageId: targetImages[index].id,
				score: result.score,
				analysis: result.analysis
			}));
		} catch (err) {
			error = err instanceof Error ? err.message : '比較処理中にエラーが発生しました';
			console.error('Comparison error:', err);
		} finally {
			isLoading = false;
		}
	}
	
	async function handleRetry() {
		await handleCompare();
	}
	
	function resetAll() {
		baseImages.forEach(img => URL.revokeObjectURL(img.url));
		targetImages.forEach(img => URL.revokeObjectURL(img.url));
		baseImages = [];
		targetImages = [];
		results = [];
		error = null;
	}
</script>

<svelte:head>
	<title>ボディビルダー比較アプリ</title>
	<meta name="description" content="画像を基準と比較してスコアリング" />
</svelte:head>

<div class="container">
	<header>
		<h1>ボディビルダー比較アプリ</h1>
		<p class="subtitle">基準画像と比較対象を選択して、美しさをスコア化します</p>
	</header>
	
	<main>
		<div class="uploaders">
			<div class="uploader-section">
				<ImageUploader bind:images={baseImages} isBase={true} />
			</div>
			
			<div class="uploader-section">
				<ImageUploader bind:images={targetImages} isBase={false} />
			</div>
		</div>
		
		<div class="actions">
			<button 
				class="btn btn-primary"
				on:click={handleCompare}
				disabled={!canCompare || isLoading}
			>
				{#if isLoading}
					比較中...
				{:else}
					比較実行
				{/if}
			</button>
			
			{#if baseImages.length > 0 || targetImages.length > 0}
				<button 
					class="btn btn-secondary"
					on:click={resetAll}
					disabled={isLoading}
				>
					リセット
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
		
		<ResultDisplay {results} images={targetImages} />
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
	
	.uploaders {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		margin-bottom: 2rem;
	}
	
	@media (min-width: 768px) {
		.uploaders {
			grid-template-columns: 1fr 2fr;
		}
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