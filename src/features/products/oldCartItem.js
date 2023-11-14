const cartitem= (
    <Box className='CartItem'>
            <Box className='CartTitle'>
            <Box className='CartItemRemover'>
                <button disabled={CartLoading} onClick={handleDel} ><FontAwesomeIcon icon={faCircleXmark} /></button>
            </Box>
                <Box className='CartItemPrice'>USD$ {productData.price * product.count}</Box>
                <img src={productData.image} alt={productData._id}/>
                <Box className='CartTitleName'>
                    <Box className='CartMainTitle'>{productData.title}</Box>
                    <Box className='CartAddInfo'>
                        {additionalInfo}
                    </Box>
                </Box>
            </Box>
            <Box className='CartCount'>
                <Box className='CartItemUpdater'><button disabled={CartLoading} onClick={handleAdd} >+</button></Box>
                <Box className='CartItemCount'>{product.count}</Box>
                <Box className='CartItemUpdater'><button disabled={CartLoading} onClick={handleRem}>-</button></Box>
            </Box>
        </Box>
)