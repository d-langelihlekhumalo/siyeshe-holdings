/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { FeaturedDepartmentProducts } from '../modals/featured-departments-product.modal';

interface FeaturedDepartmentData {
  title: string;
  description: string;
  summary: string;
  imageUrl: string;
  branner: string;
  images: string[];
  imgsTitle: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FeaturedDepartmentsService {
  private directory = '../../assets/landing_page/coming_soon/';
  private databaseLocation = 'https://siyeshe-holdings-cd67e-default-rtdb.firebaseio.com/products/featured-departments.json';

  private _featuredProducts = new BehaviorSubject<FeaturedDepartmentProducts[]>([]);

  constructor(private http: HttpClient) { }

  get products() {
    return this._featuredProducts.asObservable();
  }

  fetchFeaturedProducts() {
    return this.http
      .get<{[key: string]: FeaturedDepartmentData}>(this.databaseLocation)
      .pipe(map(responseData => {
        const products =[];
        for(const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            products.push(
              new FeaturedDepartmentProducts(
                key,
                responseData[key].title,
                responseData[key].description,
                responseData[key].summary,
                responseData[key].imageUrl,
                responseData[key].branner,
                responseData[key].images,
                responseData[key].imgsTitle
              ));
            }
          }
        return products;
      }), tap(products => {
        this._featuredProducts.next(products);
      }));
  }

  getProduct(productId: string) {
    return this.http
      .get<FeaturedDepartmentData>(`https://siyeshe-holdings-cd67e-default-rtdb.firebaseio.com/products/featured-departments/${productId}.json`)
      .pipe(
        map(productData => new FeaturedDepartmentProducts(
          productId,
          productData.title,
          productData.description,
          productData.summary,
          productData.imageUrl,
          productData.branner,
          productData.images,
          productData.imgsTitle
        ))
      );
  }

  addFeaturedProduct(featuredProduct: FeaturedDepartmentProducts) {
    let generatedId: string;
    const newFeaturedProduct = featuredProduct;

    return this.http
      .post<{name: string}>(this.databaseLocation, {... newFeaturedProduct, id: null})
      .pipe(
        switchMap(responseData => {
          generatedId = responseData.name;
          return this.products;
        }),
        take(1),
        tap(products => {
          newFeaturedProduct.id = generatedId;
          this._featuredProducts.next(products.concat(newFeaturedProduct));
        })
      );
  }

}
