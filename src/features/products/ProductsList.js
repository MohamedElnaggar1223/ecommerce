import React, { useState } from 'react'
import { useGetProductsQuery } from './productsApiSlice'
import Product from './Product'
import ClipLoader from 'react-spinners/ClipLoader'
import useAuth from '../../hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp, faFilter } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'

export default function ProductsList() 
{
    const { id: userId } = useAuth()
    const [filter, setFilter] = useState(false)
    const [categories, setCategories] = useState(false)
    const 
    {
        data: products,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetProductsQuery('productsList', 
    {
        pollingInterval: 12000000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    })

    let content
    if(isLoading) content = <ClipLoader />
    else if(isSuccess)
    {
        const { ids } = products
        const displayedProducts = ids.map(id => <Product key={id} userId={userId} product={id} />)
        content = (
            <div className='ProductsContainer'>
                <div className='ProductsFiltersContainer'>
                    <motion.div transition={{ duration: '0.05' }} animate={filter ? {width: ['10%', '40%', '60%', '80%', '100%']} : {width: ['100%', '80%', '60%', '40%', '10%']}} className={filter ? 'ProductsFilters after' : 'ProductsFilters'} >
                        { filter &&
                            <div className='Categories'>
                                <div 
                                    onClick={() => setCategories(prev => !prev)} 
                                    className='CategoriesMenu'
                                >
                                        Categories <FontAwesomeIcon icon={categories ? faAngleDown : faAngleUp } rotation={180} />
                                </div>
                                <motion.div transition={{ duration: '0.25' }} animate={categories ? {opacity: [0, 1]} : {opacity: [1, 0]}} className='CategoriesList'>
                                    <div className='Category'>Category1</div>
                                    <div className='Category'>Category2</div>
                                    <div className='Category'>Category3</div>
                                    <div className='Category'>Category4</div>
                                </motion.div>
                            </div>
                        }
                    </motion.div>
                    <motion.div className='ProductsFilterButton'>
                        <button
                            onClick={() => setFilter(prev => !prev)}
                            name='menu'
                        >
                            <FontAwesomeIcon icon={filter ? faAngleDown : faAngleUp } rotation={90} />
                        </button>
                    </motion.div>
                </div>
                <div className='ProductsList'>
                    {displayedProducts}
                </div>
            </div>
        )
    }
    //@ts-ignore
    else if(isError) content = <p>{error?.data?.message}</p>

    return content
}
