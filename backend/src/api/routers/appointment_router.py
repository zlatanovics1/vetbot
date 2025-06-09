import datetime
from fastapi import APIRouter, HTTPException
from src.api.deps import SessionDep
from src.models.common import Appointment, AppointmentRequest, AppointmentsOrder, ReorderAppointmentsRequest, UpdateAppointmentRequest
from sqlmodel import select

router = APIRouter(prefix="/appointments")

# for the sake of less confusion, since we need both datetime and datetime.datetime
date = datetime.datetime

@router.get("/")
def get_appointments(session: SessionDep):
    today = date.now(datetime.timezone.utc).date()
    start_of_day = date.combine(today, date.min.time())
    end_of_day = start_of_day + datetime.timedelta(days=1)
    order_for_date = session.exec(select(AppointmentsOrder).where(AppointmentsOrder.date == today)).first()

    if not order_for_date:
        return {"appointments": [], "order": []}

    appointments_for_curr_date = session.exec(select(Appointment).where(
        Appointment.arrival_time >= start_of_day,
        Appointment.arrival_time < end_of_day
    )).all()
    return {"appointments": appointments_for_curr_date,"order": order_for_date.order}

@router.post("/")
def create_appointment(appointment: AppointmentRequest, session: SessionDep):
    # convert to utc time, much easier to work with in the database (no timezone issues) and easy to convert back to local time on the frontend
    utc_time = appointment.arrival_time.replace(tzinfo=datetime.timezone.utc)
    # get the date without time for the appointment order
    date = utc_time.date()
    del appointment.arrival_time # we will use utc time in the database

    appointment = Appointment(**appointment.model_dump(), arrival_time=utc_time)
    session.add(appointment)
    session.commit()
    session.refresh(appointment)

    order_for_date = session.exec(select(AppointmentsOrder).where(AppointmentsOrder.date == date)).first()
    if not order_for_date:
        order_for_date = AppointmentsOrder(date=date, order=[appointment.id])
        session.add(order_for_date)
    else:
        order_for_date.order.append(appointment.id)
    session.commit()
    session.refresh(order_for_date)
    return appointment

@router.put("/order")
def reorder_appointments(request: ReorderAppointmentsRequest, session: SessionDep):
    print("Received request:", request.model_dump())
    today = request.date if request.date else date.now(datetime.timezone.utc).date()
    print("Using date:", today)
    order_for_date = session.exec(select(AppointmentsOrder).where(AppointmentsOrder.date == today)).first()
    if not order_for_date:
        raise HTTPException(status_code=404, detail="Appointments order not found")
    
    order_for_date.order = request.order
    session.commit()
    session.refresh(order_for_date)
    return order_for_date

@router.put("/{appointment_id}")
def update_appointment(appointment_id: int, updatedAppointment: UpdateAppointmentRequest, session: SessionDep):
    appointment = session.get(Appointment, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    # no hardcoded field, so we can add new update fields in the future
    for key, value in updatedAppointment.model_dump().items():
        setattr(appointment, key, value)
    
    session.commit()
    session.refresh(appointment)
    return appointment