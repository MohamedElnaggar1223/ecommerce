import React, { useCallback, useEffect, useState } from 'react'
import { useGetProductsQuery } from './productsApiSlice'
import Product from './Product'
import ClipLoader from 'react-spinners/ClipLoader'
import useAuth from '../../hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import { useGetCategoriesQuery } from '../category/categoryApiSlice'
import Category from '../category/Category'

export default function ProductsList() 
{
    const { id: userId } = useAuth()
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
        let max = 0
        let min = 99999999999
        if(products?.ids && products?.entities)
        {
            const { ids, entities } = products
            ids.forEach(id => 
                {
                    if(Math.floor(entities[id].price) > max) max = Math.floor(entities[id].price)
                    if(Math.floor(entities[id].price) < min) min = Math.floor(entities[id].price)
                })
        }

        setMaxPrice(max)
        setMinPrice(min)
        setPrice(min)
    }, [products])

    useEffect(() => 
    {
        let min = 99999999999
        selectedProducts.forEach(prod => 
        {
            //@ts-ignore
            if(Math.floor(prod.price) < min) min = Math.floor(prod.price)
        })
        
        setMinPrice(min)
        if(price < min) setPrice(min)
    }, [price, selectedProducts])

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
                const array = ids?.map(id => entities[id])
                setSelectedProducts(array)
            }
        }
        
    }, [selectedCategories, products])

    const handlePriceChange = useCallback(() =>
    {
        const { ids, entities } = products
        const prods = ids.map(id => entities[id])
        const array = [...prods]
        const filteredArray = array.filter(prod => parseInt(prod.price) <= price)
        if(selectedCategories.length !== 0)
        {
            //@ts-ignore
            const finalArray = filteredArray.filter(prod => selectedCategories?.includes(prod.category))
            //@ts-ignore
            setSelectedProducts(finalArray)
        }
        else
        {
            //@ts-ignore
            setSelectedProducts(filteredArray)
        }
    }, [price, products, selectedCategories])

    let content
    if(isLoading || isLoadingCats) content = <ClipLoader />
    else if(isSuccess && isSuccessCats)
    {
        const { entities } = products
        const { ids: catsIds } = cats

        // const displayedProducts = ids.map(id => 
        //     {
        //         if(selectedCategories.length !== 0)
        //         {
        //             //@ts-ignore
        //             if (selectedCategories.includes(entities[id].category)) 
        //             {
        //                 return <Product key={id} selectedCategories={selectedCategories} userId={userId} product={entities[id]} />
        //             }
        //         }
        //         else 
        //         {
        //             return <Product key={id} selectedCategories={selectedCategories} userId={userId} product={entities[id]} />
        //         }
        //     })

        //@ts-ignore
        const displayedProducts = selectedProducts.map(prod => <Product key={prod._id} selectedCategories={selectedCategories} userId={userId} product={entities[prod._id]} />)

        const displayedCategories = catsIds.map(id => <Category key={id} userId={userId} category={id} select={setSelectedCategories} />)
        //console.log(selectedCategories)
        content = (
            // <div className='ProductsContainer'>
            //     <div className='ProductsFiltersContainer'>
            //         <div className={'ProductsFilters'} >
            //                 <div className='Categories'>
            //                     <div 
            //                         onClick={() => setCategories(prev => !prev)} 
            //                         className='CategoriesMenu'
            //                     >
            //                             Categories <FontAwesomeIcon icon={categories ? faAngleDown : faAngleUp } rotation={180} />
            //                     </div>
            //                     <motion.div transition={{ duration: '0.5' }} animate={categories ? {height: ['0vh', `${catsIds.length * 5}vh`]} : {height: [`${catsIds.length * 5}vh`, '0vh']}} className='CategoriesList'>
            //                         {displayedCategories}
            //                     </motion.div>
            //                 </div>
            //                 <motion.div className='PriceFilterContainer'>
            //                     <label>Price: ${price}</label>
            //                     <input type='range' min={minPrice} max={maxPrice} value={price} onChange={(e) => setPrice(parseInt(e.target.value))} onMouseUp={handlePriceChange} />
            //                 </motion.div>
            //         </div>
            //     </div>

            //     {displayedProducts}
            // </div>

            <div className='MainContainer'>
                <div className='SideMenuContainer'>
                    <div className='CategoriesContainer'>
                        {displayedCategories}
                    </div>
                    <div className='PriceContainer'>
                        <label>Price: ${price}</label>
                        <input type='range' min={minPrice} max={maxPrice} value={price} onChange={(e) => setPrice(parseInt(e.target.value))} onMouseUp={handlePriceChange} />
                    </div>
                </div>
                <div className='ProductsContainer'>
                    {displayedProducts}
                </div>
            </div>
        )
    }
    //@ts-ignore
    else if(isError) content = <p>{error?.data?.message}</p>

    return content
}
