import { describe, expect, it } from 'vitest';
import { OrdineVenditaComponent } from './ordine-vendita';

describe('OrdineVenditaComponent totals', () => {
  it('calcola il totale dell ordine usando prezzo e quantità di ogni riga', () => {
    const component = new OrdineVenditaComponent({} as any, {} as any, {} as any);
    component.prodotti = [
      { id: 'A', prezzoUnitario: 10 },
      { id: 'B', prezzoUnitario: 7.5 },
    ];
    component.righeOrdine = [
      { productId: 'A', quantity: 2 },
      { productId: 'B', quantity: 3 },
    ];

    expect(component.getTotaleOrdine()).toBe(42.5);
  });
});
