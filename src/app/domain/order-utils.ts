export type OrderView = 'tutti' | 'giorno' | 'da-evadere' | 'in-consegna';

export function normalizeText(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

export function getOrderStatus(order: any): string {
  return normalizeText(
    order?.stato ??
      order?.status ??
      order?.documentStatus ??
      order?.statoDocumento ??
      order?.orderStatus ??
      order?.salesHeaderStatus,
  );
}

export function getOrderDeliveryDate(order: any): Date | null {
  const value =
    order?.dataConsegnaPianificata ??
    order?.plannedDeliveryDate ??
    order?.dataConsegna ??
    order?.requestedDeliveryDate ??
    order?.promisedDeliveryDate ??
    order?.shipmentDate ??
    null;

  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) || date.getFullYear() <= 1 ? null : date;
}

export function getDisplayedDeliveryDate(order: any, lines: any[]): Date | null {
  const headerDate = getOrderDeliveryDate(order);
  if (headerDate) return headerDate;

  const orderNo = normalizeText(order?.numeroOrdine);
  for (const line of lines) {
    if (normalizeText(line?.numeroOrdine) !== orderNo) continue;
    const lineDate = getOrderDeliveryDate(line);
    if (lineDate) return lineDate;
  }

  return null;
}

function startOfDay(value: Date): number {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
}

export function isOrderOpen(order: any): boolean {
  const status = getOrderStatus(order);
  return status === 'open' || status === 'aperto';
}

export function isOrderForDay(order: any, today: Date): boolean {
  if (!order?.dataDocumento) return false;
  const documentDate = new Date(order.dataDocumento);
  return !Number.isNaN(documentDate.getTime()) && startOfDay(documentDate) === startOfDay(today);
}

export function isOrderInDelivery(order: any, lines: any[], today: Date): boolean {
  const deliveryDate = getDisplayedDeliveryDate(order, lines);
  return !!deliveryDate && startOfDay(deliveryDate) >= startOfDay(today);
}

export function filterOrders(
  orders: any[],
  lines: any[],
  view: OrderView,
  searchTerm = '',
  today = new Date(),
): any[] {
  let result = orders;

  if (view === 'giorno') {
    result = result.filter((order) => isOrderForDay(order, today));
  } else if (view === 'da-evadere') {
    result = result.filter(isOrderOpen);
  } else if (view === 'in-consegna') {
    result = result.filter((order) => isOrderInDelivery(order, lines, today));
  }

  const query = normalizeText(searchTerm);
  if (!query) return result;

  return result.filter((order) => {
    const deliveryDate = getDisplayedDeliveryDate(order, lines);
    const searchableText = [
      order?.numeroOrdine,
      order?.numeroCliente,
      order?.nomeCliente,
      order?.dataDocumento,
      deliveryDate ? deliveryDate.toLocaleDateString('it-IT') : '',
      order?.shipToAddress,
      order?.indirizzo,
      order?.shipToCity,
      order?.citta,
      getOrderStatus(order),
    ]
      .map(normalizeText)
      .join(' ');

    return searchableText.includes(query);
  });
}
