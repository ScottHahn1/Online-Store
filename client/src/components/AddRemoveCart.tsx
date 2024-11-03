type Props = {
    handleMinusClick: () => any;
    handlePlusClick: () => any;
    index?: number;
    isCart: boolean;
    numOfProducts: number | number[];
}

const AddRemoveCart = ({ handleMinusClick, handlePlusClick, index, isCart, numOfProducts }: Props) => {
    return (
        <div className={ `${isCart ? 'add-remove-btn-cart' : 'add-remove-btn' }` }>
            <button 
            className={ `${isCart ? 'minus-cart' : 'minus' }` } 
            onClick={handleMinusClick}>
                -
            </button>

            {
                typeof numOfProducts === 'object' ? numOfProducts[index!] : numOfProducts
            }

            <button 
            className={ `${isCart ? 'plus-cart' : 'plus' }` } 
            onClick={handlePlusClick}>
                +
            </button>
        </div>
    )
}

export default AddRemoveCart;