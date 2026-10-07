export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(rupees);
}

export function add(a: number, b: number): number {
  return a + b;
}

export function percentBp(paise: number, bp: number): number {
  return Math.round((paise * bp) / 10000);
}

export function roundOff(paise: number): number {
  return Math.round(paise);
}
