import React, { useEffect, useState } from 'react'
import { useGetProductsQuery } from './productsApiSlice'
import Product from './Product'
import ClipLoader from 'react-spinners/ClipLoader'
import useAuth from '../../hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp, faFilter } from '@fortawesome/free-solid-svg-icons'
import { AnimatePresence, motion } from 'framer-motion'
import { useGetCategoriesQuery } from '../category/categoryApiSlice'
import Category from '../category/Category'

export default function ProductsList() 
{
    const { id: userId } = useAuth()
    const [filter, setFilter] = useState(false)
    const [categories, setCategories] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])

    const [minPrice, setMinPrice] = useState(0)
    const [price, setPrice] = useState(minPrice)
    const [maxPrice, setMaxPrice] = useState(0)

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

    const 
    {
        data: cats,
        isLoading: isLoadingCats,
        isSuccess: isSuccessCats
    } = useGetCategoriesQuery('categoriesList', 
    {
        pollingInterval: 12000000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    })

    useEffect(() => 
    {
        let min = 99999999999
        let max = 0
        selectedProducts.forEach(prod => 
        {
            //@ts-ignore
            if(Math.floor(prod.price) > max) max = Math.floor(prod.price)
            //@ts-ignore
            if(Math.floor(prod.price) < min) min = Math.floor(prod.price)

            //@ts-ignore
            console.log(prod.price)
        })
        setMaxPrice(max)
        setMinPrice(min)
        setPrice(min)
    }, [selectedProducts])

    // useEffect(() => 
    // {
    //     if(isSuccess)
    //     {
    //         const { ids: catsIds } = cats
    //         setSelectedCategories(catsIds)
    //     }
    // }, [isSuccess, cats])

    useEffect(() => 
    {
        if(products?.ids && products?.entities)
        {
            const { ids, entities } = products

            if(selectedCategories.length !== 0)
            {
                //@ts-ignore
                const array = ids.filter(id => selectedCategories.includes(entities[id].category))
                const filteredArray = array.map(id => entities[id])
                setSelectedProducts(filteredArray)
            }
            else
            {
                const array = ids.map(id => entities[id])
                setSelectedProducts(array)
            }
        }
        
    }, [selectedCategories, products])

    let content
    if(isLoading || isLoadingCats) content = <ClipLoader />
    else if(isSuccess && isSuccessCats)
    {
        const { ids, entities } = products
        const { ids: catsIds } = cats

        const displayedProducts = ids.map(id => 
            {
                if(selectedCategories.length !== 0)
                {
                    //@ts-ignore
                    if (selectedCategories.includes(entities[id].category)) 
                    {
                        return <Product key={id} selectedCategories={selectedCategories} userId={userId} product={entities[id]} />
                    }
                }
                else 
                {
                    return <Product key={id} selectedCategories={selectedCategories} userId={userId} product={entities[id]} />
                }
            })
        const displayedCategories = catsIds.map(id => <Category key={id} userId={userId} category={id} select={setSelectedCategories} />)
        //console.log(selectedCategories)
        content = (
            <div className='ProductsContainer'>
                <div className='ProductsFiltersContainer'>
                    <motion.div transition={{ duration: '0.05' }} animate={filter ? {width: ['10%', '40%', '60%', '80%', '100%']} : {width: ['100%', '80%', '60%', '40%', '10%']}} className={'ProductsFilters'} >
                        { filter &&
                            <div className='Categories'>
                                <div 
                                    onClick={() => setCategories(prev => !prev)} 
                                    className='CategoriesMenu'
                                >
                                        Categories <FontAwesomeIcon icon={categories ? faAngleDown : faAngleUp } rotation={180} />
                                </div>
                                <motion.div transition={{ duration: '0.5' }} animate={categories ? {height: ['0vh', `${catsIds.length * 5}vh`]} : {height: [`${catsIds.length * 5}vh`, '0vh']}} className='CategoriesList'>
                                    {displayedCategories}
                                </motion.div>
                            </div>
                        }
                        { filter &&
                            <motion.div className='PriceFilterContainer'>
                                <label>Price: ${price}</label>
                                <input type='range' min={minPrice} max={maxPrice} value={price} onChange={(e) => setPrice(parseInt(e.target.value))} />
                            </motion.div>
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
                <motion.div transition={{ duration: 0.8 }} animate={filter ? {width: ['100%', '80%']} : {width: ['80%', '100%']}} className='ProductsList'>
                    {displayedProducts}
                </motion.div>
            </div>
        )
    }
    //@ts-ignore
    else if(isError) content = <p>{error?.data?.message}</p>

    return content
}
