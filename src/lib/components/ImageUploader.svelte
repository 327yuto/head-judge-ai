<script lang="ts">
	import type { UploadedImage } from '$lib/types';
	
	export let image: UploadedImage | null = null;
	export let maxImages = 1;
	
	let fileInput: HTMLInputElement;
	let isDragging = false;
	
	function handleFiles(files: FileList | null) {
		if (!files) return;
		
		const validFiles = Array.from(files).filter(file => 
			file.type.startsWith('image/')
		);
		
		if (validFiles.length === 0) {
			alert('画像ファイルのみアップロード可能です');
			return;
		}
		
		// Clean up previous image if exists
		if (image) {
			URL.revokeObjectURL(image.url);
		}
		
		// Take the first valid file
		const file = validFiles[0];
		const url = URL.createObjectURL(file);
		image = {
			id: crypto.randomUUID(),
			file,
			url
		};
	}
	
	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		handleFiles(e.dataTransfer?.files || null);
	}
	
	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}
	
	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}
	
	function removeImage() {
		if (image) {
			URL.revokeObjectURL(image.url);
			image = null;
		}
	}
	
	function triggerFileInput() {
		fileInput?.click();
	}
</script>

<div class="uploader">
	<div 
		class="drop-zone"
		class:dragging={isDragging}
		class:has-image={image !== null}
		on:drop={handleDrop}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		role="button"
		tabindex="0"
		on:click={triggerFileInput}
		on:keydown={(e) => e.key === 'Enter' && triggerFileInput()}
	>
		{#if !image}
			<p>画像をドラッグ&ドロップ<br>または<br>クリックして選択</p>
		{:else}
			<div class="image-container">
				<div class="image-item">
					<img src={image.url} alt="評価対象画像" />
					<button
						class="remove-btn"
						on:click|stopPropagation={removeImage}
						aria-label="画像を削除"
					>
						×
					</button>
				</div>
			</div>
		{/if}
	</div>
	
	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		on:change={(e) => handleFiles(e.currentTarget.files)}
		style="display: none;"
	/>
</div>

<style>
	.uploader {
		margin-bottom: 2rem;
	}
	
	.drop-zone {
		border: 2px dashed #ccc;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		cursor: pointer;
		transition: all 0.3s ease;
		min-height: 150px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.drop-zone:hover {
		border-color: #666;
		background-color: #f9f9f9;
	}
	
	.drop-zone.dragging {
		border-color: #4a90e2;
		background-color: #e8f4fd;
	}
	
	.drop-zone.has-image {
		padding: 1rem;
	}
	
	.image-container {
		display: flex;
		justify-content: center;
		width: 100%;
	}
	
	.image-item {
		position: relative;
		width: 200px;
		height: 200px;
		overflow: hidden;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
	
	.image-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.remove-btn {
		position: absolute;
		top: 4px;
		right: 4px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid #999;
		cursor: pointer;
		font-size: 18px;
		line-height: 1;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}
	
	.remove-btn:hover {
		background: #ff4444;
		color: white;
		border-color: #ff4444;
	}
	
</style>