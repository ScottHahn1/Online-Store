import { Dispatch, SetStateAction, useEffect } from 'react';
import { Products } from '../components/Cart';

const useCartTotal = (cartItems: Products | undefined, total: number, setTotal: Dispatch<SetStateAction<number>>) => {
    useEffect(() => {
      if (cartItems && cartItems.length > 0) {
        const newTotal = cartItems.reduce((sum, product) => {
          return sum + product.price * product.count;
        }, 0)

        setTotal(newTotal);
      } else {
        setTotal(0);
      }
    }, [cartItems, setTotal]);

    return { total };
}

export default useCartTotal;