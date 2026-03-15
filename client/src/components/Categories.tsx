import "../styles/Categories.css";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import useCategories from "../hooks/useCategories";

interface Props {
  categoryId: number | null;
  setCategoryName: Dispatch<SetStateAction<string>>;
  clickedCategory: number | null;
  setClickedCategory: Dispatch<SetStateAction<number | null>>;
}

const Categories = ({ categoryId, setCategoryName, clickedCategory, setClickedCategory }:  Props) => {
  const { data, isLoading } = useCategories();

  const headerRef = useRef<HTMLDivElement | null>(null);

  let prevScrollpos = window.scrollY;
  
  window.onscroll = function() {
    const currentScrollPos = window.scrollY;
    if (prevScrollpos > currentScrollPos && headerRef.current) {
      headerRef.current.style.top = '9rem';
    } 
    else if (headerRef.current){
      headerRef.current.style.top = '7rem';
    }
    prevScrollpos = currentScrollPos;
  }

  useEffect(() => {
    if (data?.length && clickedCategory) {
      setCategoryName(data.filter((category) => clickedCategory === category.id)[0].name)
    }
  }, [data, clickedCategory])

  return (
    <>
      {!isLoading && data && (
        <div className="categories" ref={headerRef}>
          <span 
            className="category"
            onClick={() => setClickedCategory(null)}
            style={{ borderBottom: !clickedCategory ? "2px solid red" : "none" }}
          >
            All Products
          </span>
          {data.map(category => (
            <div 
              className="category" 
              onClick={() => setClickedCategory(category.id)} 
              key={category.name}  
              style={{ borderBottom: category.id === categoryId ? "2px solid red" : "none" }}
            >
              { category.name }
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Categories;