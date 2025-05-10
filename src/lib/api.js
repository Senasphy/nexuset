export default function useQuestions(category){
    return useQuery({
        queryKey: ['questions', category],
        queryFn: async() =>{
            const result = await fetch();
            if (!result.ok) throw new Error("Failed to fetch questions")
            return result.json()
        }, 
        enabled: !!category,

    })
}