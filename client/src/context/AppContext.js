import React, { useReducer, useContext } from 'react'
import axios from 'axios'
import reducer from './reducer.js'
import {
  GET_PRODUCTS_BEGIN,
  GET_PRODUCTS_SUCCESS,
  DELETE_PRODUCT_BEGIN,
  TOGGLE_PRODUCT,
  HANDLE_CHANGE,
  CREATE_PRODUCT_BEGIN,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_ERROR,
  CLEAR_VALUES,
  CLEAR_ALERT,
} from './actions.js'

const AppContext = React.createContext()

const initialState = {
  showAlert: false,
  alertText: '',
  alertType: '',
  products: [],
  product: false,
  totalProducts: 0,
  numOfPages: 1,
  selectedItems: [],
  sku: '',
  name: '',
  price: '',
  size: '',
  height: '',
  width: '',
  length: '',
  weight: '',
  category: 'DVD',
  list: ['DVD', 'Furniture', 'Book'],
}

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const authFetch = axios.create({
    baseURL: '/api/v1',
  })

  const getProducts = async () => {
    let url = '/'
    dispatch({ type: GET_PRODUCTS_BEGIN })
    try {
      const { data } = await authFetch(url)
      const { products, totalProducts, numOfPages } = data
      dispatch({
        type: GET_PRODUCTS_SUCCESS,
        payload: { products, totalProducts, numOfPages },
      })
    } catch (error) {
      console.log(error.response)
    }
  }

  const toggleProduct = (e) => {
    e.preventDefault()
    const id = e.target.id
    dispatch({ type: TOGGLE_PRODUCT, payload: { id } })
  }

  const deleteProduct = async (selectedItems) => {
    dispatch({ type: DELETE_PRODUCT_BEGIN })
    try {
      await authFetch.delete(`/${selectedItems}`)
      getProducts()
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } })
  }

  const addProduct = async () => {
    dispatch({ type: CREATE_PRODUCT_BEGIN })
    try {
      const { category } = state
      if (category === 'DVD') {
        const { sku, name, price, size } = state
        if (!sku || !name || !price || !size) {
          return
        }
        await authFetch.post('/add-product', {
          sku,
          name,
          price,
          size,
          category,
        })
        dispatch({ type: CREATE_PRODUCT_SUCCESS })
        // navigate("/");
      }
      if (category === 'Book') {
        const { sku, name, price, weight } = state
        if (!sku || !name || !price || !weight) {
          return
        }
        await authFetch.post('/add-product', {
          sku,
          name,
          price,
          weight,
          category,
        })
        dispatch({ type: CREATE_PRODUCT_SUCCESS })
      }
      if (category === 'Furniture') {
        const { sku, name, price, height, width, length } = state
        if (!sku || !name || !price || !height || !width || !length) {
          return
        }
        await authFetch.post('/add-product', {
          sku,
          name,
          price,
          height,
          width,
          length,
          category,
        })
        dispatch({ type: CREATE_PRODUCT_SUCCESS })
      }
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: CREATE_PRODUCT_ERROR,
      })
      clearAlert()
    }
  }
  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES })
  }
  const clearAlert = () => {
    setTimeout(() => {
      dispatch({
        type: CLEAR_ALERT,
      })
    }, 3000)
  }
  return (
    <AppContext.Provider
      value={{
        ...state,
        getProducts,
        deleteProduct,
        toggleProduct,
        handleChange,
        addProduct,
        clearValues,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }
