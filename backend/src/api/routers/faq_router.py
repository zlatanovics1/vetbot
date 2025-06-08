from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import select
from src.api.deps import SessionDep
from src.rag.ingestion import ingest_data
from src.services.chat_engine import run_chat_engine_async, generate_streaming_response
from src.models.vetbot import DataChatstore, FaqRequest, Feedback, FeedbackRequest
import uuid

router = APIRouter(prefix="/faq")

@router.get("/test")
def test():
    return ingest_data();

# generate answer using pet care faq knowledge base
# id is used to track the conversation, if not provided, a new conversation is created
@router.post("/")
async def faq(request: FaqRequest, id: str | None = None):
    # streaming response
    conversation_id = id if id is not None else str(uuid.uuid4())

    streaming_response = await run_chat_engine_async(request.question, conversation_id)
    return StreamingResponse(
            generate_streaming_response(streaming_response, new_id = conversation_id if id is None else None), # can be simplified, but feel like this is easier to read :)
            media_type='text/event-stream',
            headers={
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no"
            }
        )

@router.post("/feedback")
def feedback(request: FeedbackRequest, session: SessionDep):
    # check if chat_id exists in the database
    chat = session.exec(select(DataChatstore).where(DataChatstore.key == request.chat_id)).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    feedback = Feedback(
        feedback=request.feedback,
        chat_id=request.chat_id
    )
    session.add(feedback)
    session.commit()
    session.refresh(feedback)
    return {"message": "Feedback received"}


# @router.get("/chat")
# def get_chat_history():
#     statement = text("SELECT value FROM data_chatstore where key = 'user1'")
#     chats = db.execute(statement).fetchone()
#     print(chats[0]);
#     return "lol"
