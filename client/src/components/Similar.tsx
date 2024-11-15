import { useQuery } from "@tanstack/react-query";
import { getData } from "../utils/Api";
import { getSessionStorage, setSessionStorage } from "../utils/LocalStorage";
import { useEffect, useState } from "react";
import arrayShuffle from "array-shuffle";

type Data = {
  productId: number;
  title: string;
  brand: string;
  image: string;
  overview: string;
  price: number;
  rating: number;
  ratingCount: number;
}[];

type Props = {
  product?: {};
  productId: number;
  category: string;
};

const Similar = ({ product, productId, category }: Props) => {
  const { data } = useQuery({
    queryKey: ["similar", product],
    queryFn: () =>
      getData<Data, Props>('/api/products/similar', {
        productId: productId,
        category: category,
      }),
    enabled: !!getSessionStorage('product'),
  });

  const [shuffledData, setShuffledData] = useState<Data>([]);

  useEffect(() => {
    if (data) {
      setShuffledData(arrayShuffle(data));
    }
  }, [data]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [shuffledData]);

  return (
    <div className='similar' style={{ textAlign: 'center' }}>
      <h2>Similar Products</h2>
      <div className='cards'>
        {shuffledData &&
          shuffledData
            .map((product) => (
              <div
                className='card'
                onClick={() => {
                  setSessionStorage('product', product.productId);
                }}
                key={product.productId}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  onClick={() => window.location.reload()}
                />
                <h4>{product.title}</h4>
                {new Intl.NumberFormat('en-ZA', {
                  style: 'currency',
                  currency: 'ZAR',
                  minimumFractionDigits: 2,
                }).format(product.price)}
              </div>
            ))
            .slice(0, 8)}
      </div>
    </div>
  );
};

export default Similar;