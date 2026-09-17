export type MenuItem = {
  id: string;
  name: { en: string; hi: string; mr: string };
  description: { en: string; hi: string; mr: string };
  price: number;
  categoryId: string;
  isVeg: boolean;
  isAvailable: boolean;
  imageUrl?: string;
};

export type MenuCategory = {
  id: string;
  name: { en: string; hi: string; mr: string };
  sortOrder: number;
};

export type Order = {
  id: string;
  status: 'PENDING' | 'PREPARING' | 'SERVED' | 'COMPLETED';
  tableNumber: string;
  customerPhone: string;
  items: { menuItemId: string; quantity: number; price: number }[];
  total: number;
  paymentMode: 'CASH' | 'UPI' | 'CARD';
  createdAt: string;
};

export const MOCK_CATEGORIES: MenuCategory[] = [
  { id: 'cat_1', name: { en: 'Starters', hi: 'स्टार्टर्स', mr: 'स्टार्टर्स' }, sortOrder: 1 },
  { id: 'cat_2', name: { en: 'Mains', hi: 'मुख्य कोर्स', mr: 'मुख्य कोर्स' }, sortOrder: 2 },
  { id: 'cat_3', name: { en: 'Beverages', hi: 'पेय', mr: 'पेय' }, sortOrder: 3 },
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item_1',
    name: { en: 'Paneer Tikka', hi: 'पनीर टिक्का', mr: 'पनीर टिक्का' },
    description: { en: 'Spicy grilled paneer', hi: 'मसालेदार ग्रिल्ड पनीर', mr: 'मसालेदार ग्रिल्ड पनीर' },
    price: 220,
    categoryId: 'cat_1',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: 'item_2',
    name: { en: 'Chicken Kebab', hi: 'चिकन कबाब', mr: 'चिकन कबाब' },
    description: { en: 'Juicy chicken kebabs', hi: 'रसीले चिकन कबाब', mr: 'रसाळ चिकन कबाब' },
    price: 280,
    categoryId: 'cat_1',
    isVeg: false,
    isAvailable: true,
  },
  {
    id: 'item_3',
    name: { en: 'Butter Chicken', hi: 'बटर चिकन', mr: 'बटर चिकन' },
    description: { en: 'Creamy tomato gravy', hi: 'क्रीमी टमाटर ग्रेवी', mr: 'क्रीमी टोमॅटो ग्रेव्ही' },
    price: 350,
    categoryId: 'cat_2',
    isVeg: false,
    isAvailable: true,
  },
  {
    id: 'item_4',
    name: { en: 'Dal Tadka', hi: 'दाल तड़का', mr: 'डाळ तडका' },
    description: { en: 'Yellow lentils with temper', hi: 'तड़के वाली पीली दाल', mr: 'तडका दिलेली पिवळी डाळ' },
    price: 180,
    categoryId: 'cat_2',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: 'item_5',
    name: { en: 'Masala Chaas', hi: 'मसाला छाछ', mr: 'मसाला ताक' },
    description: { en: 'Spiced buttermilk', hi: 'मसालेदार छाछ', mr: 'मसालेदार ताक' },
    price: 50,
    categoryId: 'cat_3',
    isVeg: true,
    isAvailable: true,
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    status: 'PENDING',
    tableNumber: '4',
    customerPhone: '9876543210',
    items: [
      { menuItemId: 'item_1', quantity: 2, price: 220 },
      { menuItemId: 'item_5', quantity: 2, price: 50 },
    ],
    total: 540,
    paymentMode: 'UPI',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'ORD-002',
    status: 'PREPARING',
    tableNumber: '2',
    customerPhone: '8765432109',
    items: [
      { menuItemId: 'item_3', quantity: 1, price: 350 },
    ],
    total: 350,
    paymentMode: 'CASH',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
];
