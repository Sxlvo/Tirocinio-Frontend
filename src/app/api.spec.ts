import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { ApiService } from './api';

describe('ApiService product visibility', () => {
  it('carica tutto il catalogo quando allItems è true', () => {
    const service = new ApiService({} as any, {} as any);
    const allProducts = vi.spyOn(service, 'getProdotti').mockReturnValue(of({ value: [] }));
    const assignedProducts = vi
      .spyOn(service, 'getProdottiByAgente')
      .mockReturnValue(of({ value: [] }));

    service.getProdottiVisibili('AM', true);

    expect(allProducts).toHaveBeenCalledOnce();
    expect(assignedProducts).not.toHaveBeenCalled();
  });

  it('carica solo gli articoli assegnati quando allItems è false', () => {
    const service = new ApiService({} as any, {} as any);
    const allProducts = vi.spyOn(service, 'getProdotti').mockReturnValue(of({ value: [] }));
    const assignedProducts = vi
      .spyOn(service, 'getProdottiByAgente')
      .mockReturnValue(of({ value: [] }));

    service.getProdottiVisibili('AM', false);

    expect(assignedProducts).toHaveBeenCalledWith('AM');
    expect(allProducts).not.toHaveBeenCalled();
  });
});
