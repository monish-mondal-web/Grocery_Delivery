import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const AllProducts = () => {
  const { products, searchQuary } = useAppContext();
  const [filterProduct, setFilterProduct] = useState([]);

  useEffect(() => {
    if (searchQuary.length > 0) {
      setFilterProduct(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuary.toLowerCase())
        )
      );
    } else {
      setFilterProduct(products);
    }
  }, [products, searchQuary]);
  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
        {filterProduct
          .filter((product) => product.inStock)
          .map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
      </div>
    </div>
  );
};

export default AllProducts;
