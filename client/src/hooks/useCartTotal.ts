import { Dispatch, SetStateAction, useEffect } from 'react';
import { Products } from '../components/Cart';

const useCartTotal = (data: Products | undefined, total: number, setTotal: Dispatch<SetStateAction<number>>) => {
    useEffect(() => {
      if (data && data.length > 0) {
        const newTotal = data.map(product => {
          return product.price * product.count
        }).reduce((a: number, b: number) => {
          return a + b;
        })

        setTotal(newTotal);
      } else {
        setTotal(0);
      }
    }, [data]);

    return { total };
}

export default useCartTotal;