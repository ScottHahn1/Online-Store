import "../styles/Categories.css";
import { useRef } from "react";
import { Category } from "../hooks/useCategories";
import { useSearchParams } from "react-router-dom";

interface Props {
  categories: Category[];
  isLoading: boolean
}

const Categories = ({ categories, isLoading }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const slugify = (categoryName: string) => {
    return categoryName?.toLowerCase().replaceAll("&", "and").replaceAll(" ", "-")
  }

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
      {!isLoading && categories && (
        <div className="categories" ref={headerRef}>
          <span 
            className="category"
            onClick={() => setSearchParams({})}
            style={{ borderBottom: !searchParams.get("category") ? "2px solid red" : "none" }}
          >
            All Products
          </span>
          {categories.map(category => (
            <div 
              className="category" 
              onClick={() => setSearchParams({ category: slugify(category.name) })} 
              key={category.name}  
              style={{ borderBottom: slugify(category.name) === searchParams.get("category") ? "2px solid red" : "none" }}
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