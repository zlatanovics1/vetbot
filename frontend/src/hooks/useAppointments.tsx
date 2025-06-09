import { Appointment } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAppointment,
  getAppointments,
  reorderAppointments,
  updateAppointment,
} from "@/services/appointments";

export const useAppointments = (initialAppointments: Appointment[] | null) => {
  const queryClient = useQueryClient();

  const { data: appointmentsData } = useQuery<Appointment[] | null>({
    queryKey: ["appointments"],
    queryFn: getAppointments,
    initialData: initialAppointments,
  });

  const addAppointmentMutation = useMutation({
    mutationFn: addAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Appointment> }) =>
      updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  // optimistic update that causes much less flickering, although a pretty small ui lag can be noticed still
  const reorderAppointmentsMutation = useMutation({
    mutationFn: reorderAppointments,
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });

      // snapshot - just in case we need to roll back
      const previousAppointments = queryClient.getQueryData(["appointments"]);

      queryClient.setQueryData(
        ["appointments"],
        (old: Appointment[] | null) => {
          if (!old) return null;
          return newOrder.map((id) => old.find((app) => app.id === id)!);
        }
      );

      return { previousAppointments };
    },
    onError: (err, newOrder, context) => {
      // if the mutation fails, roll back to the previous value
      if (context?.previousAppointments) {
        queryClient.setQueryData(
          ["appointments"],
          context.previousAppointments
        );
      }
    },
    onSettled: () => {
      // establishing sync
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    appointmentsData,
    addAppointmentMutation,
    updateAppointmentMutation,
    reorderAppointmentsMutation,
  };
};
