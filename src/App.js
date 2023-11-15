import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import CustomerLogin from './features/auth/CustomerLogin';
import AdminLogin from './features/auth/AdminLogin';
import DeliveryLogin from './features/auth/DeliveryLogin';
import RenderLogin from './features/auth/RenderLogin';
import Prefetch from './features/auth/Prefetch';
import Signup from './features/auth/Signup';
import ProductsList from './features/products/ProductsList';
import OrderCompleted from './features/customers/OrderCompleted';
import MyOrders from './features/orders/MyOrders';

function App() {
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route index element={<PublicLayout />} />
				<Route path='login' element={<CustomerLogin />} />
				<Route path='admin' element={<AdminLogin />} />
				<Route path='delivery' element={<DeliveryLogin />} />
				<Route path='signup' element={<Signup />} />

				<Route element={<RenderLogin />}>
					<Route element={<Prefetch />}>
						<Route path='products'>
							<Route index element={<ProductsList />} />

						</Route>

						<Route path='success'>
							<Route index element={<OrderCompleted />} />

						</Route>
						<Route path='my-orders'>
							<Route index element={<MyOrders />} />

						</Route>
					</Route>
				</Route>
			</Route>
		</Routes>
	)
}

export default App;
