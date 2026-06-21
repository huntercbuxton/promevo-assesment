import { useQuery, useMutation, useQueryClient, QueryClient,
  QueryClientProvider } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';


const queryClient = new QueryClient()

// Types for form values
interface LabelFormData {
  name: string;
  messageListVisibility: string;
  labelListVisibility: string;
}

// Simulated API calls
const fetchLabel = async (id: string): Promise<LabelFormData> => {
  const res = await fetch(`http://localhost:8080/${id}`);
  if (!res.ok) throw new Error('Failed to load label data');
  return res.json();
};

const updateLabel = async (data: LabelFormData): Promise<void> => {
  await fetch('http://localhost:8080/update', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json' // 2. Tell the server to expect JSON
    },
    body: JSON.stringify(data),
  });
};

export function UpdateLabelForm({ labelId }: { labelId: string }) {
  const queryClient = useQueryClient();

  // 1. Fetch data from server
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['label', labelId],
    queryFn: () => fetchLabel(labelId),
  });

  // 2. Initialize React Hook Form with reactive "values"
  const { register, handleSubmit, formState: { errors } } = useForm<LabelFormData>({
    // 'values' replaces 'defaultValues' for data streams like useQuery
    values: userProfile || { name: '', labelListVisibility: '', messageListVisibility: '' },
  });

  // 3. Handle data persistence using useMutation
  const { mutate, isPending } = useMutation({
    mutationFn: updateLabel,
    onSuccess: () => {
      // Invalidate the cache to trigger a fresh background refresh
      queryClient.invalidateQueries({ queryKey: ['label', labelId] });
    },
  });

  if (isLoading) return <div>Loading initial label data...</div>;

  return (
    <form onSubmit={handleSubmit((values) => mutate(values))}>
      <div>
        <label>First Name</label>
        <input {...register('name', { required: true })} />
        {errors.name && <span>This field is required</span>}
      </div>

      <div>
        <label>Last Name</label>
        <input {...register('messageListVisibility', { required: true })} />
        {errors.messageListVisibility && <span>This field is required</span>}
      </div>
      <div>
        <label>Last Name</label>
        <input {...register('labelListVisibility', { required: true })} />
        {errors.labelListVisibility && <span>This field is required</span>}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>

    </form>
  );
}

export default function UpdateLabelPage() {

  const labelId: string = 'Label_6';
  return (
    <>
       <QueryClientProvider client={queryClient}>
          <h1>Update Label Page</h1>
          <UpdateLabelForm labelId={labelId} />
       </QueryClientProvider> 
    </>
  )
}