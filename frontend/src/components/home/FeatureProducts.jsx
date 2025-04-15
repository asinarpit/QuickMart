import React from 'react'
import { getProducts } from '../../features/products/productSlice'
import ProductCard from '../products/ProductCard'
import { useEffect } from 'react'
import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

export default function FeatureProducts() {
    const dispatch = useDispatch()
    const { products, loading } = useSelector((state) => state.products)

    useEffect(() => {
        dispatch(getProducts({}))
    }, [dispatch])



    return (
        <section className="py-12">
            <div className="container mx-auto md:px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Featured Products</h2>
                    <Link to="/products" className="text-secondary font-medium hover:underline">
                        View All
                    </Link>
                </div>

                <div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-hidden"
                >

                    {loading ? (
                        Array.from({ length: 10 }).map((_, index) => (
                            <div key={index} className="card animate-pulse">
                                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))
                    ) : (

                        products && products.slice(0, 10).map((product, index) => (
                            <div
                                key={product._id}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))


                    )}

                </div>
            </div>
        </section>
    )
}