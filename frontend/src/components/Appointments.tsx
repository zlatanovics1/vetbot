"use client";
import { Appointment } from "@/types";
import AddAppointment from "./AddAppointment";
import WaitingList from "./WaitingList";
import { useAppointments } from "@/hooks/useAppointments";
import { toast } from "react-hot-toast";

export default function Appointments({
  initialAppointments,
}: {
  initialAppointments: Appointment[] | null;
}) {
  const {
    appointmentsData,
    addAppointmentMutation,
    updateAppointmentMutation,
    reorderAppointmentsMutation,
  } = useAppointments(initialAppointments);

  const handleAddAppointment = (
    newAppointment: Omit<Appointment, "id" | "done">
  ) => {
    toast.loading("Adding appointment...", {
      id: "add-appointment",
    });
    addAppointmentMutation.mutate(newAppointment, {
      onSuccess: () => {
        toast.success("Appointment added successfully", {
          id: "add-appointment",
        });
      },
      onError: () => {
        toast.error("Failed to add appointment", {
          id: "add-appointment",
        });
      },
    });
  };

  const handleReorder = (result: Appointment[]) => {
    const ids = result.map((appointment) => appointment.id);
    if (result.every((el, i) => el.id === appointmentsData![i].id)) return;
    reorderAppointmentsMutation.mutate(ids);
  };

  const handleMarkDone = (id: number) => {
    toast.loading("Updating appointment...", {
      id: "update-appointment",
    });
    updateAppointmentMutation.mutate(
      { id, data: { done: true } },
      {
        onSuccess: () => {
          toast.success("Appointment updated successfully", {
            id: "update-appointment",
          });
        },
        onError: () => {
          toast.error("Failed to update appointment", {
            id: "update-appointment",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Clinic Waiting List</h1>

        <AddAppointment onSubmit={handleAddAppointment} />

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Today's Waiting List</h2>
          {appointmentsData ? (
            <WaitingList
              appointments={appointmentsData}
              onReorder={handleReorder}
              handleMarkDone={handleMarkDone}
            />
          ) : (
            <p className="text-gray-500">No appointments for today :)</p>
          )}
        </div>
      </div>
    </div>
  );
}
