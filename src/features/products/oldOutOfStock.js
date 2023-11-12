const oldout = (
    <div className='OutOfStockProduct'>
    <div className='ProductIcons'>
        <div className='ProductIcon'>
            {Icons[product.categoryName]}
        </div>
        <div className='ProductImage'>
            <img src={product.image} alt={product.title} />
        </div>
    </div>
    <div className='ProductDetails'>
        <div className='ProductTitle'>
            {product.title}
        </div>
        <div className='OutOfStock'>
            OUT OF STOCK
        </div>
        <div className='ProductExtraDetails'>
            <div className='ProductPriceDetails'>
                <div className='ProductPriceIcon'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
                        <path d="M18.4998 37C18.9905 36.9999 19.4609 36.8049 19.8078 36.458L36.458 19.8105C36.6468 19.6218 36.7925 19.3945 36.8851 19.1441C36.9777 18.8938 37.015 18.6264 36.9945 18.3603L35.805 2.90214C35.7714 2.46178 35.5813 2.04797 35.2692 1.73552C34.957 1.42307 34.5433 1.23259 34.1029 1.19854L18.6423 0.0054677C18.3761 -0.0150384 18.1087 0.022287 17.8583 0.114881C17.608 0.207475 17.3806 0.353145 17.1919 0.541888L0.541662 17.1894C0.194836 17.5363 0 18.0067 0 18.4972C0 18.9877 0.194836 19.4581 0.541662 19.8049L17.1919 36.4525C17.3632 36.6253 17.5669 36.7626 17.7913 36.8565C18.0158 36.9505 18.2565 36.9992 18.4998 37ZM19.2066 3.76411L32.2381 4.76666L33.2408 17.7961L18.4998 32.5348L4.46556 18.5027L19.2066 3.76411ZM23.0195 13.9839C22.5019 13.4665 22.1494 12.8073 22.0065 12.0897C21.8637 11.372 21.9369 10.6281 22.2169 9.95209C22.4969 9.27603 22.9711 8.69819 23.5796 8.29164C24.1881 7.88509 24.9035 7.66809 25.6354 7.66809C26.3672 7.66809 27.0826 7.88509 27.6911 8.29164C28.2996 8.69819 28.7739 9.27603 29.0539 9.95209C29.3339 10.6281 29.4071 11.372 29.2643 12.0897C29.1214 12.8073 28.7689 13.4665 28.2513 13.9839C27.5575 14.6774 26.6165 15.067 25.6354 15.067C24.6543 15.067 23.7133 14.6774 23.0195 13.9839Z" fill="black"/>
                    </svg>
                </div>
                <div className='ProductPriceNumber'>
                    ${product.price}
                </div>
            </div>
            <div className='ProductFavouriteIcon'>
                <svg onClick={() => setFav(prev => !prev)} xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 20.593C6.37 15.054 1 10.296 1 6.191C1 2.4 4.068 1 6.281 1C7.593 1 10.432 1.501 12 5.457C13.59 1.489 16.464 1.01 17.726 1.01C20.266 1.01 23 2.631 23 6.191C23 10.26 17.864 14.816 12 20.593ZM17.726 0.00999999C15.523 0.00999999 13.28 1.052 12 3.248C10.715 1.042 8.478 0 6.281 0C3.098 0 0 2.187 0 6.191C0 10.852 5.571 15.62 12 22C18.43 15.62 24 10.852 24 6.191C24 2.18 20.905 0.00999999 17.726 0.00999999Z" fill="black"/>
                </svg>
            </div>
        </div>
    </div>
    {/* <button
        onClick={handleAdd}
        disabled={isLoading}
        name='addToCart'
    >
        Add To Cart
    </button> */}
</div>
)