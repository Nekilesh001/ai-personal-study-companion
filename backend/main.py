from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import Profile, TutorRequest, QuizRequest, FlashcardRequest, ContentBasedRequest
from gemini import ask_gemini

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.post("/study-plan")
def generate_study_plan(profile: Profile):
    try:
        # Additional validation
        if not all([profile.subject.strip(), profile.goal.strip(), profile.level.strip()]):
            raise HTTPException(status_code=400, detail="All fields must be non-empty")
        
        if profile.time_per_day <= 0 or profile.time_per_day > 24:
            raise HTTPException(status_code=400, detail="Time per day must be between 1 and 24 hours")
        
        prompt = f"""
        Create a comprehensive daily study plan without using asterisks or markdown formatting.
        
        Study Profile:
        - Subject: {profile.subject}
        - Goal: {profile.goal}
        - Current Level: {profile.level}
        - Available Time: {profile.time_per_day} hours per day
        
        Please provide a complete study plan with these sections:
        
        ## Daily Schedule ({profile.time_per_day} Hours)
        Break down the daily {profile.time_per_day} hours into specific time blocks.
        
        ## Weekly Learning Path
        Outline what to study each week.
        
        ## Key Topics to Master
        List important topics for {profile.subject}.
        
        ## Recommended Resources
        Suggest books, courses, and materials.
        
        ## Practice Strategy
        Describe practice methods.
        
        ## Progress Milestones
        Set weekly goals.
        
        ## Study Tips
        Provide specific advice.
        
        Use simple formatting: ## for main sections, ### for subsections, and - for bullet points. Do not use asterisks.
        """
        study_plan = ask_gemini(prompt)
        return {"study_plan": study_plan}
    except HTTPException:
        raise
    except ValueError as e:
        print(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        print(f"Runtime error: {e}")
        raise HTTPException(status_code=503, detail="Service temporarily unavailable. Please try again.")
    except Exception as e:
        print(f"Unexpected error generating study plan: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate study plan. Please try again.")

@app.post("/tutor")
def ask_tutor(request: TutorRequest):
    try:
        prompt = f"""
        You are an AI tutor. Answer this question clearly and concisely:
        
        Question: {request.question}
        
        Provide a helpful, educational answer that explains the concept step by step.
        Use simple language and include examples where appropriate.
        Do not use any markdown formatting, asterisks, or special characters.
        """
        answer = ask_gemini(prompt)
        # Clean the response
        clean_answer = answer.replace('**', '').replace('*', '').replace('```', '').replace('"""', '')
        return {"answer": clean_answer}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in tutor: {e}")
        raise HTTPException(status_code=500, detail="Failed to get answer. Please try again.")

@app.post("/quiz")
def generate_quiz(request: QuizRequest):
    try:
        prompt = f"""
        Create a quiz with 5 multiple choice questions about {request.subject} at {request.level} level.
        
        Format your response as a JSON array with this exact structure:
        [
          {{
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct": 0
          }}
        ]
        
        Make sure:
        - Questions are appropriate for {request.level} level
        - Each question has exactly 4 options
        - The correct answer index (0-3) is specified
        - Questions test understanding, not just memorization
        """
        response = ask_gemini(prompt)
        
        # Try to parse JSON response
        import json
        try:
            questions = json.loads(response)
            return {"questions": questions}
        except json.JSONDecodeError:
            # Fallback questions if JSON parsing fails
            fallback_questions = [
                {
                    "question": f"What is a fundamental concept in {request.subject}?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct": 0
                }
            ]
            return {"questions": fallback_questions}
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating quiz: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate quiz. Please try again.")

@app.post("/flashcards")
def generate_flashcards(request: FlashcardRequest):
    try:
        prompt = f"""
        Create 5 educational flashcards for {request.subject} at {request.level} level.
        
        Format your response as a JSON array with this exact structure:
        [
          {{
            "id": 1,
            "front": "Question or concept to learn",
            "back": "Detailed explanation or answer",
            "difficulty": "easy"
          }}
        ]
        
        Make sure:
        - Each flashcard has a clear question/concept on the front
        - The back has a comprehensive but concise explanation
        - Difficulty levels are: "easy", "medium", or "hard"
        - Content is appropriate for {request.level} level
        - Focus on key concepts in {request.subject}
        """
        response = ask_gemini(prompt)
        
        # Try to parse JSON response
        import json
        try:
            flashcards = json.loads(response)
            return {"flashcards": flashcards}
        except json.JSONDecodeError:
            # Fallback flashcards if JSON parsing fails
            fallback_flashcards = [
                {
                    "id": 1,
                    "front": f"What is a key concept in {request.subject}?",
                    "back": f"This is a fundamental concept in {request.subject} that you should understand.",
                    "difficulty": "easy"
                }
            ]
            return {"flashcards": fallback_flashcards}
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating flashcards: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate flashcards. Please try again.")

@app.post("/quiz-from-content")
def generate_quiz_from_content(request: ContentBasedRequest):
    try:
        if not request.content or len(request.content.strip()) < 10:
            raise HTTPException(status_code=400, detail="Content too short to generate quiz")
            
        # Clean content for better processing
        clean_content = request.content.replace('**', '').replace('*', '').strip()
        
        prompt = f"""
        Create 3 multiple choice questions based on this content. Return ONLY valid JSON:
        
        {clean_content[:1000]}
        
        Response format:
        [
          {{
            "question": "Clear question?",
            "options": ["A", "B", "C", "D"],
            "correct": 0
          }}
        ]
        """
        
        response = ask_gemini(prompt)
        
        import json
        import re
        
        # Extract JSON from response
        json_match = re.search(r'\[.*\]', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            try:
                questions = json.loads(json_str)
                if isinstance(questions, list) and len(questions) > 0:
                    return {"questions": questions}
            except json.JSONDecodeError:
                pass
        
        # Fallback questions
        fallback_questions = [
            {
                "question": "What is the main topic discussed?",
                "options": ["Topic A", "Topic B", "Topic C", "Topic D"],
                "correct": 0
            }
        ]
        return {"questions": fallback_questions}
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating quiz from content: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate quiz from content.")

@app.post("/flashcards-from-content")
def generate_flashcards_from_content(request: ContentBasedRequest):
    try:
        if not request.content or len(request.content.strip()) < 10:
            raise HTTPException(status_code=400, detail="Content too short to generate flashcards")
            
        # Clean content
        clean_content = request.content.replace('**', '').replace('*', '').strip()
        
        prompt = f"""
        Create 3 flashcards from this content. Return ONLY valid JSON:
        
        {clean_content[:1000]}
        
        Response format:
        [
          {{
            "id": 1,
            "front": "Question",
            "back": "Answer",
            "difficulty": "easy"
          }}
        ]
        """
        
        response = ask_gemini(prompt)
        
        import json
        import re
        
        # Extract JSON from response
        json_match = re.search(r'\[.*\]', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            try:
                flashcards = json.loads(json_str)
                if isinstance(flashcards, list) and len(flashcards) > 0:
                    return {"flashcards": flashcards}
            except json.JSONDecodeError:
                pass
        
        # Fallback flashcards
        fallback_flashcards = [
            {
                "id": 1,
                "front": "Key concept from content",
                "back": "Main explanation from the content",
                "difficulty": "medium"
            }
        ]
        return {"flashcards": fallback_flashcards}
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating flashcards from content: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate flashcards from content.")
