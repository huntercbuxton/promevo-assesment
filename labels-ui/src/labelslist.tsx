import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import LabelsDataGrid from './labelsgrid'

const queryClient = new QueryClient()
 
function LabelsList() {

  // TODO: verify, is it isPending or isLoading?
  const { isPending, error, data } = useQuery({
    queryKey: ['labelListData'],
    queryFn: () =>
      fetch('http://localhost:8080/list').then((res) =>
        res.json(),
      ),
  })

  if (isPending) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>Labels</h1>
      <LabelsDataGrid rows_data={data} />
    </div>
  )
}

export default function LabelsListPage() {
  return (
    <QueryClientProvider client={queryClient}> 
      <LabelsList />
    </QueryClientProvider>
  )
}

