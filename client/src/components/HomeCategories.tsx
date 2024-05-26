import { Dispatch, SetStateAction } from 'react';
import useCategories from '../hooks/useCategories';
import { useNavigate } from 'react-router-dom';

const HomeCategories = ({ setCategory }: { setCategory: Dispatch<SetStateAction<string>> }) => {
    const { data, isLoading } = useCategories();
    const navigate = useNavigate();

    return (
        <div>
            {!isLoading && (
                <div className="home-categories" id="home-categories">
                    <h2 style={{ width: "100%", textAlign: "center" }}>Categories</h2>
                    {data?.map(category => (
                        <div className="home-category" key={category.id} onClick={() => {
                            setCategory(category.name)
                            navigate('/products')
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