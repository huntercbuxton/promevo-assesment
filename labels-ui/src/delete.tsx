import { useState } from 'react';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useQueryClient,
     useMutation
} from '@tanstack/react-query'
import { useForm } from 'react-hook-form';
import { DataGrid, type GridColDef, type GridRenderCellParams, type GridRowParams } from '@mui/x-data-grid';
import { type LabelData } from './labeldata.ts';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const queryClient = new QueryClient()

const columns: GridColDef<LabelData>[] = [
    {
        field: 'name',
        headerName: 'Name',
        width: 200,
        renderCell: (params: GridRenderCellParams<LabelData>) => {
            // console.log(`in renderCell, params type is '${typeof params}'`)
            // console.log(`in renderCell, params value is `, params) 
            if (params.row.color === undefined) {
                return <Button
                    variant="outlined"
                    size="large"
                    disabled
                    style={{ color: "black", backgroundColor: "white" }}
                >{params.row.name}</Button>
            } else {
                return <Button variant="contained"
                    size="large"
                    disabled
                    style={{ color: params.row.color.textColor, backgroundColor: params.row.color.backgroundColor }}
                >{params.row.name}</Button>
            }
        }
    },
    {
        field: 'id',
        headerName: 'ID',
        width: 90
    },
    {
        field: 'type',
        headerName: 'Type',
        width: 50
    }
];


export function LabelSelectionGrid({ onRowClick, rows_data }: { onRowClick: (id: string) => void, rows_data: LabelData[] }) {

    console.log(`rows data: ${JSON.stringify(rows_data)}`)
    console.log(`columns data: ${JSON.stringify(columns)}`)

    const handleRowClick = (params: GridRowParams) => {
        console.log(`called handleRowClick with params = ${JSON.stringify(params)}`)
        // Navigate to a specific path using the row's ID
        // navigate(`/delete/${params.row.id}`);
        onRowClick(`${params.id}`)
    };

    return (
        <Box sx={{ minHeight: 400, width: '100%' }}>
            <DataGrid
                rows={rows_data}
                columns={columns}
                getRowHeight={() => 'auto'}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 20]}
                onRowClick={handleRowClick}
                disableRowSelectionOnClick
            />
        </Box>
    );
}

// function LabelSelector() {

//   const { isLoading, error, data } = useQuery({
//     queryKey: ['deletableList'],
//     queryFn: () =>
//       fetch('http://localhost:8080/list').then((res) =>
//         res.json(),
//       ),
//   })

//   if (isLoading) return 'Loading...'

//   if (error) return 'An error has occurred: ' + error.message

//   return (
//     <div>
//       <h1>Delete Labels</h1>
//       <LabelSelectionGrid rows_data={data} />
//     </div>
//   )
// }

interface DeleteFormData {
    id: string;
}

const deleteLabel = async (labelId: string): Promise<void> => {
    await fetch(`http://localhost:8080/${labelId}`, {
        method: 'DELETE'
    });
};

export function DeleteLabelForm() { //{ labelId }: { labelId: string }
    
    const queryClient = useQueryClient();
    
    // TODO: filter out labels that have type 'system'
    const { isLoading, error, data } = useQuery({
        queryKey: ['deletableList'],
        queryFn: () =>
            fetch('http://localhost:8080/list').then((res) =>
                res.json(),
            ),
    })

    const [selectedId, setSelectedId] = useState('');

    const onRowClick = (id: string) => {
        if (id === selectedId) {
            setSelectedId('')
        } else {
            setSelectedId(id)
        }
    }

    // 2. Initialize React Hook Form with reactive "values"
    const {  
        handleSubmit,
        formState: { errors } } = useForm<DeleteFormData>({
            // 'values' replaces 'defaultValues' for data streams like useQuery 
            values: { id: selectedId },
        });

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteLabel(selectedId),
        onSuccess: () => {
            // Invalidate the cache to trigger a fresh background refresh
            setSelectedId('')
            queryClient.invalidateQueries({ queryKey: ['deletableList'] });
        },
    });

    if (isLoading) return 'Loading...' 
    if (error) return 'An error has occurred: ' + error.message

    return (
        <>
            <div>
                <h1>Delete Labels</h1>
                <LabelSelectionGrid onRowClick={onRowClick} rows_data={data} />
            </div>
            <form onSubmit={handleSubmit((values) => mutate(values))}> 
                {/* TODO: disable submit button if there are any errors in the form input */}
                <button
                    type="submit"
                    disabled={isPending || !selectedId}>
                    {isPending ? 'Deleting...' : 'Delete Selected'}
                </button> 
            </form>
        </> 
    );
}

export default function DeletePage() {
    return (
        <QueryClientProvider client={queryClient}>
            <DeleteLabelForm />
        </QueryClientProvider>
    )
}

