import { Timestamp } from "firebase/firestore";

export type OrderStatus =
  | "queued"
  | "processing"
  | "waiting_payment"
  | "payment_review"
  | "paid"
  | "payment_failed";

export type Order = {
  id: string;
  userId: string;

  name: string;
  phone?: string;
  address?: string;

  service: string;
  serviceLabel?: string;

  weight: number;
  totalPrice: number;

  status: OrderStatus;

  paymentProofUrl?: string;
  paymentNote?: string;

  createdAt: Timestamp;
};