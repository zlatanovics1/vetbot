import { Appointment, AppointmentResponse } from "@/types";
import { AppointmentFormData } from "@/schemas/appointment";
import { API_URL } from "@/consts";
import { handleError, sortAppointments } from "@/utils";

export const getAppointments = async () => {
  try {
    const response = await fetch(`${API_URL}/appointments`);
    const data = (await response.json()) as AppointmentResponse;
    console.log(data);
    if (!data.appointments.length) {
      return null;
    }
    return sortAppointments(data);
  } catch (error) {
    handleError(error);
    return null;
  }
};

export const addAppointment = async (appointment: AppointmentFormData) => {
  try {
    const response = await fetch(`${API_URL}/appointments`, {
      method: "POST",
      body: JSON.stringify(appointment),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return (await response.json()) as Appointment;
  } catch (error) {
    handleError(error);
  }
};

export const updateAppointment = async (
  id: number,
  appointment: Partial<Appointment>
) => {
  try {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(appointment),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    handleError(error);
  }
};

export const reorderAppointments = async (newOrder: number[]) => {
  console.log({ newOrder });
  try {
    const response = await fetch(`${API_URL}/appointments/order`, {
      method: "PUT",
      body: JSON.stringify({
        order: newOrder,
        date: new Date().toISOString().split("T")[0],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    handleError(error);
  }
};
