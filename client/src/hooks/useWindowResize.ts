import { useEffect, useState } from "react";

const useWindowResize = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const setWindowDimensions = () => {
        setWindowWidth(window.innerWidth);
    };
    
    useEffect(() => {
        window.addEventListener("resize", setWindowDimensions);
        return () => {
            window.removeEventListener("resize", setWindowDimensions);
        };
    }, []);
    return windowWidth;
}

export default useWindowResize;