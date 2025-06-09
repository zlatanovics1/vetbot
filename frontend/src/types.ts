export interface Appointment {
  id: number;
  pet_name: string;
  owner_name: string;
  requested_service: string;
  arrival_time: string; // In ISO format
  done: boolean;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface AppointmentOrder {
  order: number[];
  date: string;
}

export interface AppointmentResponse {
  appointments: Appointment[];
  order: AppointmentOrder;
}
