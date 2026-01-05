export type ServiceType = "wash" | "dryclean" | "duvets";

export const servicesConfig: Record<ServiceType, {
  label: string;
  type: "weight" | "duvet";
  price: number;
}> = {
  wash: {
    label: "Wash",
    type: "weight",
    price: 5000,
  },
  dryclean: {
    label: "Dry Cleaning",
    type: "weight",
    price: 7000,
  },
  duvets: {
    label: "Duvets",
    type: "duvet",
    price: 12000,
  },
};
