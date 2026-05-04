import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProdottiComponent } from './prodotti';
import { ApiService } from '../../api';

describe('Prodotti', () => {
  let component: ProdottiComponent;
  let fixture: ComponentFixture<ProdottiComponent>;
  const apiMock = {
    getProdotti: vi.fn(() => of({ value: [] })),
  };

  beforeEach(async () => {
    apiMock.getProdotti.mockClear();

    await TestBed.configureTestingModule({
      imports: [ProdottiComponent],
      providers: [{ provide: ApiService, useValue: apiMock }],
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
