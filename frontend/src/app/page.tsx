import Appointments from "@/components/Appointments";
import { Appointment } from "@/types";

const mockAppointments: Appointment[] = [
  {
    id: 1,
    pet_name: "Buddy",
    owner_name: "Mary Smith",
    requested_service: "Vaccination",
    arrival_time: new Date().toISOString(),
    done: true,
  },
  {
    id: 2,
    pet_name: "Buddy",
    owner_name: "John Doe",
    requested_service: "Vaccination",
    arrival_time: new Date().toISOString(),
    done: false,
  },
];

export default function Home() {
  return <Appointments initialAppointments={mockAppointments} />;
}
