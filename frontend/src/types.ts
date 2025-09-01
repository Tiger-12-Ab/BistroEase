export interface Dish {
  id: number;
  title: string;
  short_description: string;
  description: string;
  category: string;
  image_url: string | null;
  price: number;
}

export interface CartItem {
  id: number;
  dish_id: number;
  quantity: number;
  price_each: number;
  title?: string;
  image_url?: string | null;
}
