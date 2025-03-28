import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	createExpense,
	getAllExpensesQueryOptions,
	loadingCreateExpenseQueryOptions,
} from '@/lib/api';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-form-adapter';

import { toast } from 'sonner';

import { zCreateExpenseSchema } from '../../../../shared/zSchemas';

export const Route = createFileRoute('/_authenticated/create-expense')({
	component: CreateExpense,
});

function CreateExpense() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const form = useForm({
		validatorAdapter: zodValidator,
		defaultValues: {
			userId: '',
			title: '',
			amount: 0,
			date: new Date().toISOString(),
		},
		onSubmit: async ({ value }) => {
			navigate({ to: '/expenses' });

			// loading state
			queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {
				expense: value,
			});

			try {
				await createExpense({ value });

				queryClient.invalidateQueries(getAllExpensesQueryOptions);

				toast('Expense Created', {
					description: `Successfully created new expense`,
				});
				// success state
			} catch (error) {
				console.error(error);
				// error state
				toast('Error', {
					description: `Failed to create new expense`,
				});
			} finally {
				queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {});
			}
		},
	});

	return (
		<div className="p-2">
			<h2>Create Expense</h2>
			<form.Provider>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
					className="flex flex-col gap-y-4 max-w-xl m-auto"
				>
					<form.Field
						name="title"
						validators={{
							onChange: (value) => {
								const result =
									zCreateExpenseSchema.shape.title.safeParse(value);
								return result.success
									? undefined
									: result.error.issues[0].message;
							},
						}}
						children={(field) => (
							<div>
								<Label htmlFor={field.name}>Title</Label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.touchedErrors
									? (
											<em>{field.state.meta.touchedErrors}</em>
										)
									: null}
							</div>
						)}
					/>

					<form.Field
						name="amount"
						validators={{
							onChange: (value) => {
								const result =
									zCreateExpenseSchema.shape.amount.safeParse(value);
								return result.success
									? undefined
									: result.error.issues[0].message;
							},
						}}
						children={(field) => (
							<div>
								<Label htmlFor={field.name}>Amount</Label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									type="number"
									onChange={(e) => field.handleChange(Number(e.target.value))}
								/>
								{field.state.meta.touchedErrors
									? (
											<em>{field.state.meta.touchedErrors}</em>
										)
									: null}
							</div>
						)}
					/>

					<form.Field
						name="date"
						validators={{
							onChange: (value) => {
								const result = zCreateExpenseSchema.shape.date.safeParse(value);
								return result.success
									? undefined
									: result.error.issues[0].message;
							},
						}}
						children={(field) => (
							<div className="self-center">
								<Calendar
									mode="single"
									selected={new Date(field.state.value)}
									onSelect={(date) =>
										field.handleChange((date ?? new Date()).toISOString())}
									className="rounded-md border"
								/>
								{field.state.meta.touchedErrors
									? (
											<em>{field.state.meta.touchedErrors}</em>
										)
									: null}
							</div>
						)}
					/>

					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<Button className="mt-4" type="submit" disabled={!canSubmit}>
								{isSubmitting ? '...' : 'Submit'}
							</Button>
						)}
					/>
				</form>
			</form.Provider>
		</div>
	);
}
