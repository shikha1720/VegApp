import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject, window } from 'rxjs';
import { Cart, Payment, Product, User } from '../models/models';
import { NavigationService } from './navigation.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  changeCart = new Subject();

  constructor(
    private navigationService: NavigationService,
    private jwt: JwtHelperService,
    private router: Router
  ) { }

  applyDiscount(price: number, discount: number): number {
    let finalPrice: number = price - price * (discount / 100);
    return finalPrice;
  }



  getUser(): User {
    let token = this.jwt.decodeToken();
    let user: User = {
      id: token.id,
      firstName: token.firstName,
      lastName: token.lastName,
      address: token.address,
      mobile: token.mobile,
      email: token.email,
      password: '',
      createdAt: token.createdAt,
      modifiedAt: token.modifiedAt,
      role: '',
    };
    return user;
  }

  setUser(token: string) {
    if (token == "Admin") {
      localStorage.setItem('Admin', token);
    }
    else {
      localStorage.setItem('user', token);
    }

  }

  isLoggedIn() {
    return localStorage.getItem('user') ? true : false;
  }

  isAdmin() {
    return localStorage.getItem('Admin') ? true : false;
  }

  logoutUser() {
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
    }
    if (localStorage.getItem('Admin')) {
      localStorage.removeItem('Admin');
    }

  }

  addToCart(product: Product) {
    let productid = product.id;
    let userid = this.getUser().id;
    // console.log(productid);

    this.navigationService.addToCart(userid, productid).subscribe((res) => {
      if (res.toString() === 'inserted') this.changeCart.next(1);
    });
  }


  deleteProduct(product: Product) {
    let productid = product.id;
    // console.log(productid);
    this.navigationService.deleteProduct(productid).subscribe((res) => {
      if (res.toString() === 'inserted') this.changeCart.next(1);
    });
  }

  calculatePayment(cart: Cart, payment: Payment) {
    payment.totalAmount = 0;
    payment.amountPaid = 0;
    payment.amountReduced = 0;

    for (let cartitem of cart.cartItems) {
      payment.totalAmount += cartitem.product.price;

      payment.amountReduced +=
        cartitem.product.price -
        this.applyDiscount(
          cartitem.product.price,
          cartitem.product.offer.discount
        );

      payment.amountPaid += this.applyDiscount(
        cartitem.product.price,
        cartitem.product.offer.discount
      );
    }

    if (payment.amountPaid > 50000) payment.shipingCharges = 2000;
    else if (payment.amountPaid > 20000) payment.shipingCharges = 1000;
    else if (payment.amountPaid > 5000) payment.shipingCharges = 500;
    else payment.shipingCharges = 200;
  }

  calculatePricePaid(cart: Cart) {
    let pricepaid = 0;
    for (let cartitem of cart.cartItems) {
      pricepaid += this.applyDiscount(
        cartitem.product.price,
        cartitem.product.offer.discount
      );
    }
    return pricepaid;
  }

  orderTheCart() {

  }

  deleteToCart(product: Product) {
    const productId = product.id;
    const userId = this.getUser().id;
    this.navigationService.deleteFromCart(userId, productId)
      .subscribe(
        () => {
          console.log('Item deleted successfully');
          this.router.navigate(['/cart']);
        },
        (error) => {
          console.error('Failed to delete item', error);
        }
      );
  }

  producttt : any;
  getProductById(){
    return this.producttt;
  }

  setProductById(producttt:Product){
    this.producttt = producttt;
  }
}
