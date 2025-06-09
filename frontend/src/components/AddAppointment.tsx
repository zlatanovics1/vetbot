import { Appointment } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  appointmentSchema,
  type AppointmentFormData,
} from "@/schemas/appointment";

export default function AddAppointment({
  onSubmit,
}: {
  onSubmit: (newAppointment: Omit<Appointment, "id" | "done">) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-lg shadow-md mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">Add New Appointment</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pet Name
          </label>
          <input
            type="text"
            {...register("pet_name")}
            className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.pet_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.pet_name.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Owner Name
          </label>
          <input
            type="text"
            {...register("owner_name")}
            className="mt-1 block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.owner_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.owner_name.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Service
          </label>
          <input
            type="text"
            {...register("requested_service")}
            className="mt-1 block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.requested_service && (
            <p className="mt-1 text-sm text-red-600">
              {errors.requested_service.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Arrival Time
          </label>
          <input
            type="datetime-local"
            {...register("arrival_time")}
            className="mt-1 block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.arrival_time && (
            <p className="mt-1 text-sm text-red-600">
              {errors.arrival_time.message}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Appointment
      </button>
    </form>
  );
}
