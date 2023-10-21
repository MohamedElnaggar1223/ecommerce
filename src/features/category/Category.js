import React, { memo } from 'react'
import { useGetCategoryQuery } from './categoryApiSlice'

function Category({ userId, category, select }) 
{
    const 
    {  
        data: categoryData,
        isLoading
    } = useGetCategoryQuery({ id: category })

    if(isLoading) return <p>Loading</p>

    function addCategory()
    {
        select(prev => 
            {
                if(prev.includes(category))
                {
                    const array = prev.filter(cat => cat !== category)
                    console.log(array)
                    return array
                }
                else
                {
                    const array = prev.map(cat => cat)
                    array.push(category)
                    console.log(array)
                    return array
                }
            })
    }

    return (
        <div className='Category'>
            <input onChange={addCategory} type='checkbox' value={categoryData?._id} />
            <div>{categoryData?.category}</div>
        </div>
    )
}

const memoizedCategory = memo(Category)
export default memoizedCategory
