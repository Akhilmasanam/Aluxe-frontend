import { TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have four footer sections', () => {
    const sections = fixture.native.querySelectorAll('.footer-section');
    expect(sections.length).toBe(4);
  });

  it('should have footer-bottom with copyright text', () => {
    const footerBottom = fixture.nativeElement.querySelector('.footer-bottom');
    expect(footerBottom.textContent).toContain('ALUXE');
  });
});
