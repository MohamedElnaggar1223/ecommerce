import React, { useCallback, useEffect, useState } from 'react'
import { useGetProductsQuery, useUpdateCartMutation } from './productsApiSlice'
import Product from './Product'
import OutofStockProd from './OutofStockProd'
import useAuth from '../../hooks/useAuth'
import { useGetCategoriesQuery } from '../category/categoryApiSlice'
import Category from '../category/Category'
import { Box, Button, Slider, Stack, Typography } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { store } from '../../app/store'
import { customersApiSlice, useGetFavsQuery } from '../customers/customersApiSlice'
import { selectOpen } from '../header/menuSlice'
import { useSelector } from 'react-redux'
import Loading from '../../components/Loading'

export default function ProductsList() 
{
    const { id: userId } = useAuth()
    const open = useSelector(selectOpen)
    const [showStock, setShowStock] = useState(true)
    const [sort, setSort] = useState('')
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const [productClicked, setProductClicked] = useState({ id: null })
    const [viewedProduct, setViewedProduct] = useState({})

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

    const 
    { 
        data: favs
    } = useGetFavsQuery({ id: userId }, 
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
                const array = ids.filter(id => selectedCategories?.includes(entities[id].category))
                const filteredArray = array.map(id => entities[id])
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
                else if(sort === 'Favourites') 
                {
                    const final = finalArray.filter(prod => favs?.includes(prod.id))
                    setSelectedProducts(final)
                    return
                }
                //@ts-ignore
                setSelectedProducts(finalArray)
            }
            else
            {
                const array = ids?.map(id => entities[id])
                setShowStock(true)
                //@ts-ignore
                if(sort === 'Newest') array.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                else if(sort === 'Oldest') array.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                else if(sort === 'HighestPrice') array.sort((a, b) => b.price === a.price ? 0 : b.price > a.price ? 1 : -1)
                else if(sort === 'LowestPrice') array.sort((a, b) => a.price === b.price ? 0 : a.price > b.price ? 1 : -1)
                else if(sort === 'AtoZ') array.sort((a, b) => a.title === b.title ? 0 : a.title > b.title ? 1 : -1)
                else if(sort === 'ZtoA') array.sort((a, b) => b.title === a.title ? 0 : b.title > a.title ? 1 : -1)
                else if(sort === 'InStock') setShowStock(false)
                else if(sort === 'Favourites') 
                {
                    const final = array.filter(prod => favs?.includes(prod.id))
                    setSelectedProducts(final)
                    return
                }
                //@ts-ignore
                setSelectedProducts(array)
            }
        }
        //eslint-disable-next-line
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
            else if(sort === 'Favourites') 
            {
                const final = finalArray.filter(prod => favs?.includes(prod.id))
                //@ts-ignore
                setSelectedProducts(final)
                return
            }
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
            else if(sort === 'Favourites') 
            {
                const final = filteredArray.filter(prod => favs?.includes(prod.id))
                //@ts-ignore
                setSelectedProducts(final)
                return
            }
            //@ts-ignore
            setSelectedProducts(filteredArray)
        }
    }, [price, products, selectedCategories, sort, favs])

    function handleSort(e)
    {
        setSort(e.target.value)
        setShowStock(true)
        const { ids, entities } = products
        const prods = ids.map(id => entities[id])
        const array = [...prods]
        if(e.target.value === 'Newest') array.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        else if(e.target.value === 'Oldest') array.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        else if(e.target.value === 'HighestPrice') array.sort((a, b) => b.price === a.price ? 0 : b.price > a.price ? 1 : -1)
        else if(e.target.value === 'LowestPrice') array.sort((a, b) => a.price === b.price ? 0 : a.price > b.price ? 1 : -1)
        else if(e.target.value === 'AtoZ') array.sort((a, b) => a.title === b.title ? 0 : a.title > b.title ? 1 : -1)
        else if(e.target.value === 'ZtoA') array.sort((a, b) => b.title === a.title ? 0 : b.title > a.title ? 1 : -1)
        else if(e.target.value === 'InStock') setShowStock(false)
        else if(e.target.value === 'Favourites') 
        {
            const final = array.filter(prod => favs?.includes(prod.id))
            //@ts-ignore
            setSelectedProducts(final)
            return
        }
        //@ts-ignore
        setSelectedProducts(array)
    }

    useEffect(() => 
    {
        if(productClicked.id !== null) 
        {
            //@ts-ignore
            const prod = selectedProducts.find(prod => prod.id === productClicked.id)
            //@ts-ignore
            const exCount = viewedProduct?.count
            let prodWithCounter
            //@ts-ignore
            if(exCount && productClicked.id === viewedProduct?.id) prodWithCounter = { ...prod, count: exCount }
            //@ts-ignore
            else prodWithCounter = { ...prod, count: 1 }
            setViewedProduct(prodWithCounter)
        }
        //eslint-disable-next-line
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
            //@ts-ignore
            await addToCart({ id: userId, product: viewedProduct?.id, action: 'add', count: viewedProduct?.count }).unwrap()
            store.dispatch(customersApiSlice.util.invalidateTags([{ type: 'Customer', id: userId }]))
        }
        catch(e)
        {
            // console.error(e)
        }
    }

    let content
    if(isLoading || isLoadingCats) content = (
        <Loading />
    )
    else if(isSuccess && isSuccessCats)
    {
        const { entities } = products
        const { ids: catsIds } = cats

        const displayedProducts = selectedProducts.map(prod =>
            //@ts-ignore 
            prod.available 
            ?
                //@ts-ignore
                <Product key={prod._id} favs={favs} setProductClicked={setProductClicked} selectedCategories={selectedCategories} userId={userId} product={entities[prod._id]} />
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
                onClick={(e) => {
                    //@ts-ignore
                    if(!((e.target.classList).contains('ProductBox')) )
                    {
                        //@ts-ignore
                        if((e.target.classList.contains('Heart'))) 
                        {
                            setViewedProduct({})
                            setProductClicked({ id: null })
                        }
                        //@ts-ignore
                        else if((e.target.classList).length !== 0) productClicked.id !== null && setProductClicked({ id: null })
                    }
                }}
            >
                <Box
                    width={{ xs: open ? '250px' : '0px' , sm: 'fit-content', lg: 'fit-content' }}
                    bgcolor='#F8EEEC'
                    height='100%'
                    display='flex'
                    flexDirection='column'
                    padding={{xs: open ? 2 : 0 , sm: 3, lg: 3}}
                    justifyContent='space-evenly'
                    gap={{xs: open ? 2 : 0, sm: 4, lg: 4}}
                    zIndex={{ xs: 999, sm: 0, lg: 0 }}
                    position={{ xs: 'absolute', sm: 'relative', lg: 'relative' }}
                    boxShadow={{ xs: open ? '200px 0px 44px 100vw rgba(0,0,0,0.25)' : '0', sm: '0', lg: '0' }}
                    overflow={{ xs: open ? 'visible' : 'hidden', sm: 'visible', lg: 'visible' }}
                    sx={{
                        transition: '1s all',
                    }}
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
                    <Box
                        pl={{xs: 2, sm: 8, lg: 8}}
                        pt={{xs: 5, sm: 4, lg: 4}}
                        fontFamily='Poppins'
                    >
                        <label style={{ fontSize: 20 }} htmlFor='Sort'>Sort By:</label>
                        <select
                            onChange={handleSort}
                            // defaultValue='Newest'
                            style={{ fontFamily: 'Poppins', fontSize: 20, backgroundColor: '#fff', borderRadius: '10px', height: 'auto', padding: 5, marginLeft: '10px', border: '1px solid #000', outline: 'none' }}
                            >
                                <option style={{ fontFamily: 'Poppins', paddingRight: 6, fontSize: 20, fontWeight: 500 }} className='SortChild' value='Newest'>Newest</option>
                                <option style={{ fontFamily: 'Poppins', paddingRight: 6, fontSize: 20, fontWeight: 500 }} className='SortChild' value='Oldest'>Oldest</option>
                                <option style={{ fontFamily: 'Poppins', paddingRight: 6, fontSize: 20, fontWeight: 500 }} className='SortChild' value='HighestPrice'>Highest Price</option>
                                <option style={{ fontFamily: 'Poppins', paddingRight: 6, fontSize: 20, fontWeight: 500 }} className='SortChild' value='LowestPrice'>Lowest Price</option>
                                <option style={{ fontFamily: 'Poppins', paddingRight: 6, fontSize: 20, fontWeight: 500 }} className='SortChild' value='AtoZ'>A ~ Z</option>
                                <option style={{ fontFamily: 'Poppins', paddingRight: 6, fontSize: 20, fontWeight: 500 }} className='SortChild' value='ZtoA'>Z ~ A</option>
                                <option style={{ fontFamily: 'Poppins', paddingRight: 6, fontSize: 20, fontWeight: 500 }} className='SortChild' value='InStock'>In Stock</option>
                                <option style={{ fontFamily: 'Poppins', paddingRight: 6, fontSize: 20, fontWeight: 500 }} className='SortChild' value='Favourites'>Favourites</option>
                        </select>
                    </Box>
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
                        width={{ xs: '80vw', sm: '45vw', lg: '50vw'}}
                        borderRadius= '20px'
                        bgcolor= '#FBFCFA'
                        boxShadow='0px 0px 100vw 100vw rgba(175, 175, 175, 0.6)'
                        minHeight='35vh'
                        top={{ xs: '15%', sm: '20%', lg: '20%'}}
                        left={{ xs: '10%', sm: '25%', lg: '25%'}}
                        display='flex'
                        maxHeight={{ xs: '75vh', lg: 'auto'}}
                        padding={1}
                        paddingLeft={{ xs: 0, lg: 1 }}
                        flexDirection={{ xs: 'column', lg: 'row'}}
                        flex={1}
                        className='ProductBox'
                        //@ts-ignore
                        onClick={() => setProductClicked({ id: viewedProduct?.id })}
                        zIndex={999}
                    >
                        <Box
                            sx={{ display: 'flex', flex: '1 1 0', alignSelf: 'center', marginTop: '2%', marginBottom: '2%' }}
                            height={{ xs: 280, sm: 240, lg: 520 }}
                        >
                            {/*@ts-ignore */}
                            <img className='ProductBox' style={{ height: '100%', maxWidth: '100%' , flex: '1 1 0', alignSelf: 'center', objectFit: 'contain'}} src={viewedProduct?.image} alt='imag' />
                        </Box>
                        <Stack
                            direction='column'
                            marginLeft={{ xs: 4, lg: 6}}
                            marginRight={{ xs: 2, lg: '2%'}}
                            marginTop={{ xs: 1.5, lg: 8}}
                            marginBottom={{ xs: 1.5, lg: 3}}
                            className='ProductBox'
                            flex={1}
                        >
                            <Typography
                                fontSize={34}
                                fontWeight={600}
                                fontFamily='Poppins'
                                className='ProductBox'
                            >
                                {/*//@ts-ignore*/}
                                {viewedProduct?.title}
                            </Typography>
                            <Typography
                                fontSize={14}
                                fontWeight={400}
                                fontFamily='Poppins'
                                height={{ xs: 'auto', lg: 'auto'}}
                                maxHeight={{ xs: 120, sm: 'fit-content', lg: 'fit-content' }}
                                overflow='auto'
                                className='ProductBox'
                                mb={1}
                            >
                                {/*//@ts-ignore*/}
                                {viewedProduct?.description}
                            </Typography>
                            <Typography
                                fontSize={14}
                                fontWeight={400}
                                fontFamily='Poppins'
                                className='ProductBox'
                            >
                                {/*//@ts-ignore*/}
                                {viewedProduct?.additionalInfo && Object.keys(viewedProduct?.additionalInfo).map(info => (
                                    <Stack
                                        direction='row'
                                        my='20px'
                                        className='ProductBox'
                                    >
                                        <Typography
                                            fontWeight={600}
                                            fontSize={16}
                                            fontFamily='Poppins'
                                            className='ProductBox'
                                        >
                                            {info}:
                                        </Typography>
                                        <Typography
                                            fontSize={16}
                                            marginLeft={1}
                                            fontFamily='Poppins'
                                            className='ProductBox'
                                        >
                                            {/*//@ts-ignore*/}
                                            {viewedProduct?.additionalInfo[info]}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Typography>
                            <Stack
                                height= '60px'
                                marginRight= {{ xs: 0, lg: 2.5 }}
                                alignSelf= 'flex-end'
                                mt= 'auto'
                                direction='row'
                                className='ProductBox'
                            >
                                <Stack
                                    direction='column'
                                    alignItems='center'
                                    justifyContent='center'
                                    marginRight={1}
                                    border={1}
                                    borderRadius={0.8}
                                    className='ProductBox'
                                    borderColor='#ebebeb'
                                    color='#595959'
                                    boxShadow='0px 0px 4px 1px rgba(0,0,0,0.2)'
                                    fontSize={18}
                                >
                                    {/*@ts-ignore */}
                                    <AddIcon className='ProductBox' onClick={() => setViewedProduct(prev => ({ ...prev, count: prev.count + 1 }))} sx={{ marginTop: 0.5, cursor: 'pointer' }} fontSize='2px' />
                                    <Box
                                        bgcolor='#fcfcfc'
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='center'
                                        borderTop={1}
                                        borderBottom={1}
                                        width= '100%'
                                        borderColor='#ebebeb'
                                        className='ProductBox'
                                    >
                                        <Typography
                                            fontFamily='Poppins'
                                            fontWeight={500}
                                            className='ProductBox'
                                        >
                                            {/*//@ts-ignore*/}
                                            {viewedProduct?.count}
                                        </Typography>
                                    </Box>
                                    {/*@ts-ignore */}
                                    <RemoveIcon className='ProductBox' onClick={() => setViewedProduct(prev => prev.count > 1 ? ({ ...prev, count: prev.count - 1 }) : prev )} sx={{ marginBottom: 0.5, cursor: 'pointer' }} fontSize='2px' />
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
                                    className='ProductBox'
                                    disabled={addToCartLoading}
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
