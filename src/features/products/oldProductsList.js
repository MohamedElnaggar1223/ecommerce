import { Box } from '@mui/material'
import React from 'react'

const old = (
    <Box className='MainContainer'>
                <Box className='SideMenuContainer'>
                    <Box className='CategoriesContainer'>
                        {displayedCategories}
                    </Box>
                    <Box className='PriceContainer'>
                        <label>Price: ${price}</label>
                        <input type='range' min={minPrice} max={maxPrice} value={price} onChange={(e) => setPrice(parseInt(e.target.value))} onMouseUp={handlePriceChange} />
                    </Box>
                </Box>
                <Box className='ProductsContainer'>
                    <Box className='SortByContainer'>
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
                    </Box>
                    <Box className='Products'>
                        {displayedProducts}
                    </Box>
                </Box>
            </Box>
)