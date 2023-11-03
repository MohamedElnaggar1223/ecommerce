import React, { memo, useState } from 'react'
import { useGetCategoryQuery } from './categoryApiSlice'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Icons } from '../../components/Icons'

function Category({ userId, category, select }) 
{
    const [clicked, setClicked] = useState(false)

    const 
    {  
        data: categoryData,
        isLoading
    } = useGetCategoryQuery({ id: category })

    if(isLoading) return <p>Loading</p>

    function addCategory()
    {
        setClicked(prev => !prev)
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
        <div onClick={addCategory} className='Category'>
            {clicked && <FontAwesomeIcon style={{ transition: 'all 0.5s', width: '5%', justifySelf: 'center', alignSelf: 'center', marginBottom: '4%', marginRight: '4%' }} icon={faXmark} />}
            <div className='CategoryIcon'>
                {Icons[categoryData?.category]}
            </div>
            <div className='CategoryName'>
                {categoryData?.category}
            </div>
        </div>
    )
}

const memoizedCategory = memo(Category)
export default memoizedCategory
