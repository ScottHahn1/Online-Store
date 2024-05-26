import { Dispatch, SetStateAction } from "react";

type Props = {
  numOfProduct: number;
  setNumOfProduct: Dispatch<SetStateAction<number>>;
};

const AddRemoveBtns = ({ numOfProduct, setNumOfProduct }: Props) => {
  const plus = () => {
    if (numOfProduct < 10) {
      setNumOfProduct(prev => prev + 1);
    }
  }
  
  return (
    <div className="add-remove-btn">
      <button
        className="minus"
        onClick={() => 
          setNumOfProduct(prev => 
            prev !== 0 ? prev - 1 : prev
          )
        }
      >
        -
      </button>

      {numOfProduct}

      <button
        className="plus"
        onClick={plus}
      >
        +
      </button>
    </div>
  );
};

export default AddRemoveBtns;