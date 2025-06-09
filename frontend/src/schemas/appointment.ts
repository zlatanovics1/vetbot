import { z } from "zod";

// could've been validated without zod, but this way we can use more complex validations in the future
export const appointmentSchema = z.object({
  pet_name: z.string().min(1, "Pet name is required"),
  owner_name: z.string().min(1, "Owner name is required"),
  requested_service: z.string().min(1, "Service is required"),
  // can not be in the past
  arrival_time: z
    .string()
    .min(1, "Arrival time is required")
    .refine((time) => {
      const now = new Date();
      const arrivalTime = new Date(time);
      return arrivalTime > now;
    }, "Arrival time must be in the future"),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
