import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import { useNavigate } from 'react-router-dom';
import { type LabelData } from "./labeldata";
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import { useQuery, QueryClient, QueryClientProvider, useQueryClient, useMutation } from '@tanstack/react-query';
import LabelBtn from "./template";
import Button from '@mui/material/Button'; 
import Container from '@mui/material/Container';
import LabelDataTable from './label_data_table';
import UpdateLabelForm from './label_data_editor';
import './labeldetail.css'

import { delete_label_command } from './api_util.ts'

const queryClient = new QueryClient()

interface DeleteBtnFormData {
    id: string;
}

interface DeleteLabelBtnProps extends DeleteBtnFormData {
    // onDelete: ()=>void;
    onDeleteErr: (err: string)=>void;
}

export function DeleteLabelBtn({id,  onDeleteErr }: DeleteLabelBtnProps) { //{ labelId }: { labelId: string }

    const navigate = useNavigate();
    const navigateToListPage = () => navigate(`/list`);

    const queryClient = useQueryClient();
 

    // 2. Initialize React Hook Form with reactive "values"
    const {
        handleSubmit,
        formState: { errors } } = useForm<DeleteBtnFormData>({
            // 'values' replaces 'defaultValues' for data streams like useQuery 
            values: { id: id },
        });

    const { mutate, isPending } = useMutation({
        mutationFn: () => delete_label_command(id),
        onSuccess: () => {
            // Invalidate the cache to trigger a fresh background refresh 
            queryClient.invalidateQueries({ queryKey: ['labelListData'] });
            navigateToListPage();
        },
        onError: (error, variables, context) => {
            console.error(`Delete mutation failed for ${id}:`, error.message);
            onDeleteErr(`Error while saving changes: ${error}`)
        }
    });
 
    return (
        <>
            <form  onSubmit={handleSubmit((values) => mutate(values))}>
                {/* TODO: disable submit button if there are any errors in the form input */}
                <Button
                    type="submit"
                    disabled={isPending || !id}>
                    {isPending ? 'Deleting...' : 'Delete'}
                </Button>
            </form>
        </>
    );
}

export function LabelDetailView({ id, name, color, type, messageListVisibility, labelListVisibility }: LabelData) {

    const navigate = useNavigate();
    const navigateToListPage = () => navigate(`/list`);

    const [showEditor, setShowEditor] = useState(false);


    const handleEditBtnClick = () => {
        if (!showEditor) setShowEditor(true);
    }

    const handleDeleteBtnClick = () => { 
  
    }

    
    const onSave = () => setShowEditor(false);
    

    return (
        <>
            <header id='label-detail-header'>
                <Button onClick={navigateToListPage}>Back</Button>
                <Button onClick={handleEditBtnClick} disabled={showEditor}>Edit</Button>
                {type === 'user' && <DeleteLabelBtn id={id} onDeleteErr={handleDeleteBtnClick}/>  }
            </header>
            <Container>
                {color ? <LabelBtn id={id} name={name} color={color} />
                    : <LabelBtn id={id} name={name} />}
            </Container>
            <br/>
           <Container>
                {showEditor ? <UpdateLabelForm 
                        labelData={{ id, name, color, type, messageListVisibility, labelListVisibility }}
                        onSave={onSave} />
                    : <LabelDataTable 
                        id={id} 
                        name={name} 
                        color={color} 
                        type={type} 
                        messageListVisibility={messageListVisibility} 
                        labelListVisibility={labelListVisibility} /> } 
           </Container>
           {/* <Container> <pre>{JSON.stringify({ id, name, color, messageListVisibility, labelListVisibility })}</pre> </Container> */}
        </>

    )
}

function LabelDetail() {

    let params = useParams();
    // const labelId: string = 'Label_6';
    const { isLoading, error, data } = useQuery({
        queryKey: ['labelDetailData'],
        queryFn: async () => {
            return fetch(`http://localhost:8080/${params['id']}`).then((res) =>
                res.json(),
            )
        },
    })

    if (isLoading) return <div>Loading label data...</div>;

    // TODO: this does not handle 404's from backend, it shows a blank label and empty colors obj
    if (error) return <div>{'An error has occurred: ' + error.message}</div>

    return (
        <LabelDetailView
            id={data.id}
            name={data.name}
            type={data.type || null}
            color={data.color || null}
            messageListVisibility={data.messageListVisibility}
            labelListVisibility={data.labelListVisibility} />
    )
}

export default function LabelDetailPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <LabelDetail />
        </QueryClientProvider>
    )
}