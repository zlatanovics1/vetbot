import { AppointmentResponse } from "./types";
import { toast } from "react-hot-toast";

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error);
    toast.error(error.message);
  } else {
    toast.error("An unknown error occurred");
  }
};

export const sortAppointments = (data: AppointmentResponse) => {
  const sortedAppointments = data.order.map(
    (id) => data.appointments.find((a) => a.id === id)!
  );
  return sortedAppointments;
};
