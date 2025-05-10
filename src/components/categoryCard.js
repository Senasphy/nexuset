import Link from 'next/link'

const CategoryCard = ({category}) => {
  return (<Link href = {`${category.name.toLowerCase}`} style = {{textDecoration: 'none'}}>
    <div className="rounded-2xl shadow-md flex gap-2 flex-col bg-[#F3C5C5] 
                p-4 hover:opacity-75 hover:cursor-pointer "  onClick = {()=>{
                  setSelectedCategory(category.name.toLowerCase())
                }
                }
                >
               <div className="flex gap-2 items-center">
               <LayoutGrid size = {18}/>
               <div className="flex w-full justify-between ">
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