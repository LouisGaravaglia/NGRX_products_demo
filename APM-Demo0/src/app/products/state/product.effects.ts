import { ProductService } from '../product.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as ProductActions from '../state/product.actions';
import { mergeMap, map, catchError, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

//ANY ACTION THAT HAS A SIDE EFFECT (IE MAKING A CALL TO THE SERVER OR ANY ASYNC LOGIC)
//NEEDS TO BE HANDLED HERE IN THE EFFECTS FILE. BUT THE SUCCESS AND FAILURE LOGIC CAN BE HANDLED
//IN THE REDUCER SINCE THAT DOESNT HAVE ANY ASYNC/SIDE EFFECTS.
@Injectable()
export class ProductEffects {
  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}

  loadProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      mergeMap(() =>
        this.productService
          .getProducts()
          .pipe(
            map(products => ProductActions.loadProductsSuccess({ products })),
            catchError(error => of(ProductActions.loadProductsFailure({error})))
          )
      )
    );
  });

  updateProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      concatMap(action =>
        this.productService.updateProduct(action.product)
          .pipe(
            map(product => ProductActions.updateProductSuccess({ product })),
            catchError(error => of(ProductActions.updateProductFailure({error})))
          )
      )
    );
  });
}
