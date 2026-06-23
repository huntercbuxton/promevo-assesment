import { useState } from 'react'
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider
} from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { type LabelData, type LabelColorData } from './labeldata'; 
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box'; 
import Container from '@mui/material/Container'; 
import { FormItemTitle, LabelFormItem } from './template';

const queryClient = new QueryClient();

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

const updateLabel = async (data: LabelFormData): Promise<void> => {
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

    const api_response = await fetch('http://localhost:8080/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // 2. Tell the server to expect JSON
        },
        body: JSON.stringify(req_body),
    });

    if (api_response.status !== 200) {
        throw new Error(`Update api responded with status code ${api_response.status}`)
    }

};


export default function UpdateLabelForm({ labelData, onSave }) {
    const queryClient = useQueryClient();

    const form_data_defaults = {
        id: '',
        name: '',
        labelListVisibility: '',
        messageListVisibility: '',
        textColor: '',
        backgroundColor: ''
    }

    const [saveError, setSaveError] = useState('');


    // 2. Initialize React Hook Form with reactive "values"
    const { register,
        handleSubmit,
        formState: { errors } } = useForm<LabelFormData>({
            // 'values' replaces 'defaultValues' for data streams like useQuery 
            values: {
                ...form_data_defaults,
                ...labelData,
                backgroundColor: labelData.color?.backgroundColor,
                textColor: labelData.color?.textColor
            }
        });

    // 3. Handle data persistence using useMutation
    const { mutate, isPending } = useMutation({
        mutationFn: updateLabel,
        onSuccess: () => {
            // Invalidate the cache to trigger a fresh background refresh
            queryClient.invalidateQueries({ queryKey: ['labelDetailData'] });
            if (saveError) setSaveError('')
            onSave()
        },
        onError: (error, variables, context) => {
            console.error(`Mutation failed for ${variables.title}:`, error.message);
            setSaveError(`Error while saving changes: ${error}`)
        }
    });

    return (
        <form onSubmit={handleSubmit((values) => {
            mutate(values);
        })}>
            <Box sx={{ width: '100%' }}>
                <Stack spacing={2} >
                    <LabelFormItem>
                        <FormItemTitle>Name</FormItemTitle>
                        <input {...register('name', { required: true })} />
                        {errors.name && <span>This field is required</span>}
                    </LabelFormItem>
                    <LabelFormItem>
                        <FormItemTitle>Message List Visibility</FormItemTitle>
                        <input {...register('messageListVisibility', { required: true })} />
                        {errors.messageListVisibility && <span>This field is required</span>}
                    </LabelFormItem>
                    <LabelFormItem>
                        <FormItemTitle>Label List Visibility</FormItemTitle>
                        <input {...register('labelListVisibility', { required: true })} />
                        {errors.labelListVisibility && <span>This field is required</span>}
                    </LabelFormItem>
                    <LabelFormItem>
                        <FormItemTitle>Text Color</FormItemTitle>
                        <input {...register('textColor')} />
                    </LabelFormItem>
                    <LabelFormItem>
                        <FormItemTitle>Background Color</FormItemTitle>
                        <input {...register('backgroundColor')} />
                    </LabelFormItem>
                </Stack>
            </Box>

            <br />
            {/* TODO: disable submit button if there are any errors in the form input */}
            <button
                type="submit"
                disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
            </button>

            {saveError &&
                <>
                    <br /><h4 style={{ color: 'red', textAlign: 'center' }}>{saveError}</h4>
                </>}
        </form>
    );
}
