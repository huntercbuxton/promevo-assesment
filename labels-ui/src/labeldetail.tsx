import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import { useNavigate } from 'react-router-dom';
import { type LabelData } from "./labeldata";
import Box from '@mui/material/Box';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LabelBtn from "./template";
import Button from '@mui/material/Button'; 
import Container from '@mui/material/Container';
import LabelDataTable from './label_data_table';

const queryClient = new QueryClient()


export function LabelDetailView({ id, name, color, type, messageListVisibility, labelListVisibility }: LabelData) {

    const navigate = useNavigate();

    const [showEditor, setShowEditor] = useState(false);

    const navigateToListPage = () => navigate(`/list`);

    const handleEditBtnClick = () => {
        if (!showEditor) setShowEditor(true);
    }

    const handleDeleteBtnClick = () => { }

    return (
        <>
            <header id='label-detail-header'>
                <Button onClick={navigateToListPage}>Back</Button>
                <Button onClick={handleEditBtnClick} disabled={showEditor}>Edit</Button>
                {type === 'user' && <Button onClick={handleDeleteBtnClick}>Delete</Button> }
            </header>
            <Container>
                {color ? <LabelBtn id={id} name={name} color={color} />
                    : <LabelBtn id={id} name={name} />}
            </Container>
           <Container>
                {showEditor ? <h1>LabelEditor</h1>  
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