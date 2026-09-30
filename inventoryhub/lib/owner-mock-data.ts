// Temporary mock data for the (owner) section, shared by the dashboard and
// all report pages so they show consistent numbers.
//
// Swap-in point for the real API: once /api/inventory/dashboard,
// /api/reports/stock-status, /api/reports/low-stock, and a transaction
// history endpoint exist, replace the bodies of getProducts() and
// getTransactions() with real fetch() calls (or a server-side db call if
// these become Server Components). Everything downstream (the report pages)
// consumes the Product/Transaction shapes below, so as long as the real API
// returns matching fields, the pages themselves shouldn't need to change.

export type Product = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  restockLevel: number;
};

export type TransactionType = "stock_adjustment" | "restock" | "physical_count";

export type Transaction = {
  id: number;
  productName: string;
  sku: string;
  transactionType: TransactionType;
  previousQuantity: number;
  newQuantity: number;
  quantityChange: number;
  reason: string;
  employeeName: string;
  timestamp: string; // ISO 8601
};

export function getProducts(): Product[] {
  return [
    { id: 1, name: "Widget A", sku: "WID-A", quantity: 5, price: 10, restockLevel: 10 },
    { id: 2, name: "Widget B", sku: "WID-B", quantity: 20, price: 15, restockLevel: 10 },
    { id: 3, name: "Widget C", sku: "WID-C", quantity: 2, price: 8, restockLevel: 5 },
    { id: 4, name: "Widget D", sku: "WID-D", quantity: 50, price: 3, restockLevel: 15 },
    { id: 5, name: "Widget E", sku: "WID-E", quantity: 7, price: 22, restockLevel: 8 },
  ];
}

export function getLowStockProducts(products: Product[] = getProducts()): Product[] {
  return products.filter((p) => p.quantity < p.restockLevel);
}

export function getTotalStockValue(products: Product[] = getProducts()): number {
  return products.reduce((sum, p) => sum + p.quantity * p.price, 0);
}

export function getTransactions(): Transaction[] {
  return [
    {
      id: 1,
      productName: "Widget A",
      sku: "WID-A",
      transactionType: "stock_adjustment",
      previousQuantity: 8,
      newQuantity: 5,
      quantityChange: -3,
      reason: "Sold at register",
      employeeName: "Jamie Lee",
      timestamp: "2026-09-25T14:32:00Z",
    },
    {
      id: 2,
      productName: "Widget B",
      sku: "WID-B",
      transactionType: "restock",
      previousQuantity: 5,
      newQuantity: 20,
      quantityChange: 15,
      reason: "Weekly restock delivery",
      employeeName: "Morgan Diaz",
      timestamp: "2026-09-24T09:15:00Z",
    },
    {
      id: 3,
      productName: "Widget C",
      sku: "WID-C",
      transactionType: "physical_count",
      previousQuantity: 4,
      newQuantity: 2,
      quantityChange: -2,
      reason: "Physical count correction",
      employeeName: "Jamie Lee",
      timestamp: "2026-09-23T16:47:00Z",
    },
    {
      id: 4,
      productName: "Widget D",
      sku: "WID-D",
      transactionType: "restock",
      previousQuantity: 30,
      newQuantity: 50,
      quantityChange: 20,
      reason: "Supplier delivery",
      employeeName: "Taylor Kim",
      timestamp: "2026-09-20T11:05:00Z",
    },
    {
      id: 5,
      productName: "Widget E",
      sku: "WID-E",
      transactionType: "stock_adjustment",
      previousQuantity: 10,
      newQuantity: 7,
      quantityChange: -3,
      reason: "Damaged units removed",
      employeeName: "Morgan Diaz",
      timestamp: "2026-09-18T13:22:00Z",
    },
  ];
}