import { Appointment } from "@/types";
import { formatDateTime } from "@/utils";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  DropResult,
} from "@hello-pangea/dnd";

interface WaitingListProps {
  appointments: Appointment[];
  onReorder: (result: Appointment[]) => void;
  handleMarkDone: (id: number) => void;
}

export default function WaitingList({
  appointments,
  onReorder,
  handleMarkDone,
}: WaitingListProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(appointments);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="appointments">
        {(provided: DroppableProvided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {appointments.map((appointment, index) => (
              <Draggable
                key={appointment.id}
                draggableId={appointment.id.toString()}
                index={index}
              >
                {(provided: DraggableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-4 mb-2 rounded-md ${
                      appointment.done ? "bg-green-50" : "bg-white"
                    } border border-gray-200`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{appointment.pet_name}</h3>
                        <p className="text-sm text-gray-600">
                          Owner: {appointment.owner_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Service: {appointment.requested_service}
                        </p>
                        <p className="text-sm text-gray-600">
                          Arrival: {formatDateTime(appointment.arrival_time)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleMarkDone(appointment.id)}
                        className={`px-3 py-1 rounded-md cursor-pointer ${
                          appointment.done
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appointment.done ? "Done" : "Mark Done"}
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
