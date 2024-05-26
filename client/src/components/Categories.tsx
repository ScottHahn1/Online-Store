import "../styles/Categories.css";
import { Dispatch, SetStateAction, useRef } from "react";
import useCategories from "../hooks/useCategories";

const Categories = ({ clickedCategory, setClickedCategory }: { clickedCategory: string, setClickedCategory: Dispatch<SetStateAction<string>> }) => {
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

  return (
    <>
      {!isLoading && data && (
        <div className="categories" ref={headerRef}>
          <span 
            className="category"
            onClick={() => setClickedCategory("")}
            style={{ borderBottom: !clickedCategory ? "2px solid red" : "none" }}
          >
            All Products
          </span>
          {data.map(category => (
            <div 
              className="category" 
              onClick={() => setClickedCategory(category.name)} 
              key={category.name}  
              style={{ borderBottom: clickedCategory === category.name ? "2px solid red" : "none" }}
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