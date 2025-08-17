<script lang="ts">
	import type { UploadedImage } from '$lib/types';
	
	export let images: UploadedImage[] = [];
	export let isBase = false;
	export let maxImages = isBase ? 1 : 10;
	
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
		
		if (isBase && images.length > 0) {
			images = [];
		}
		
		const remainingSlots = maxImages - images.length;
		const filesToAdd = validFiles.slice(0, remainingSlots);
		
		filesToAdd.forEach(file => {
			const url = URL.createObjectURL(file);
			const newImage: UploadedImage = {
				id: crypto.randomUUID(),
				file,
				url,
				isBase
			};
			images = [...images, newImage];
		});
		
		if (validFiles.length > remainingSlots) {
			alert(`最大${maxImages}枚まで追加可能です`);
		}
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
	
	function removeImage(id: string) {
		const image = images.find(img => img.id === id);
		if (image) {
			URL.revokeObjectURL(image.url);
			images = images.filter(img => img.id !== id);
		}
	}
	
	function triggerFileInput() {
		fileInput?.click();
	}
</script>

<div class="uploader">
	<h3>{isBase ? '基準画像' : '比較対象画像'}</h3>
	
	<div 
		class="drop-zone"
		class:dragging={isDragging}
		class:has-images={images.length > 0}
		on:drop={handleDrop}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		role="button"
		tabindex="0"
		on:click={triggerFileInput}
		on:keydown={(e) => e.key === 'Enter' && triggerFileInput()}
	>
		{#if images.length === 0}
			<p>画像をドラッグ&ドロップ<br>または<br>クリックして選択</p>
		{:else}
			<div class="image-grid">
				{#each images as image (image.id)}
					<div class="image-item">
						<img src={image.url} alt="Uploaded" />
						<button
							class="remove-btn"
							on:click|stopPropagation={() => removeImage(image.id)}
							aria-label="画像を削除"
						>
							×
						</button>
					</div>
				{/each}
			</div>
			{#if !isBase && images.length < maxImages}
				<p class="add-more">さらに追加（{images.length}/{maxImages}）</p>
			{/if}
		{/if}
	</div>
	
	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		multiple={!isBase}
		on:change={(e) => handleFiles(e.currentTarget.files)}
		style="display: none;"
	/>
</div>

<style>
	.uploader {
		margin-bottom: 2rem;
	}
	
	h3 {
		margin-bottom: 1rem;
		font-size: 1.2rem;
		font-weight: 600;
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
	
	.drop-zone.has-images {
		padding: 1rem;
	}
	
	.image-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 1rem;
		width: 100%;
	}
	
	.image-item {
		position: relative;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 4px;
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
	
	.add-more {
		margin-top: 1rem;
		font-size: 0.9rem;
		color: #666;
	}
</style>