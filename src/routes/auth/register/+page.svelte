<script lang="ts">
	import { singUp } from '$lib/actions/auth/singUp.remote';
	import { authClient } from '$lib/auth-client';
	import Form from '$lib/components/Form';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="card-body gap-2 p-6">
	<h2 class="card-title mx-auto">Witamy w HoshiAnime</h2>
	<Form class="flex flex-col h-full justify-center" form={singUp}>
		<fieldset class="fieldset gap-4 *:w-full">
			<Form.Field field={singUp.fields.name} placeholder="Login" />
			<Form.Field field={singUp.fields.email} placeholder="Emile" />
			<Form.Field.Secret field={singUp.fields.password} placeholder="Password" />
			<Form.Field.Secret field={singUp.fields.confirmPassword} placeholder="Confirm password" />

			<div class="grid gap-4 sm:grid-cols-2">
				<button type="submit" class="btn text-nowrap btn-secondary"> Zarejestruj się </button>
				<a href="/auth/login" class="btn text-nowrap btn-neutral"> Zaloguj się </a>
			</div>
		</fieldset>
	</Form>
</div>
