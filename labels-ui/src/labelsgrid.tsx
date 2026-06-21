import * as React from 'react';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { mock_labels_data_list, type LabelData } from './labeldata';


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
    field: 'color',
    headerName: 'Color',
    width: 200,
    valueGetter: (value, row, column) => `Background: ${row.color?.backgroundColor === undefined || !(row.color?.backgroundColor) ? 'default' : row.color?.backgroundColor} Text: ${row.color?.textColor === undefined || !(row.color?.textColor) ? 'default' : row.color?.textColor}`
  },
  {
    field: 'labelListVisibility',
    headerName: 'Label List Visibility',
    width: 110,
    // editable: true,
  },
  {
    field: 'messageListVisibility',
    headerName: 'Message List Visibility',
    width: 110,
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

interface LabelsDataGridProps {
  rows_data: LabelData[]
}

export default function LabelsDataGrid({ rows_data }: LabelsDataGridProps) {

  console.log(`rows data: ${JSON.stringify(rows_data)}`)
  console.log(`columns data: ${JSON.stringify(columns)}`)

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
        // checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}


export function MockLabelsDataGrid() {
  return <LabelsDataGrid rows_data={mock_labels_data_list} />
};