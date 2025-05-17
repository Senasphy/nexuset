import Link from 'next/link'
const CategoryCard = ({category}) => {
  return ( 
    <Link href={`/categories/${category.name.toLowerCase()}`} style={{'textDecoration' : 'none'}}>
    <div className= {`rounded-3xl shadow-md flex gap-2 flex-col bg-[${category.background}] 
                px-4 py-6 hover:opacity-75 hover:cursor-pointer text-lg my-2 mx-4`  }
                
                onClick = {()=>{}}
                >
               <div className="flex gap-2 items-center ">
               {/*  The logo of each */}
               <div className="flex w-full justify-between font-bold">
               <p>{category.name}</p>
               <span className="bg-white px-3 text-[14px] rounded-full shadow-md">
               ⭐ {4.8}
                </span>   </div>            </div>
               <p>{category.description}</p>
               
              <p className="text-sm ">High Score: {45}</p>
               
                </div>
                </Link>
                
  )
}

export default CategoryCard