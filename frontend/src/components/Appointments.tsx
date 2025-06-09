"use client";
import { useState } from "react";
import { Appointment } from "@/types";
import AddAppointment from "./AddAppointment";
import WaitingList from "./WaitingList";

export default function Appointments({
  initialAppointments,
}: {
  initialAppointments: Appointment[];
}) {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const handleAddAppointment = (
    newAppointment: Omit<Appointment, "id" | "done">
  ) => {
    setAppointments([
      ...appointments,
      { ...newAppointment, id: appointments.length + 1, done: false },
    ]);
  };

  const handleReorder = (result: Appointment[]) => {
    setAppointments(result);
  };

  const handleMarkDone = (id: number) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, done: !appointment.done }
          : appointment
      )
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Clinic Waiting List</h1>

        <AddAppointment onSubmit={handleAddAppointment} />

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Today's Waiting List</h2>
          <WaitingList
            appointments={appointments}
            onReorder={handleReorder}
            handleMarkDone={handleMarkDone}
          />
        </div>
      </div>
    </div>
  );
}
