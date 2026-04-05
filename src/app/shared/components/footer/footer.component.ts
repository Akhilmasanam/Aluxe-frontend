import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>ALUXE</h3>
          <p class="tagline">Premium Fashion & Jewelry for the Modern Woman</p>
          <div class="social-links">
            <a href="#" title="Facebook">f</a>
            <a href="#" title="Instagram">📷</a>
            <a href="#" title="Twitter">𝕏</a>
          </div>
        </div>

        <div class="footer-section">
          <h4>Shop</h4>
          <ul>
            <li><a routerLink="/products">All Products</a></li>
            <li><a routerLink="/products?category=jewelry">Jewelry</a></li>
            <li><a routerLink="/products?category=sarees">Sarees</a></li>
            <li><a routerLink="/products?category=clothing">Clothing</a></li>
            <li><a routerLink="/products?category=beauty">Beauty</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Customer</h4>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Bulk Orders</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>About</h4>
          <ul>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Newsletter</h4>
          <p>Subscribe for exclusive offers</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Your email" />
            <button>→</button>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 ALUXE. All rights reserved.</p>
        <div class="payment-methods">
          <span>We accept:</span>
          <span>💳 💰 UPI</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%);
      color: white;
      margin-top: 4rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .footer-section {
      h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        font-weight: 700;
        letter-spacing: 1px;
      }

      h4 {
        font-size: 1.1rem;
        margin-bottom: 1rem;
        font-weight: 600;
        color: #ffd764;
      }

      p {
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.6;
      }
    }

    .tagline {
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;

      a {
        width: 40px;
        height: 40px;
        border: 1px solid #ffd764;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffd764;
        transition: all 200ms ease-out;
        font-weight: 600;

        &:hover {
          background: #ffd764;
          color: #1f1f1f;
          transform: translateY(-4px);
        }
      }
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        margin-bottom: 0.75rem;

        a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 200ms ease-out;

          &:hover {
            color: #ffd764;
          }
        }
      }
    }

    .newsletter-form {
      display: flex;
      margin-top: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      overflow: hidden;

      input {
        flex: 1;
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        font-size: 0.9rem;

        &::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        &:focus {
          outline: none;
        }
      }

      button {
        background: #ffd764;
        border: none;
        color: #1f1f1f;
        padding: 0.75rem 1.5rem;
        cursor: pointer;
        font-weight: 700;
        transition: background 200ms ease-out;

        &:hover {
          background: #d4a51e;
        }
      }
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;

      p {
        margin: 0;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;
      }
    }

    .payment-methods {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: rgba(255, 255, 255, 0.7);

      span:first-child {
        font-weight: 600;
      }
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `],
})
export class FooterComponent {}
