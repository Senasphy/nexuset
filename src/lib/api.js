import {useQuery} from '@tanstack/react-query'; 

async function fetchQuestions (url, category, limit) {
  const params = new URLSearchParams()
  if (limit) params.set("limit", String(limit))
  const query = params.toString()
  const endpoint = `${url}/${encodeURIComponent(category)}${query ? `?${query}` : ""}`
  const result  = await fetch(endpoint)
  if (!result.ok) throw new Error("Failed to fetch questions")
  const data = await result.json()
  return data
}


export default function useQuestions(category, limit){
    const backendUrl = "https://vercel-backend-tau-sage.vercel.app/api"
    return useQuery({
        queryKey: ['questions', category, limit],
        queryFn: () => fetchQuestions(backendUrl, category, limit),
        staleTime: 60 * 1000,
        enabled: !!category && !!limit,

    })
}
