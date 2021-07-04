import { getCurrentProduct, getError, getShowProductCode, getProducts } from '../state/product.reducer';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';

import { Product } from '../product';
// import { ProductService } from '../product.service';
import { State } from '../state/product.reducer';
import * as ProductActions from '../state/product.actions';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  // errorMessage: string;

  // displayCode: boolean;

  // products: Product[];
  products$: Observable<Product[]>;

  // Used to highlight the selected product in the list
  // selectedProduct: Product | null;
  sub: Subscription;
  selectedProduct$: Observable<Product>;
  displayCode$: Observable<boolean>;
  errorMessage$: Observable<string>;

  constructor(private store: Store<State>) {  }

  ngOnInit(): void {
    //TODO: GOING TO USE NGRX STORE INSTEAD OF A SERVICE
    // this.sub = this.productService.selectedProductChanges$.subscribe(
    //   currentProduct => this.selectedProduct = currentProduct
    // );
    //TODO: NEED TO UNSUBSCRIBE FROM THIS OBSERVABLE EVENTUALLY
    this.selectedProduct$ = this.store.select(getCurrentProduct);

    this.errorMessage$ = this.store.select(getError);

    this.products$ = this.store.select(getProducts);

    this.store.dispatch(ProductActions.loadProducts())
    // this.productService.getProducts().subscribe({
    //   next: (products: Product[]) => this.products = products,
    //   error: err => this.errorMessage = err
    // });

    //TODO: UNSUBSCRIBE FROM OBSERVABLE
    this.displayCode$ = this.store.select(getShowProductCode);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  checkChanged(): void {
    this.store.dispatch(ProductActions.toggleProductCode())
  }

  newProduct(): void {
    //TODO: GOING TO USE NGRX STORE INSTEAD OF A SERVICE
    // this.productService.changeSelectedProduct(this.productService.newProduct());
    this.store.dispatch(ProductActions.initializeCurrentProduct())
  }

  productSelected(product: Product): void {
    this.store.dispatch(ProductActions.setCurrentProduct({currentProductId: product.id}));
  }

}
