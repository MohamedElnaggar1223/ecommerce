import React, { useCallback, useEffect, useState } from 'react'
import { useGetProductsQuery, useUpdateCartMutation } from './productsApiSlice'
import Product from './Product'
import OutofStockProd from './OutofStockProd'
import ClipLoader from 'react-spinners/ClipLoader'
import useAuth from '../../hooks/useAuth'
import { useGetCategoriesQuery } from '../category/categoryApiSlice'
import Category from '../category/Category'
import { Box, Button, Slider, Stack, Typography } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { store } from '../../app/store'
import { customersApiSlice } from '../customers/customersApiSlice'

export default function ProductsList() 
{
    const { id: userId } = useAuth()
    const [categories, setCategories] = useState(false)
    const [showStock, setShowStock] = useState(true)
    const [sort, setSort] = useState('')
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const [productClicked, setProductClicked] = useState({ id: null })
    const [viewedProduct, setViewedProduct] = useState()

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
        setMinPrice(min !== 99999999999 ? min : 0)
        setPrice(min !== 99999999999 ? min : 0)
    }, [products])

    useEffect(() => 
    {
        let min = 99999999999
        selectedProducts.forEach(prod => 
        {
            //@ts-ignore
            if(Math.floor(prod.price) < min) min = Math.floor(prod.price)
        })
        
        setMinPrice(min !== 99999999999 ? min : 0)
        if(price < min) setPrice(min !== 99999999999 ? min : 0)
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

    useEffect(() => 
        {
            if(productClicked.id !== null) 
            {
                const prod = selectedProducts.find(prod => prod.id === productClicked.id)
                const prodWithCounter = { ...prod, count: 1 }
                setViewedProduct(prodWithCounter)
            }
        }, [productClicked])

    const[addToCart, 
        {
            isLoading: addToCartLoading,
        }] = useUpdateCartMutation()

    async function handleAdd()
    {
        setProductClicked({ id: null })
        try
        {
            await addToCart({ id: userId, product: viewedProduct?.id, action: 'add', count: viewedProduct?.count }).unwrap()
            store.dispatch(customersApiSlice.util.invalidateTags([{ type: 'Customer', id: userId }]))
        }
        catch(e)
        {
            console.error(e)
        }
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
                <Product key={prod._id} setProductClicked={setProductClicked} selectedCategories={selectedCategories} userId={userId} product={entities[prod._id]} />
            :
                //@ts-ignore
                showStock && <OutofStockProd key={prod._id} selectedCategories={selectedCategories} userId={userId} product={entities[prod._id]} />
        )

        const displayedCategories = catsIds.map(id => <Category key={id} userId={userId} category={id} select={setSelectedCategories} />)

        content = (
            <Box
                width='100%'
                minHeight='100%'
                height='100%'
                bgcolor='#FBFAF2'
                display='flex'
                flexDirection='row'
                // onClick={() => productClicked.id !== null && setProductClicked({ id: null })}
            >
                <Box
                    width='fit-content'
                    bgcolor='#F8EEEC'
                    height='100%'
                    display='flex'
                    flexDirection='column'
                    padding={3}
                    justifyContent='space-evenly'
                    gap={4}
                >
                    <Stack
                        direction='column'
                        mt={2}
                        mb={1}
                        flex={1}
                        gap={3}
                    >
                        {displayedCategories}
                    </Stack>
                    <Stack
                        alignItems='center'
                        flex={1}
                    >
                        <Typography
                            sx={{
                                fontWeight: 500,
                                margin: "10px 0",
                                fontSize: 20,
                                color: "#11142d",
                                marginLeft: 1,
                                fontFamily: 'Poppins',
                                alignSelf: 'flex-start'
                            }}
                        >
                            Price: ${price}
                        </Typography>
                        {/*//@ts-ignore*/}
                        <Slider onChange={(e) => setPrice(parseInt(e.target.value))} onMouseUp={handlePriceChange} sx={{ color: '#000000', width: '80%' }}  max={maxPrice} min={minPrice} size='small' defaultValue={maxPrice} />
                    </Stack>
                </Box>
                <Box
                    overflow='auto'
                    height='auto'
                    paddingBottom={14}
                >
                    <Stack
                        direction='row'
                        flexWrap='wrap'
                        gap={16}
                        mx={16}
                        my={10}
                        justifyContent={{xs: 'center', md: 'flex-start'}}
                    >
                        {displayedProducts}
                    </Stack>
                </Box>
                {
                    productClicked.id !== null && 
                    <Box
                        position='absolute'
                        width={{ xs: '45vw', lg: '50vw'}}
                        borderRadius= '20px'
                        bgcolor= '#FBFCFA'
                        boxShadow='0px 0px 100vw 100vw rgba(175, 175, 175, 0.6)'
                        minHeight='35vh'
                        top={{ xs: '15%', lg: '25%'}}
                        left='25%'
                        display='flex'
                        maxHeight={{ xs: 'auto', lg: 'auto'}}
                        padding={1}
                        paddingLeft={{ xs: 0, lg: 5 }}
                        flexDirection={{ xs: 'column', lg: 'row'}}
                        flex={1}
                        // onClick={() => setProductClicked({ id: viewedProduct?.id })}
                    >
                        <img height={400} style={{ alignSelf: 'center', objectFit: 'contain', marginTop: '2%', marginBottom: '2%' }} src={viewedProduct?.image} alt='imag' />
                        <Stack
                            direction='column'
                            marginLeft={{ xs: 4, lg: 6}}
                            marginRight={{ xs: 2, lg: 0}}
                            marginTop={{ xs: 1.5, lg: 8}}
                            marginBottom={{ xs: 1.5, lg: 3}}
                        >
                            <Typography
                                fontSize={34}
                                fontWeight={600}
                                fontFamily='Poppins'
                            >
                                {viewedProduct?.title}
                            </Typography>
                            <Typography
                                fontSize={14}
                                fontWeight={400}
                                fontFamily='Poppins'
                                height={{ xs: 240, lg: 'auto'}}
                                overflow='auto'
                                mb={1}
                            >
                                {viewedProduct?.description}
                            </Typography>
                            <Typography
                                fontSize={14}
                                fontWeight={400}
                                fontFamily='Poppins'
                            >
                                {viewedProduct?.additionalInfo && Object.keys(viewedProduct?.additionalInfo).map(info => (
                                    <Stack
                                        direction='row'
                                        my='20px'
                                    >
                                        <Typography
                                            fontWeight={600}
                                            fontSize={16}
                                            fontFamily='Poppins'
                                        >
                                            {info}:
                                        </Typography>
                                        <Typography
                                            fontSize={16}
                                            marginLeft={1}
                                            fontFamily='Poppins'
                                        >
                                            {viewedProduct?.additionalInfo[info]}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Typography>
                            <Stack
                                height= '60px'
                                marginRight= {{ xs: 0, lg: 2.5 }}
                                alignSelf= 'flex-end'
                                direction='row'
                            >
                                <Stack
                                    direction='column'
                                    alignItems='center'
                                    justifyContent='center'
                                    marginRight={1}
                                    border={1}
                                    borderRadius={0.8}
                                    borderColor='#ebebeb'
                                    color='#595959'
                                    boxShadow='0px 0px 4px 1px rgba(0,0,0,0.2)'
                                    fontSize={18}
                                >
                                    <AddIcon onClick={() => setViewedProduct(prev => ({ ...prev, count: prev.count + 1 }))} sx={{ marginTop: 0.5, cursor: 'pointer' }} fontSize='2px' />
                                    <Box
                                        bgcolor='#fcfcfc'
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='center'
                                        borderTop={1}
                                        borderBottom={1}
                                        width= '100%'
                                        borderColor='#ebebeb'
                                    >
                                        <Typography
                                            fontFamily='Poppins'
                                            fontWeight={500}
                                        >
                                            {viewedProduct?.count}
                                        </Typography>
                                    </Box>
                                    <RemoveIcon onClick={() => setViewedProduct(prev => prev.count > 1 ? ({ ...prev, count: prev.count - 1 }) : prev )} sx={{ marginBottom: 0.5, cursor: 'pointer' }} fontSize='2px' />
                                </Stack>
                                <Button
                                    sx={{
                                        width: '156px',
                                        height: '52px',
                                        backgroundColor: '#F8EEEC',
                                        '&:hover': {
                                            backgroundColor: '#f5e0dc',
                                        },
                                        color: '#000',
                                        fontSize: 18,
                                        fontWeight: 600,
                                        fontFamily: 'Poppins',
                                        borderRadius: 2.5,

                                    }}
                                    onClick={handleAdd}
                                >
                                    Add To Cart
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                }
            </Box>
        )
    }
    //@ts-ignore
    else if(isError) content = <p>{error?.data?.message}</p>

    return content
}
