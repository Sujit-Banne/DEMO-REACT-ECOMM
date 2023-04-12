import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Ecommerce() {
    const [products, setProducts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [popupData, setPopupData] = useState(null);
    const [popup, setPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);

    useEffect(() => {
        axios.get('https://dummyjson.com/products')
            .then((response) => {
                console.log(response.data);
                setProducts(response.data.products)
            }).catch((error) => {
                console.log(error);
            })
    }, [])

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value)
    }

    const handleImageClick = (product) => {
        setPopupData(product);
        setPopup(true);
    }

    const filteredProducts =
        selectedCategory === '' ? products : products.filter((product) => product.category === selectedCategory)

    // Get current products
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <h1 className="header">Available Products</h1>
            <select value={selectedCategory} onChange={handleCategoryChange} className='filter'>
                <option value="">All Products</option>
                {Array.isArray(products) &&
                    products.map((product) => product.category)
                        .filter(
                            (category, index, self) => self.indexOf(category) === index
                        )
                        .map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))
                }
            </select>
            <div className="products-main">
                {Array.isArray(currentProducts) &&
                    currentProducts.map((product) => (
                        <div key={product.id} onClick={() => handleImageClick(product)}>
                            <img src={product.images[0]} alt="img" className="images" />
                        </div>
                    ))
                }
            </div>
            <div className="pagination">
                {filteredProducts.length > 0 && (
                    <nav>
                        <ul className="pagination-list">
                            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) =>
                                <li key={i} className={`pagination-item${currentPage === i + 1 ? ' active' : ''}`}>
                                    <a href="#!" className="pagination-link" onClick={() => paginate(i + 1)}>{i + 1}</a>
                                </li>
                            )}
                        </ul>
                    </nav>
                )}
            </div>
            {popupData && popup &&
                <div className="popup">
                    <div className="popup-header">
                        <div>
                            <h3>{popupData.category}</h3>
                        </div>
                        <button className="popup-close-btn" onClick={() => { setPopup(false) }}>Close</button>
                    </div>
                    <div className="popup-container">
                        <div>
                            <img className="popup-img" src={popupData.images[0]} alt="hello" />
                        </div>
                        <div className="popup-description">
                            <p><b>Description:</b>  {popupData.description}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
