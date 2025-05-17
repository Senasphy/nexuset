import {useQuery} from '@tanstack/react-query'; 

export default function useQuestions(category){
    return useQuery({
        queryKey: ['questions', category],
        queryFn: async() =>{
            const result = await fetch(`https://vercel-backend-tau-sage.vercel.app/api/${category}`);
            if (!result.ok) throw new Error("Failed to fetch questions")
            const data = await result.json()
         
            return data
           
        }, 
        enabled: !!category,

    })
}