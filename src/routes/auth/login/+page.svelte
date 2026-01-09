<script lang="ts">
	import Form from '$lib/components/Form';
	import type { PageProps } from './$types';
	import { singIn } from '$lib/actions/auth/singIn.remote';
	import Icon from '@iconify/svelte';
	import { authClient } from '$lib/auth-client';

	let { data }: PageProps = $props();
</script>

<div class="card-body gap-2 p-6">
	<h2 class="mx-auto card-title">Witamy ponownie w HoshiAnime</h2>
	<div class="flex h-full flex-col">
		<Form class="flex grow flex-col justify-center" form={singIn}>
			<fieldset class="fieldset gap-4 *:w-full">
				<Form.Field field={singIn.fields.email} placeholder="Email" />
				<div>
					<Form.Field.Secret field={singIn.fields._password} placeholder="Hasło" />
					<div class="mt-1 flex items-center justify-between">
						<Form.Checkbox field={singIn.fields.rememberMe} placeholder="Remember me" />
						<!-- TODO: Dodać odzyskiwanie konta. -->
						<a class="link link-info" href=".">Nie pamiętam hasła.</a>
					</div>
				</div>
				<div class="grid gap-4 sm:grid-cols-2">
					<button type="submit" class="btn text-nowrap btn-secondary"> Zaloguj się </button>
					<a href="/auth/register" class="btn text-nowrap btn-neutral"> Zarejestruj się </a>
				</div>
			</fieldset>
		</Form>
		<div class="divider">LUB</div>
		<div class="grow"></div>
		<div class="flex justify-around">
			<div class="tooltip" data-tip="Już wkrótce">
				<a
					href="/"
					class="btn btn-disabled btn-square p-2 btn-neutral"
					role="button"
					aria-disabled="true"
				>
					<Icon icon="simple-icons:discord" width="none" />
				</a>
			</div>
			<div class="tooltip" data-tip="Już wkrótce">
				<a
					href="/"
					class="btn btn-disabled btn-square p-2 btn-neutral"
					role="button"
					aria-disabled="true"
				>
					<Icon icon="simple-icons:google" width="none" />
				</a>
			</div>
			<div class="tooltip" data-tip="Już wkrótce">
				<a
					href="/"
					class="btn btn-disabled btn-square p-2 btn-neutral"
					role="button"
					aria-disabled="true"
				>
					<Icon icon="simple-icons:github" width="none" />
				</a>
			</div>
		</div>
	</div>
</div>
