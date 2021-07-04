import { createAction, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import * as AppState from './app.state';
import { Product } from '../product';
import * as ProductActions from './product.actions';

//TODO: I HAVE TO EXTEND APPSTATE HERE BECAUSE PRODUCT STATE IS SUPPOSED TO BE SEPARTE
//IN ORDER TO BE LAZY LOADED SEPARATELY FROM OTHER CONTENT. SO IN THE COMPONENT I USE THIS
//INTERFACE WHEN DESCRIBING THE TYPE VALUE OF MY STATE
export interface State extends AppState.State {
  products: ProductState;
}

export interface ProductState {
  showProductCode: boolean;
  products: Product[];
  currentProductId: number | null;
  error: string;
}

const initialState: ProductState = {
  showProductCode: true,
  products: [],
  currentProductId: null,
  error: ''
}

//TODO: THIS IS THE WAY TO CREATE A FEATURE SELECTOR
const getProductFeatureState = createFeatureSelector<ProductState>('products');

//TODO: THEN YOU CREATE SPECIFIC SELECTORS FOR CERTAIN PIECES OF STATE YOU WANT ACCESS TO
// THE BEST PART OF THIS IS THAT ITS RESULT IS MEMOIZED SO YOUR APP ISN'T CONSTANTLY 
// REDOWNLOADIN THE LATEST VALUE UNLESS IT IS NEW. AND SINCE ITS SPECIFIC YOU DONT HAVE TO HAVE
// AND OBSERVABLE FOR THE WHOLE PRODUCT STATE. YOU ONLY HAVE TO SUBSCRIBE TO THIS SPECIFIC PIECE.
export const getShowProductCode = createSelector(
  getProductFeatureState,
  state => state.showProductCode
);

export const getCurrentProductId = createSelector(
  getProductFeatureState,
  state => state.currentProductId
);

//TODO: THIS IS A BETTER WAY TO COMBINE DIFFERENT PIECES OF STATE TO FIND SOMETHING
// SINCE IT UTILIZES ENCAPSALATION IT ALLOWS FOR BETTER DEBUGGING AND SCALING.
export const getCurrentProduct = createSelector(
  getProductFeatureState,
  getCurrentProductId,
  (state, currentProductId) => {
    if (currentProductId === 0 ){
      return {
        id: 0,
        productName: '',
        productCode: 'New',
        description: '',
        starRating: 0
      };
    } else {
      return currentProductId ? state.products.find(p => p.id === currentProductId) : null;
    }
  }
)
// export const getCurrentProduct = createSelector(
//   getProductFeatureState,
//   state => state.currentProduct
// );



export const getProducts = createSelector(
  getProductFeatureState,
  state => state.products
);



export const getError = createSelector(
  getProductFeatureState,
  state => state.error
)

export const productReducer = createReducer<ProductState>(
  initialState,
  on(ProductActions.toggleProductCode, (state): ProductState => {
    return {
      ...state,
      showProductCode: !state.showProductCode
    }
  }),
  on(ProductActions.setCurrentProduct, (state, action): ProductState => {
    return {
      ...state,
      currentProductId: action.currentProductId
    }
  }),
  on(ProductActions.clearCurrentProduct, (state): ProductState => {
    return {
      ...state,
      currentProductId: null
    }
  }),
  on(ProductActions.initializeCurrentProduct, (state, action): ProductState => {
    return {
      ...state,
      currentProductId: 0
    }
  }),
  //NOTICE HOW THINGS THAT HAVE SIDE EFFECTS (LIKE MAKING CALLS TO SERVER TO LOAD A PRODUCT OR UPDATE A PRODUCT) ARE 
  //HANDLED IN THE EFFECTS FILE, BUT THEIR SUCCESS AND FAILURE ARE ACTIONS THAT ARE HANDLED HERE IN THE REDUCER
  on(ProductActions.loadProductsSuccess, (state, action): ProductState => {
    return {
      ...state,
      products: action.products
    }
  }),
  on(ProductActions.loadProductsFailure, (state, action): ProductState => {
    return {
      ...state,
      products: [],
      error: action.error
    }
  }),
    on(ProductActions.updateProductSuccess, (state, action): ProductState => {
      const updatedProducts = state.products.map(
        item => action.product.id === item.id ? action.product : item
      );
    return {
      ...state,
      products: updatedProducts,
      currentProductId: action.product.id,
      error: ''
    }
  }),
    on(ProductActions.updateProductFailure, (state, action): ProductState => {
    return {
      ...state,
      error: action.error
    }
  }),
)