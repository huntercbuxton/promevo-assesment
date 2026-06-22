import { useQuery, useMutation, useQueryClient, QueryClient,
  QueryClientProvider } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
// import { type LabelData, type LabelColorData } from './labeldata'; 

const queryClient = new QueryClient();

// Types for form values
interface LabelFormData { 
  name: string;
  messageListVisibility: string;
  labelListVisibility: string;
  textColor?: string;
  backgroundColor?: string;
}
 
const createLabel = async ( data: LabelFormData): Promise<void> => {
  const req_body = { 
    name: data.name,
    messageListVisibility: data.messageListVisibility,
    labelListVisibility: data.labelListVisibility, 
  }
  if (data.textColor && data.backgroundColor) {
      req_body['color'] = {
        textColor: data.textColor,
        backgroundColor: data.backgroundColor
      }
  }

  await fetch('http://localhost:8080/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json' // 2. Tell the server to expect JSON
    },
    body: JSON.stringify(req_body),
  });
};

export function CreateLabelForm() {
  const queryClient = useQueryClient();

  // 1. Fetch data from server 

   const form_data_defaults = {  
        name: '',
        labelListVisibility: '', 
        messageListVisibility: '',
        textColor: '',
        backgroundColor: ''
    }
    
  // 2. Initialize React Hook Form with reactive "values"
  const { register, 
        handleSubmit, 
        formState: { errors } } = useForm<LabelFormData>({
        // 'values' replaces 'defaultValues' for data streams like useQuery 
        values: form_data_defaults,
  });

  // 3. Handle data persistence using useMutation
  const { mutate, isPending } = useMutation({
    mutationFn:  createLabel,
    onSuccess: () => {
      // Invalidate the cache to trigger a fresh background refresh
    //   queryClient.invalidateQueries({ queryKey: ['label', labelId] });
    },
  });
 
  return (
    <form onSubmit={handleSubmit((values) => mutate(values))}>
      <div>
        <label>Name</label>
        <input {...register('name', { required: true })} />
        {errors.name && <span>This field is required</span>}
      </div>

      <div>
        <label>Message List Visibility</label>
        <input {...register('messageListVisibility', { required: true })} />
        {errors.messageListVisibility && <span>This field is required</span>}
      </div>
      <div>
        <label>Label List Visibility</label>
        <input {...register('labelListVisibility', { required: true })} />
        {errors.labelListVisibility && <span>This field is required</span>}
      </div>
      <div>
        <label>Text Color</label>
        <input {...register('textColor')} /> 
      </div>
       <div>
        <label>Background Color</label>
        <input {...register('backgroundColor')} /> 
      </div>
       
      {/* TODO: disable submit button if there are any errors in the form input */}
      <button 
        type="submit"  
        disabled={isPending}>
            {isPending ? 'Saving...' : 'Create Label'}
      </button>

    </form>
  );
}

// TODO: handle api error responses
export default function CreatePage() { 
    return (
        <QueryClientProvider client={queryClient}>
            <h1>Create Label</h1>
            <CreateLabelForm />
        </QueryClientProvider> 
    )
}