import Checkbox from './assets/Checkbox/Checkbox.svelte';
import Combobox from './assets/Combobox/Combobox.svelte';
import Field from './assets/Field';
import Pages from '../Pages/Pages.svelte';
import Textarea from './assets/Textarea/Textarea.svelte';

import Form from './Form.svelte';

export default Object.assign(Form, { Field, Checkbox, Textarea, Combobox, Pages });
