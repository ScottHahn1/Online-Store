import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
    product: {
        productId: number;
        title: string;
        image: string;
        price: number;
    }
    setItemToDelete: Dispatch<SetStateAction<number>>
    children: ReactNode
}

const CartItem = ({ children, product, setItemToDelete }: Props) => {
    return (
        <div className="cart-item" key={product.productId}>
            <div>
                <img src={product.image} width="70%" alt={product.title} />
            </div>

            <div className="flex-column" style={{ justifyContent: "center", gap: "1rem" }}>
                <div style={{ textAlign: "start" }}>
                    {product.title}
                </div>
                <div style={{ textAlign: "start" }}>
                    <b>
                    {new Intl.NumberFormat("en-ZA", {
                        style: "currency",
                        currency: "ZAR",
                        minimumFractionDigits: 2,
                    }).format(product.price)}
                    </b>
                </div>
            </div>

            <div className="flex-column" style={{ justifyContent: "center", alignItems: "center" }}>
                <div style={{ cursor: "pointer" }} onClick={() => setItemToDelete(product.productId)}>
                    <FontAwesomeIcon
                    icon={faTrashCan}
                    fontSize="1.3rem"
                    color="red"
                    />
                </div>

                { children } 
            </div>
        </div>
)
}

export default CartItem;