import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

const queryClient = new QueryClient()


export default function LabelsList() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <Example /> */}
      <ListLabelsPage/>
    </QueryClientProvider>
  )
}


function Example() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then((res) =>
        res.json(),
      ),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}

function ListLabelsPage() {
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
      <h1>All Labels</h1>
      <ul>
        {data.map((l,i) => <li key={i}><pre>{JSON.stringify(l)}</pre></li>) }
      </ul>
    </div>
  )
}