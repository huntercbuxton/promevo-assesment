import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { type LabelData } from "./labeldata";

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function LabelDataRow({ title, data }) {
    return <TableRow>
                <TableCell component="th" scope="row">{title}</TableCell>
                <TableCell align="left">{data}</TableCell>
            </TableRow>
}

export default function LabelDataTable({ id, name, color, type, messageListVisibility, labelListVisibility }: LabelData) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell align="left">Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <LabelDataRow title={'ID'} data={id} />
                    <LabelDataRow title={'Name'} data={name} />
                    <LabelDataRow title={'type'} data={type} />
                    {color?.textColor && <LabelDataRow title={'text color'} data={color.textColor} />}
                    {color?.backgroundColor && <LabelDataRow title={'background color'} data={color.backgroundColor} />} 
                    <LabelDataRow title={'Message List Visibility'} data={messageListVisibility} />
                    <LabelDataRow title={'Label List Visibility'} data={labelListVisibility} />  
                </TableBody>
            </Table>
        </TableContainer>
    );
}