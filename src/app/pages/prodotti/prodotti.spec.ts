import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdottiComponent } from './prodotti';

describe('Prodotti', () => {
  let component: ProdottiComponent;
  let fixture: ComponentFixture<ProdottiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdottiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdottiComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
