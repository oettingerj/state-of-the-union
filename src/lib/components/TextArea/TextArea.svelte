<script context="module" lang="ts">
	import './TextArea.css'
</script>

<script lang="ts">
	import { Editor } from '@tiptap/core'
	import { BulletList } from '@tiptap/extension-bullet-list'
	import { Document } from '@tiptap/extension-document'
	import { Bold } from '@tiptap/extension-bold'
	import { Italic } from '@tiptap/extension-italic'
	import { Text } from '@tiptap/extension-text'
	import { Paragraph } from '@tiptap/extension-paragraph'
	import { ListItem } from '@tiptap/extension-list-item'
	import { Underline } from '@tiptap/extension-underline'
	import { History } from '@tiptap/extension-history'
	import { TextStyle } from '@tiptap/extension-text-style'
	import { Color } from '@tiptap/extension-color'
	import { Image } from '@tiptap/extension-image'
	import { onDestroy, onMount } from 'svelte'
	import { uploadImage } from '$lib/services/firebase/storage'
	import { uid } from 'radash'

	export let value = ''
	let className = ''
	export { className as class }
	let editorAnchor: HTMLElement
	let editor: Editor
	let currentColor = '#000000'
	let colorPickerLabelRef: HTMLLabelElement
	let colorPickerRef: HTMLInputElement
	let fileInputRef: HTMLInputElement
	let uploadingImage = false
	const id = uid(5)

	$: isBold = editor?.isActive('bold')
	$: isItalic = editor?.isActive('italic')
	$: isUnderlined = editor?.isActive('underline')
	$: isList = editor?.isActive('bulletList')
	$: isFocused = editor?.isFocused

	onMount(() => {
		editor = new Editor({
			element: editorAnchor,
			extensions: [
				Document,
				Text,
				Paragraph.configure({
					HTMLAttributes: {
						class: 'max-h-full'
					}
				}),
				Bold,
				Italic,
				Underline,
				ListItem.configure({
					HTMLAttributes: {
						class: 'list-disc list-outside'
					}
				}),
				BulletList,
				History,
				TextStyle,
				Color,
				Image.configure({
					inline: true,
					HTMLAttributes: {
						class: 'object-contain max-h-[200px]'
					}
				})
			],
			content: value,
			editable: true,
			onTransaction() {
				editor = editor
			}
		})
		editor.commands.setColor(currentColor)
		editor.on('update', handleInput)
	})

	onDestroy(() => {
		if (editor) {
			editor.destroy()
		}
	})

	function handleInput() {
		value = editor.getHTML()
	}

	function toggleBold() {
		editor.commands.toggleBold()
	}

	function toggleItalic() {
		editor.commands.toggleItalic()
	}

	function toggleUnderline() {
		editor.commands.toggleUnderline()
	}

	function toggleList() {
		editor.commands.toggleBulletList()
	}

	function handleColorPickerClick() {
		colorPickerLabelRef.click()
	}

	function handleChangeColor() {
		currentColor = colorPickerRef.value
		editor.commands.setColor(currentColor)
	}

	function addImage() {
		fileInputRef.click()
	}

	async function handleSelectImage() {
		const files = fileInputRef.files
		if (files && files.length > 0) {
			uploadingImage = true
			const imageUrl = await uploadImage(files[0])
			editor.commands.setImage({ src: imageUrl })
			uploadingImage = false
		}
	}
</script>

<div
	class="bg-white rounded-lg border border-gray-300 overflow-hidden {className}"
	class:border-pink-500={isFocused}
>
	<div class="flex p-2 gap-2">
		<nord-button-group>
			<nord-button
				variant={isBold ? 'primary' : 'default'}
				class:selected={isBold}
				on:click={toggleBold}
				on:mousedown|preventDefault
			>
				<nord-icon name="text-bold" size="m" />
			</nord-button>
			<nord-button
				variant={isItalic ? 'primary' : 'default'}
				class:selected={isItalic}
				on:click={toggleItalic}
				on:mousedown|preventDefault
			>
				<nord-icon name="text-italic" size="m" />
			</nord-button>
			<nord-button
				variant={isUnderlined ? 'primary' : 'default'}
				class:selected={isUnderlined}
				on:click={toggleUnderline}
				on:mousedown|preventDefault
			>
				<nord-icon name="text-underline" size="m" />
			</nord-button>
		</nord-button-group>
		<nord-button-group>
			<nord-button
				variant={isList ? 'primary' : 'default'}
				class:selected={isList}
				on:click={toggleList}
				on:mousedown|preventDefault
			>
				<nord-icon name="text-list" size="m" />
			</nord-button>
			<nord-button loading={uploadingImage} on:click={addImage} on:mousedown|preventDefault>
				<nord-icon name="file-picture" size="m" />
				<input
					bind:this={fileInputRef}
					hidden
					type="file"
					accept="image/*"
					on:change|preventDefault={handleSelectImage}
				/>
			</nord-button>
		</nord-button-group>
		<div class="relative">
			<nord-button
				style="--n-button-padding-inline: 4px"
				on:click={handleColorPickerClick}
				on:mousedown|preventDefault
			>
				<div class="h-6 w-6 rounded-sm" style="background-color: {currentColor}" />
			</nord-button>
			<input
				id="{id}-color-input"
				bind:this={colorPickerRef}
				value={currentColor}
				type="color"
				class="absolute opacity-0 left-1/2 -translate-x-1/2 bottom-0 translate-y-full pointer-events-none"
				on:input={handleChangeColor}
			/>
			<label bind:this={colorPickerLabelRef} hidden for="{id}-color-input" />
		</div>
	</div>
	<div class="h-full" bind:this={editorAnchor} />
</div>

<style>
	nord-button.selected {
		--n-button-border-color: transparent;
	}
</style>
