import { TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../../models';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: any;

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    category: 'jewelry',
    price: 100,
    discountPrice: 80,
    stock: 5,
    image: 'test.jpg',
    additionalImages: [],
    rating: 4.5,
    reviews: 10,
    isFeatured: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductCardComponent],
      imports: [
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product name', () => {
    const name = fixture.nativeElement.querySelector('.product-name');
    expect(name.textContent).toContain('Test Product');
  });

  it('should emit addToCart when onAddToCart is called', () => {
    spyOn(component.addToCart, 'emit');
    component.onAddToCart();
    expect(component.addToCart.emit).toHaveBeenCalled();
  });

  it('should show in-stock status when stock > 0', () => {
    const stockStatus = fixture.nativeElement.querySelector('.stock-status');
    expect(stockStatus.textContent).toContain('In Stock');
    expect(stockStatus.classList.contains('in-stock')).toBeTruthy();
  });
});
