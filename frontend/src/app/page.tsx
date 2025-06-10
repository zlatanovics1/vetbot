import Appointments from "@/components/Appointments";
import { getAppointments } from "@/services/appointments";

export default async function Home() {
  const appointments = await getAppointments();
  return <Appointments initialAppointments={appointments} />;
}
