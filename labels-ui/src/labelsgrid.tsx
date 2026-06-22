import { DataGrid, type GridColDef, type GridRenderCellParams, type GridRowParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { mock_labels_data_list, type LabelData } from './labeldata';
import { useNavigate } from 'react-router-dom';
import LabelBtn from './template'

const columns: GridColDef<LabelData>[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 350,
    renderCell: (params: GridRenderCellParams<LabelData>) => params.row.color ? 
          <LabelBtn  id={params.row.id} name={params.row.name}  color={params.row.color} /> 
            : <LabelBtn  id={params.row.id}  name={params.row.name}  /> 
  },
  {
    field: 'messages',
    headerName: 'Messages',
    width: 150,
    valueGetter: (value, row, column) => `Total: ${row.messagesTotal === undefined || !(row.messagesTotal) ? '0' : row.messagesTotal} Unread: ${row.messagesUnread === undefined || !(row.messagesUnread) ? '0' : row.messagesUnread}`
  },
  {
    field: 'threads',
    headerName: 'Threads',
    width: 150,
    valueGetter: (value, row, column) => `Total: ${row.threadsTotal === undefined || !(row.threadsTotal) ? '0' : row.messagesTotal} Unread: ${row.threadsUnread === undefined || !(row.threadsUnread) ? '0' : row.threadsUnread}`
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 100
  },
  {
    field: 'id',
    headerName: 'ID',
    width: 250
  }
];

interface LabelsDataGridProps {
  rows_data: LabelData[]
}

export default function LabelsDataGrid({ rows_data }: LabelsDataGridProps ) {

  console.log(`rows data: ${JSON.stringify(rows_data)}`)
  console.log(`columns data: ${JSON.stringify(columns)}`)

  const navigate = useNavigate();
 
  const handleRowClick = (params: GridRowParams) => { 
    navigate(`/labels/${params.row.id}`);
  };

  return (
    <Box
      id='labels-datagrid-box'
      sx={{ minHeight: 400, width: '100%' }}>
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
        // checkboxSelection
        onRowClick={handleRowClick}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
 