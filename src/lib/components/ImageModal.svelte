<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { UploadedImage } from '$lib/types';
	
	export let image: UploadedImage;
	
	const dispatch = createEventDispatcher();
	
	function handleClose() {
		dispatch('close');
	}
	
	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="modal-backdrop" on:click={handleBackdropClick} on:keydown={(e) => e.key === 'Enter' && handleBackdropClick(e)} role="button" tabindex="0">
	<div class="modal-content">
		<button class="close-btn" on:click={handleClose} aria-label="閉じる">
			×
		</button>
		<img src={image.url} alt="拡大画像" />
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		animation: fadeIn 0.2s ease;
	}
	
	.modal-content {
		position: relative;
		max-width: 90vw;
		max-height: 90vh;
		animation: slideIn 0.3s ease;
	}
	
	.modal-content img {
		max-width: 100%;
		max-height: 90vh;
		object-fit: contain;
		border-radius: 8px;
	}
	
	.close-btn {
		position: absolute;
		top: -40px;
		right: 0;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.9);
		border: none;
		cursor: pointer;
		font-size: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}
	
	.close-btn:hover {
		background: white;
		transform: scale(1.1);
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
	@keyframes slideIn {
		from {
			transform: scale(0.9);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	
	@media (max-width: 768px) {
		.close-btn {
			top: 10px;
			right: 10px;
			background: rgba(0, 0, 0, 0.7);
			color: white;
		}
		
		.close-btn:hover {
			background: rgba(0, 0, 0, 0.9);
		}
	}
</style>