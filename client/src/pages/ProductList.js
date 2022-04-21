import { useEffect } from 'react'
import Product from '../components/Product.js'
import styled from 'styled-components'
import { useAppContext } from '../context/AppContext.js'
// import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import { Link } from 'react-router-dom'

const ProductList = () => {
  const { products, getProducts, deleteProduct, toggleProduct, selectedItems } =
    useAppContext()

  useEffect(() => {
    getProducts()
    // eslint-disable-next-line
  }, [])

  return (
    <Wrapper>
      <main>
        <nav>
          <h3>Product List</h3>
          <div className='btn-container'>
            <Link to='/add-product' type='button' className='btn-add'>
              ADD
            </Link>
            <button
              type='button'
              className='btn-delete'
              id='delete-product-btn'
              onClick={() => deleteProduct(selectedItems)}
            >
              MASS DELETE
            </button>
          </div>
        </nav>
        <div className='title'>
          <h4>{products.length} products</h4>
        </div>
        <div className='product-list'>
          {products.map((product, index) => {
            return (
              <Product
                key={index}
                select={product.select}
                {...product}
                deleteProduct={deleteProduct}
                toggleProduct={toggleProduct}
              />
            )
          })}
        </div>
        <Footer />
      </main>
    </Wrapper>
  )
}

const Wrapper = styled.section`
nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .btn-add {
    background: #474839;
    border-color: transparent;
    font-size: 1rem;
    text-transform: uppercase;
    margin: 0 0.5rem;
    letter-spacing: 1px;
    padding: 0.375rem 0.75rem;
    color: #fcfcf2;
    cursor: pointer;
    transition: 0.3s all linear;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    text-decoration: none;
  }
  .btn-delete {
    background: #b35f5f;
    border-color: transparent;
    font-size: 1rem;
    text-transform: uppercase;
    margin: 0 0.5rem;
    letter-spacing: 1px;
    padding: 0.375rem 0.75rem;
    color: white;
    cursor: pointer;
    transition: 0.3s all linear;
    border-radius: 0.25rem;
    font-size: 0.8rem;
  }
.product-list {
  width: 90vw;
  display: grid;
  gap: 2rem 1rem;
  justify-items: center;
  max-width: 1170px;
  margin: 0 auto;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  
`

export default ProductList
