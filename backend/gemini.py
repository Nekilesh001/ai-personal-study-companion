import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key or not api_key.strip():
    raise ValueError("GEMINI_API_KEY environment variable is required and cannot be empty")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")

def ask_gemini(prompt: str) -> str:
    if not prompt or not prompt.strip():
        raise ValueError("Prompt cannot be empty")
    
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=4000,
                temperature=0.7
            )
        )
        if not response or not response.text:
            raise ValueError("Empty response from Gemini API")
        return response.text
    except ValueError:
        raise
    except Exception as e:
        raise RuntimeError(f"Failed to generate content: {str(e)}")
