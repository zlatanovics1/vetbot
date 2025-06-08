from enum import Enum as EnumType
from typing import List, Optional
from pgvector.sqlalchemy import Vector
from sqlmodel import SQLModel, Field, Column, ARRAY, Enum, Relationship, String, Index, JSON, BigInteger
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.dialects.postgresql import TSVECTOR
from pydantic import BaseModel
import datetime

class DataDocuments(SQLModel, table=True):
    __tablename__ = "data_documents"

    id: int = Field(default=None, sa_column=Column(BigInteger, autoincrement=True, primary_key=True))

    metadata_: Optional[dict] = Field(
        default=None,
        sa_column=Column(JSON, nullable=True)
    )

    embedding: List[float] = Field(default=None, sa_column=Column(Vector(1536)))

    text_search_tsv: Optional[str] = Field(
        default=None,
        sa_column=Column(TSVECTOR, nullable=True)
    )

    text: str = Field(
        sa_column=Column(String, nullable=False)
    )

    node_id: Optional[str] = Field(
        default=None,
        sa_column=Column(String, nullable=True)
    )

    __table_args__ = (
        Index(
            'ix_document_embedding',
            'embedding',
            postgresql_using='hnsw', # hnsw will slow down the insertions a bit, but will speed up the queries greatly - given the r/w ratio, this is a good trade-off
            postgresql_with={'m': 16, 'ef_construction': 64},
            postgresql_ops={'embedding': 'vector_cosine_ops'}
        ),
    )

# Schema that llamaindex uses to store the chat history
class DataChatstore(SQLModel, table=True):
    __tablename__ = "data_chatstore"

    id: int = Field(default=None, primary_key=True)
    key: str = Field(index=True, unique=True)
    value: Optional[List[str]] = Field(
        default_factory=List[str],
        sa_column=Column(MutableList.as_mutable(ARRAY(String)))
    )
    feedback: Optional["Feedback"] = Relationship(back_populates="chat", sa_relationship_kwargs={"uselist": False})

class FeedbackType(str, EnumType):
    positive = "positive"
    negative = "negative"

class Feedback(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    feedback: FeedbackType = Field(sa_column=Column(Enum(FeedbackType)))
    created_at: datetime.datetime = Field(default=datetime.datetime.now())
    chat_id: str = Field(foreign_key="data_chatstore.key")
    chat: Optional["DataChatstore"] = Relationship(back_populates="feedback")
    # can be further extended

# API requests
class FaqRequest(BaseModel):
    question: str

class FeedbackRequest(SQLModel):
    feedback: FeedbackType
    chat_id: str
