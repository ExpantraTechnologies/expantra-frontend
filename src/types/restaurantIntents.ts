export type RestaurantIntentType = 'order' | 'reservation' | 'question';

export interface BaseIntentPayload {
  business_id: string;
  language: 'en' | 'es';
}

export interface OrderItemModifier {
  name: string;
  type?: 'add' | 'remove' | 'size' | 'other';
}

export interface OrderItemPayload {
  menu_item_name: string;
  qty: number;
  modifiers?: OrderItemModifier[];
  notes?: string;
}

export interface OrderIntentPayload extends BaseIntentPayload {
  type: 'order';
  mode: 'pickup' | 'delivery' | 'dine_in';
  items: OrderItemPayload[];
  scheduled_time?: string; // ISO or "asap"
  customer_name: string;
  customer_phone: string;
}

export interface ReservationIntentPayload extends BaseIntentPayload {
  type: 'reservation';
  date: string;
  time: string;
  party_size: number;
  customer_name: string;
  customer_phone: string;
  notes?: string;
}

export interface QuestionIntentPayload extends BaseIntentPayload {
  type: 'question';
  question_type: 'ingredient' | 'allergen' | 'diet' | 'basic_info';
  menu_item_name?: string;
  allergen_type?: string;
  diet_type?: string;
  raw_question: string;
}

export type RestaurantIntentPayload =
  | OrderIntentPayload
  | ReservationIntentPayload
  | QuestionIntentPayload;
