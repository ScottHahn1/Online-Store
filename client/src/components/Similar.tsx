import { useQuery } from "@tanstack/react-query";
import { getData } from "../utils/Api";
import { useEffect, useState } from "react";
import { Product } from "../pages/Product";
import { Link, useParams } from "react-router-dom";

interface Props {
  product: Product;
  categoryId: number;
};

const Similar = ({ product, categoryId }: Props) => {
  const { id } = useParams();

  const { data: similarProducts } = useQuery({
    queryKey: ["similar", id],
    queryFn: () =>
      getData<Product[], {}>('/api/products/similar', {
        categoryId
      }),
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [similarProducts]);

  const slugifyProduct = (productTitle: string) => {
    return productTitle.toLowerCase().replaceAll("&", "and").replaceAll(" ", "-");
  }

  return (
    <div className='similar' style={{ textAlign: 'center' }}>
      <h2>Similar Products</h2>

      <div className='cards'>
        {similarProducts?.length &&
          similarProducts.map((similarProduct) => (
            <Link 
              className="card"
              key={similarProduct.productId} 
              to={`/product/${similarProduct.productId}/${slugifyProduct(similarProduct.title)}`}
            >
              <div>
                <div className="product-image-wrapper">
                  <img
                    className="product-image"
                    src={similarProduct.image}
                    alt={similarProduct.title}
                  />
                </div>

                <h4 >{similarProduct.title}</h4>

                {new Intl.NumberFormat('en-ZA', {
                  style: 'currency',
                  currency: 'ZAR',
                  minimumFractionDigits: 2,
                }).format(similarProduct.price)}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Similar;