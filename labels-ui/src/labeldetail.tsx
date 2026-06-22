import { useParams } from "react-router";
import { type LabelData } from "./labeldata";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useQuery,  QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

export function LabelDetailView({ id, name, color, messageListVisibility, labelListVisibility}: LabelData) {
 
    return (
        <>
            <h1>Label Detail View</h1>
            <Box>
                { (!color || color === undefined) ? <Button
                        variant="outlined"
                        size="large"
                        disabled
                        style={{ color: "black", backgroundColor: "white" }}
                        >{name}</Button> 
                    : <Button 
                        variant="contained"
                        size="large"
                        disabled
                        style={{ color: color.textColor, backgroundColor: color.backgroundColor }}
                        >{name}</Button> 
                }
                <div>
                    <pre>{JSON.stringify({ id, name, color, messageListVisibility, labelListVisibility })}</pre>
                </div>
            </Box>
        </>
        
    )
}
 
function LabelDetail() {
    
    let params = useParams(); 
    // const labelId: string = 'Label_6';
    const { isLoading, error, data  } = useQuery({
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