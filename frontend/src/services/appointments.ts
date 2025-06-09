import { Appointment, AppointmentResponse } from "@/types";
import { AppointmentFormData } from "@/schemas/appointment";
import { API_URL } from "@/consts";
import { handleError } from "@/utils";

export const getAppointments = async () => {
  try {
    const response = await fetch(`${API_URL}/appointments`);
    return (await response.json()) as AppointmentResponse;
  } catch (error) {
    handleError(error);
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
  appointment: Partial<AppointmentFormData>
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
  try {
    const response = await fetch(`${API_URL}/appointments/reorder`, {
      method: "POST",
      body: JSON.stringify({ newOrder }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    handleError(error);
  }
};
