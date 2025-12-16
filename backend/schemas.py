from pydantic import BaseModel, Field

class Profile(BaseModel):
    subject: str = Field(min_length=1, max_length=100, description="Subject to study")
    goal: str = Field(min_length=1, max_length=200, description="Study goal")
    level: str = Field(min_length=1, max_length=50, description="Current level")
    time_per_day: int = Field(gt=0, le=24, description="Hours per day (1-24)")

class TutorRequest(BaseModel):
    question: str = Field(min_length=1, max_length=500)

class QuizRequest(BaseModel):
    subject: str = Field(min_length=1, max_length=100)
    level: str = Field(min_length=1, max_length=50)

class FlashcardRequest(BaseModel):
    subject: str = Field(min_length=1, max_length=100)
    level: str = Field(min_length=1, max_length=50)

class ContentBasedRequest(BaseModel):
    content: str = Field(min_length=10, max_length=5000)
