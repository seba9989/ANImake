<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<button class="btn" type="button" onclick={async () => {
	console.log(await authClient.signOut());
	
}}>SingOut</button>