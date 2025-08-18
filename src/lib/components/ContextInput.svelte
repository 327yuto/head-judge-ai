<script lang="ts">
	export let context: string = '';
	
	const examples = [
		'筋肉の定義と明瞭性',
		'全体的なプロポーション',
		'ポージングの美しさ',
		'シンメトリー（左右対称性）',
		'カットの深さと鮮明さ'
	];
	
	function setExample(example: string) {
		context = example;
	}
</script>

<div class="context-input">
	<h3>評価基準（コンテキスト）</h3>
	
	<div class="input-container">
		<label for="context">どのような基準で評価しますか？</label>
		<textarea
			id="context"
			bind:value={context}
			placeholder="例：筋肉の定義と明瞭性、プロポーション、ポージングなど"
			rows="3"
		></textarea>
	</div>
	
	<div class="examples">
		<p class="examples-label">参考例:</p>
		<div class="example-buttons">
			{#each examples as example}
				<button
					type="button"
					class="example-btn"
					on:click={() => setExample(example)}
				>
					{example}
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.context-input {
		margin-bottom: 2rem;
	}
	
	h3 {
		margin-bottom: 1rem;
		font-size: 1.2rem;
		font-weight: 600;
		color: #2c3e50;
	}
	
	.input-container {
		margin-bottom: 1.5rem;
	}
	
	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #333;
	}
	
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e0e0e0;
		border-radius: 6px;
		font-size: 1rem;
		font-family: inherit;
		resize: vertical;
		min-height: 80px;
		transition: border-color 0.3s ease;
	}
	
	textarea:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}
	
	.examples {
		border-top: 1px solid #e0e0e0;
		padding-top: 1rem;
	}
	
	.examples-label {
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
		color: #666;
		font-weight: 500;
	}
	
	.example-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	
	.example-btn {
		padding: 0.5rem 1rem;
		background: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 20px;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s ease;
		color: #495057;
	}
	
	.example-btn:hover {
		background: #e9ecef;
		border-color: #ced4da;
		transform: translateY(-1px);
	}
	
	.example-btn:active {
		transform: translateY(0);
	}
	
	@media (max-width: 768px) {
		.example-buttons {
			flex-direction: column;
		}
		
		.example-btn {
			width: 100%;
			text-align: left;
		}
	}
</style>