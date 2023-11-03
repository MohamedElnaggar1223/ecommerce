import React, { useCallback, useEffect, useState } from 'react'
import { useGetProductsQuery } from './productsApiSlice'
import Product from './Product'
import OutofStockProd from './OutofStockProd'
import ClipLoader from 'react-spinners/ClipLoader'
import useAuth from '../../hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import { useGetCategoriesQuery } from '../category/categoryApiSlice'
import Category from '../category/Category'

export default function ProductsList() 
{
    const { id: userId } = useAuth()
    const [categories, setCategories] = useState(false)
    const [showStock, setShowStock] = useState(true)
    const [sort, setSort] = useState('')
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
            setShowStock(true)
            //@ts-ignore
            const finalArray = filteredArray.filter(prod => selectedCategories?.includes(prod.category))
            if(sort === 'Newest') finalArray.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            else if(sort === 'Oldest') finalArray.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
            else if(sort === 'HighestPrice') finalArray.sort((a, b) => b.price === a.price ? 0 : b.price > a.price ? 1 : -1)
            else if(sort === 'LowestPrice') finalArray.sort((a, b) => a.price === b.price ? 0 : a.price > b.price ? 1 : -1)
            else if(sort === 'AtoZ') finalArray.sort((a, b) => a.title === b.title ? 0 : a.title > b.title ? 1 : -1)
            else if(sort === 'ZtoA') finalArray.sort((a, b) => b.title === a.title ? 0 : b.title > a.title ? 1 : -1)
            else if(sort === 'InStock') setShowStock(false)
            //@ts-ignore
            setSelectedProducts(finalArray)
        }
        else
        {
            setShowStock(true)
            if(sort === 'Newest') filteredArray.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            else if(sort === 'Oldest') filteredArray.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
            else if(sort === 'HighestPrice') filteredArray.sort((a, b) => b.price === a.price ? 0 : b.price > a.price ? 1 : -1)
            else if(sort === 'LowestPrice') filteredArray.sort((a, b) => a.price === b.price ? 0 : a.price > b.price ? 1 : -1)
            else if(sort === 'AtoZ') filteredArray.sort((a, b) => a.title === b.title ? 0 : a.title > b.title ? 1 : -1)
            else if(sort === 'ZtoA') filteredArray.sort((a, b) => b.title === a.title ? 0 : b.title > a.title ? 1 : -1)
            else if(sort === 'InStock') setShowStock(false)
            //@ts-ignore
            setSelectedProducts(filteredArray)
        }
    }, [price, products, selectedCategories, sort])

    function handleSort(e)
    {
        setSort(e.target.value)
        setShowStock(true)
        const array = [...selectedProducts]
        if(e.target.value === 'Newest') array.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        else if(e.target.value === 'Oldest') array.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        else if(e.target.value === 'HighestPrice') array.sort((a, b) => b.price === a.price ? 0 : b.price > a.price ? 1 : -1)
        else if(e.target.value === 'LowestPrice') array.sort((a, b) => a.price === b.price ? 0 : a.price > b.price ? 1 : -1)
        else if(e.target.value === 'AtoZ') array.sort((a, b) => a.title === b.title ? 0 : a.title > b.title ? 1 : -1)
        else if(e.target.value === 'ZtoA') array.sort((a, b) => b.title === a.title ? 0 : b.title > a.title ? 1 : -1)
        else if(e.target.value === 'InStock') setShowStock(false)
        //@ts-ignore
        setSelectedProducts(array)
    }

    let content
    if(isLoading || isLoadingCats) content = <ClipLoader />
    else if(isSuccess && isSuccessCats)
    {
        const { entities } = products
        const { ids: catsIds } = cats

        const displayedProducts = selectedProducts.map(prod =>
            //@ts-ignore 
            prod.available 
            ?
                //@ts-ignore
                <Product key={prod._id} selectedCategories={selectedCategories} userId={userId} product={entities[prod._id]} />
            :
                //@ts-ignore
                showStock && <OutofStockProd key={prod._id} selectedCategories={selectedCategories} userId={userId} product={entities[prod._id]} />
        )

        const displayedCategories = catsIds.map(id => <Category key={id} userId={userId} category={id} select={setSelectedCategories} />)

        content = (
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
                    <div className='SortByContainer'>
                        <label htmlFor='Sort'>Sort By:</label>
                        <select id='Sort' onChange={handleSort}>
                            <option className='SortChild' value='Newest'>Newest</option>
                            <option className='SortChild' value='Oldest'>Oldest</option>
                            <option className='SortChild' value='HighestPrice'>Highest Price</option>
                            <option className='SortChild' value='LowestPrice'>Lowest Price</option>
                            <option className='SortChild' value='AtoZ'>A ~ Z</option>
                            <option className='SortChild' value='ZtoA'>Z ~ A</option>
                            <option className='SortChild' value='InStock'>In Stock</option>
                        </select>
                    </div>
                    <div className='Products'>
                        {displayedProducts}
                    </div>
                </div>
            </div>
        )
    }
    //@ts-ignore
    else if(isError) content = <p>{error?.data?.message}</p>

    return content
}
