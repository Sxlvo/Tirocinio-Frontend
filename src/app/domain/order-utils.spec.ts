import { describe, expect, it } from 'vitest';
import { filterOrders, getDisplayedDeliveryDate } from './order-utils';

describe('order-utils', () => {
  const today = new Date(2026, 5, 22);
  const orders = [
    { numeroOrdine: '100', stato: 'Open', dataDocumento: '2026-06-22' },
    { numeroOrdine: '101', stato: 'Released', dataDocumento: '2026-06-22' },
    { numeroOrdine: '102', stato: 'Aperto', dataDocumento: '2026-06-21' },
  ];

  it('mostra negli ordini da evadere solo gli ordini aperti', () => {
    const result = filterOrders(orders, [], 'da-evadere', '', today);
    expect(result.map((order) => order.numeroOrdine)).toEqual(['100', '102']);
  });

  it('esclude gli ordini rilasciati dagli ordini da evadere', () => {
    const result = filterOrders(orders, [], 'da-evadere', '', today);
    expect(result.some((order) => order.stato === 'Released')).toBe(false);
  });

  it('include in consegna una data uguale a oggi', () => {
    const result = filterOrders(
      [{ numeroOrdine: '200', dataConsegnaPianificata: '2026-06-22' }],
      [],
      'in-consegna',
      '',
      today,
    );
    expect(result).toHaveLength(1);
  });

  it('usa la data di consegna della riga quando manca sulla testata', () => {
    const order = { numeroOrdine: '201' };
    const lines = [{ numeroOrdine: '201', dataConsegnaPianificata: '2026-06-25' }];
    expect(getDisplayedDeliveryDate(order, lines)?.getDate()).toBe(25);
  });

  it('filtra gli ordini del giorno rispetto alla data fornita', () => {
    const result = filterOrders(orders, [], 'giorno', '', today);
    expect(result.map((order) => order.numeroOrdine)).toEqual(['100', '101']);
  });
});
