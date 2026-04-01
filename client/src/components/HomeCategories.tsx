import { Dispatch, SetStateAction } from 'react';
import useCategories from '../hooks/useCategories';
import { useNavigate } from 'react-router-dom';

const HomeCategories = () => {
  const { data, isLoading } = useCategories();
  const navigate = useNavigate();

  const slugify = (categoryName: string) => {
    return categoryName?.toLowerCase().replaceAll("&", "and").replaceAll(" ", "-")
  } 

  return (
    <div>
      {!isLoading && (
        <div className="home-categories" id="home-categories">
          <h2 style={{ width: "100%", textAlign: "center" }}>
            Categories
          </h2>

          {data?.map(category => (
              <div className="home-category" key={category.id} onClick={() => {
                navigate(`/products/?category=${slugify(category.name)}`)
              }}>
                <img src={category.image} alt={category.name} />
                <p>{category.name}</p>
              </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HomeCategories;