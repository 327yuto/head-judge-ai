<script lang="ts">
	import type { EvaluationResult, UploadedImage } from '$lib/types';
	import ImageModal from './ImageModal.svelte';
	
	export let results: EvaluationResult[] = [];
	export let images: UploadedImage[] = [];
	
	let selectedImage: UploadedImage | null = null;
	
	function getImageById(id: string): UploadedImage | undefined {
		return images.find(img => img.id === id);
	}
	
	function openModal(image: UploadedImage) {
		selectedImage = image;
	}
	
	function closeModal() {
		selectedImage = null;
	}
	
	$: sortedResults = [...results].sort((a, b) => b.score - a.score).map((result, index) => ({
		...result,
		rank: index + 1
	}));
</script>

{#if results.length > 0}
	<div class="results-container">
		<h2>比較結果</h2>
		
		<div class="results-grid">
			{#each sortedResults as result (result.imageId)}
				{@const image = getImageById(result.imageId)}
				{#if image}
					<div class="result-card" class:gold={result.rank === 1} class:silver={result.rank === 2} class:bronze={result.rank === 3}>
						<div class="rank-badge">#{result.rank}</div>
						
						<button 
							class="image-wrapper"
							on:click={() => openModal(image)}
							aria-label="画像を拡大"
						>
							<img src={image.url} alt={`Rank ${result.rank}`} />
						</button>
						
						<div class="score-display">
							<span class="score-label">スコア</span>
							<span class="score-value">{result.score.toFixed(1)}</span>
						</div>
						
						{#if result.analysis}
							<p class="analysis">{result.analysis}</p>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	</div>
{/if}

{#if selectedImage}
	<ImageModal image={selectedImage} on:close={closeModal} />
{/if}

<style>
	.results-container {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid #e0e0e0;
	}
	
	h2 {
		margin-bottom: 2rem;
		font-size: 1.5rem;
		text-align: center;
	}
	
	.results-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 2rem;
	}
	
	.result-card {
		position: relative;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition: transform 0.3s ease;
	}
	
	.result-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}
	
	.result-card.gold {
		box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
	}
	
	.result-card.silver {
		box-shadow: 0 2px 8px rgba(192, 192, 192, 0.3);
	}
	
	.result-card.bronze {
		box-shadow: 0 2px 8px rgba(205, 127, 50, 0.3);
	}
	
	.rank-badge {
		position: absolute;
		top: 8px;
		left: 8px;
		background: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 4px 8px;
		border-radius: 4px;
		font-weight: bold;
		z-index: 1;
		font-size: 0.9rem;
	}
	
	.result-card.gold .rank-badge {
		background: linear-gradient(135deg, #FFD700, #FFA500);
	}
	
	.result-card.silver .rank-badge {
		background: linear-gradient(135deg, #C0C0C0, #808080);
	}
	
	.result-card.bronze .rank-badge {
		background: linear-gradient(135deg, #CD7F32, #8B4513);
	}
	
	.image-wrapper {
		display: block;
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
		cursor: pointer;
		border: none;
		padding: 0;
		background: #f5f5f5;
	}
	
	.image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}
	
	.image-wrapper:hover img {
		transform: scale(1.05);
	}
	
	.score-display {
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid #e0e0e0;
	}
	
	.score-label {
		font-size: 0.9rem;
		color: #666;
	}
	
	.score-value {
		font-size: 1.5rem;
		font-weight: bold;
		color: #333;
	}
	
	.analysis {
		padding: 0 1rem 1rem;
		font-size: 0.85rem;
		color: #666;
		line-height: 1.4;
	}
</style>