import datetime
from typing import List
from sqlmodel import Field, SQLModel, Column, ARRAY, Integer
from sqlalchemy.ext.mutable import MutableList


class Appointment(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    pet_name: str
    owner_name: str
    requested_service: str
    arrival_time: datetime.datetime
    done: bool = Field(default=False)

class AppointmentsOrder(SQLModel, table=True):
    # date without time (e.g. 2025-06-08) - storing daily lists of appointments
    date: datetime.date = Field(default=None, primary_key=True)
    # trade-off, we lose the ability to have a hard constraint that all the elements are valid ids
    order: List[int] = Field(
        default_factory=List[int],
        sa_column=Column(MutableList.as_mutable(ARRAY(Integer)))
    )

## API Models
class AppointmentRequest(SQLModel):
    pet_name: str
    owner_name: str
    requested_service: str
    arrival_time: datetime.datetime

class UpdateAppointmentRequest(SQLModel):
    done: bool
    
class ReorderAppointmentsRequest(SQLModel):
    order: List[int]
    date: datetime.date | None = None # if not provided, the current date is used

