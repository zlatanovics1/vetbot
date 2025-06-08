# ## Database Models
# class Document(SQLModel, table=True):
#     id: int = Field(default=None, primary_key=True)
#     content:str
#     embedding: List[float] = Field(default=None, sa_column=Column(Vector(1536)))
#     __table_args__ = (
#         Index(
#             'ix_document_embedding',
#             'embedding',
#             postgresql_using='hnsw', # hnsw will slow down the insertions, but will speed up the queries greatly - since data is static, this is a good trade-off
#             postgresql_with={'m': 16, 'ef_construction': 64},
#             postgresql_ops={'embedding': 'vector_l2_ops'}
#         ),
#     )
#     # metadata: dict[str, Any] - possible future enhancement (e.g. {animal:"dog"})

from enum import Enum
from typing import List, Optional
from sqlmodel import SQLModel, Field, Column, ARRAY, Enum, Relationship
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableList
from pydantic import BaseModel
import datetime

# Schema that llamaindex uses to store the chat history
class DataChatstore(SQLModel, table=True):
    __tablename__ = "data_chatstore"

    id: int = Field(default=None, primary_key=True)
    key: str
    value: Optional[List[dict]] = Field(default=None, sa_column=Column(MutableList.as_mutable(ARRAY(JSONB))))
    feedback: Optional["Feedback"] = Relationship(back_populates="chat", sa_relationship_kwargs={"uselist": False})

class FeedbackType(str, Enum):
    positive = "positive"
    negative = "negative"

class Feedback(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    feedback: FeedbackType =  Field(sa_column=Column(Enum(FeedbackType)))
    created_at: datetime.datetime = Field(default=datetime.datetime.now())
    chat_id: int = Field(foreign_key="data_chatstore.id")
    chat: Optional["DataChatstore"] = Relationship(back_populates="feedback")
    # can be further extended

# API
class FaqRequest(BaseModel):
    question: str

