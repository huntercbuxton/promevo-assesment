import { useQuery, useMutation, useQueryClient, QueryClient,
  QueryClientProvider } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { type LabelData, type LabelColorData } from './labeldata';
import { useParams } from "react-router";

const queryClient = new QueryClient()
 
// Types for form values
interface LabelFormData {
  id: string;
  name: string;
  messageListVisibility: string;
  labelListVisibility: string;
  textColor?: string;
  backgroundColor?: string;
  color?: LabelColorData; 
}

// Simulated API calls
export const fetchLabel = async (id: string): Promise<LabelData> => {
  const res = await fetch(`http://localhost:8080/${id}`);
  if (!res.ok) throw new Error('Failed to load label data');
  return res.json();
};

const updateLabel = async ( data: LabelFormData): Promise<void> => {
  const req_body = {
    id: data.id,
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

  await fetch('http://localhost:8080/update', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json' // 2. Tell the server to expect JSON
    },
    body: JSON.stringify(req_body),
  });
};

export function UpdateLabelForm({ labelId }: { labelId: string }) {
  const queryClient = useQueryClient();

  // 1. Fetch data from server
  const { data, isLoading } = useQuery({
    queryKey: ['label', labelId], 
    queryFn: async () => {
        const label_data = await fetchLabel(labelId); 
        const label_form_data = { 
            id: label_data.id,
            name: label_data.name,
            messageListVisibility: label_data.messageListVisibility,
            labelListVisibility: label_data.labelListVisibility,
            color: label_data.color,
            textColor: (!label_data.color || label_data.color === undefined) ?  '' : label_data.color?.textColor,
            backgroundColor: (!label_data.color || label_data.color === undefined) ?  '' : label_data.color?.backgroundColor 
        } 
        console.log(`label_form_data from fetch query : ${JSON.stringify(label_form_data)}`)
        return label_form_data
    }
  });

   const form_data_defaults = { 
        id: labelId,
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
        values: data || form_data_defaults,
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
            {isPending ? 'Saving...' : 'Save Changes'}
      </button>

    </form>
  );
}

export default function UpdatePage() {

    let params = useParams(); 
    // const labelId: string = 'Label_6';

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <h1>Label Detail Page</h1>
                <UpdateLabelForm labelId={`${params['id']}`} />
            </QueryClientProvider> 
        </>
    )
}