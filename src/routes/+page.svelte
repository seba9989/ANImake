<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { onMount } from 'svelte';

	onMount(async () => {
		const { data, error } = await authClient.signUp.email({
			email: 'sgrzybbowski@gmail.com',
			name: 'Seba9989',
			password: 'budrys12',
		});
		console.log(data);
		console.log(error);
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
