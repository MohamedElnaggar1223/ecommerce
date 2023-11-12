import React, { memo, useState } from 'react'
import { useGetCategoryQuery } from './categoryApiSlice'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Icons } from '../../components/Icons'
import { Stack, Typography } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';

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
        <Stack
            direction='row'
            gap={2.5}
            alignItems='center'
            height= 'fit-content'
            flex={1}
            onClick={addCategory}
            sx={{
                cursor: 'pointer'
            }}
        >
            {clicked && <ClearIcon />}
            {Icons[categoryData?.category]}
            <Typography
                fontSize={20}
                fontWeight={500}
                fontFamily='Poppins'
                textAlign='left'
                noWrap
            >
                {categoryData?.category}
            </Typography>
        </Stack>
    )
}

const memoizedCategory = memo(Category)
export default memoizedCategory
