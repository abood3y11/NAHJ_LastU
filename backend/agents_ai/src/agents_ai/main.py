#!/usr/bin/env python
import os
os.environ["CREWAI_TELEMETRY"] = "disabled"
os.environ["OTEL_SDK_DISABLED"] = "true"
import sys
import warnings
import traceback
import re
from datetime import datetime
from fastapi import FastAPI, HTTPException, Request
import json
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

app = FastAPI()

# Configure CORS - Make sure this is correctly set up
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LectureRequest(BaseModel):
    lecture_title: str
    course_name: str

# Add the correct path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
src_dir = os.path.join(os.path.dirname(current_dir), "src")
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

# Import the AgentsAi class with error handling
try:
    from agents_ai.agents_ai.crew import AgentsAi
    logger.info("Successfully imported AgentsAi")
except ImportError as e:
    logger.error(f"Error importing AgentsAi: {str(e)}")
    logger.error(f"Python path: {sys.path}")
    
    # Define a fallback class for testing
    class AgentsAi:
        def crew(self):
            class MockCrew:
                def kickoff(self, inputs):
                    class MockResult:
                        class MockTaskOutput:
                            def __init__(self, content):
                                self.raw = content
                        
                        def __init__(self, lecture_title, course_name):
                            # Use the lecture_title and course_name to create custom questions
                            self.tasks_output = [
                                self.MockTaskOutput("First task output"),
                                self.MockTaskOutput(self.generate_questions(lecture_title, course_name))
                            ]
                        
                        def generate_questions(self, lecture_title, course_name):
                            # This method creates custom questions based on the lecture and course
                            if "python" in lecture_title.lower() or "python" in course_name.lower():
                                return json.dumps([
                                    "Explain the key features of Python that make it popular for beginners.",
                                    "How does Python handle variable declarations differently from languages like Java or C++?",
                                    "Describe the difference between lists and tuples in Python.",
                                    "What are Python modules and packages? How do they help with code organization?",
                                    "Explain how exception handling works in Python with try/except blocks."
                                ])
                            elif "machine learning" in lecture_title.lower() or "machine learning" in course_name.lower():
                                return json.dumps([
                                    "What is machine learning and how does it differ from traditional programming?",
                                    "Explain the difference between supervised and unsupervised learning.",
                                    "What is the purpose of splitting data into training and test sets?",
                                    "Describe the concept of overfitting and how to prevent it.",
                                    "What are some common evaluation metrics for machine learning models?"
                                ])
                            elif "neural" in lecture_title.lower() or "deep learning" in course_name.lower():
                                return json.dumps([
                                    "Explain the basic structure of a neural network.",
                                    "What is the role of activation functions in neural networks?",
                                    "How do convolutional neural networks (CNNs) differ from regular neural networks?",
                                    "What is backpropagation and why is it important for training neural networks?",
                                    "Describe the concept of transfer learning in deep learning."
                                ])
                            elif "data" in lecture_title.lower() or "analytics" in course_name.lower():
                                return json.dumps([
                                    "What are the key steps in a typical data analysis workflow?",
                                    "Explain the difference between descriptive and inferential statistics.",
                                    "How do you handle missing data in a dataset?",
                                    "What is feature engineering and why is it important?",
                                    "Describe different visualization techniques and when you would use each one."
                                ])
                            else:
                                # Default questions if topic doesn't match any specific categories
                                return json.dumps([
                                    f"Explain the core concepts of {lecture_title}.",
                                    f"How does {lecture_title} relate to other topics in {course_name}?",
                                    f"What are the practical applications of {lecture_title}?",
                                    f"Describe the challenges students often face when learning about {lecture_title}.",
                                    f"How has the field of {lecture_title} evolved over time?"
                                ])
                                
                    return MockResult(inputs['lecture_title'], inputs['course_name'])
            return MockCrew()
    logger.warning("Using mock AgentsAi class")

@app.get("/")
async def root():
    return {"message": "Quiz Generator API is running"}

@app.get("/test-generate-quiz")
async def test_endpoint():
    # Test data
    test_data = {
        "lecture_title": "Introduction to Machine Learning",
        "course_name": "Computer Science 101",
    }
    
    try:
        inputs = {
            'lecture_title': test_data["lecture_title"],
            'course_name': test_data["course_name"]
        }
        
        logger.info(f"Testing with inputs: {inputs}")
        
        # Get crew instance
        try:
            crew = AgentsAi().crew()
            logger.info("Successfully created crew instance")
        except Exception as crew_error:
            logger.error(f"Error creating crew: {str(crew_error)}")
            logger.error(traceback.format_exc())
            raise
        
        # Execute the crew process
        try:
            result = crew.kickoff(inputs=inputs)
            logger.info("Successfully executed crew process")
        except Exception as kickoff_error:
            logger.error(f"Error during kickoff: {str(kickoff_error)}")
            logger.error(traceback.format_exc())
            raise
        
        # More detailed logging of result structure
        logger.debug(f"Result type: {type(result).__name__}")
        logger.debug(f"Result dir: {dir(result)}")
        
        try:
            logger.debug(f"Tasks output: {result.tasks_output}")
            
            # Access the second task's output (index 1)
            question_task_output = result.tasks_output[1]
            
            # Try different ways to access the content
            if hasattr(question_task_output, 'raw_output'):
                raw_questions = question_task_output.raw_output
            elif hasattr(question_task_output, 'raw'):
                raw_questions = question_task_output.raw
            elif hasattr(question_task_output, 'output'):
                raw_questions = question_task_output.output
            else:
                # If we can't find the output, convert the whole object to string
                raw_questions = str(question_task_output)
                
            logger.info(f"Raw questions: {raw_questions}")
            
            # Parse the JSON string
            if isinstance(raw_questions, str):
                # Find everything between square brackets if it's a string
                match = re.search(r'\[(.*)\]', raw_questions, re.DOTALL)
                if match:
                    json_str = f"[{match.group(1)}]"
                    questions = json.loads(json_str)
                else:
                    questions = json.loads(raw_questions)
            else:
                # Maybe it's already properly structured
                questions = raw_questions
                
            logger.info(f"Parsed questions: {questions}")
            
        except (IndexError, KeyError, AttributeError) as e:
            logger.error(f"Error accessing tasks_output: {str(e)}")
            logger.error(f"Available attributes: {dir(result)}")
            if hasattr(result, 'tasks_output'):
                for i, task in enumerate(result.tasks_output):
                    logger.error(f"Task {i+1} type: {type(task)}")
                    logger.error(f"Task {i+1} dir: {dir(task)}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {str(e)}")
            logger.error(f"Raw content: {raw_questions}")
            raise
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "questions": questions
            }
        )
        
    except Exception as e:
        logger.error(f"Test failed: {str(e)}")
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": f"Test generation failed: {str(e)}",
                "traceback": traceback.format_exc(),
                "questions": [
                    "What are the fundamental concepts covered in this lecture?",
                    "How do these concepts relate to real-world applications?",
                    "Can you explain the key methodologies discussed?",
                    "What are the main challenges in implementing these concepts?",
                    "How does this topic connect with other areas of the course?"
                ]
            }
        )    

@app.post("/generate-quiz")
async def generate_quiz(request: LectureRequest):
    try:
        inputs = {
            'lecture_title': request.lecture_title,
            'course_name': request.course_name,
        }
        
        logger.info(f"Processing request with inputs: {inputs}")
        
        # Get crew instance - with error handling
        try:
            crew = AgentsAi().crew()
            logger.info("Successfully created crew instance")
        except Exception as crew_error:
            error_msg = f"Error creating crew: {str(crew_error)}"
            logger.error(error_msg)
            logger.error(traceback.format_exc())
            return JSONResponse(
                status_code=500,
                content={
                    "status": "error",
                    "message": error_msg,
                    "traceback": traceback.format_exc(),
                    "questions": [
                        "What are the fundamental concepts covered in this lecture?",
                        "How do these concepts relate to real-world applications?",
                        "Can you explain the key methodologies discussed?",
                        "What are the main challenges in implementing these concepts?",
                        "How does this topic connect with other areas of the course?"
                    ]
                }
            )
        
        # Execute the crew process - with error handling
        try:
            result = crew.kickoff(inputs=inputs)
            logger.info("Successfully executed crew process")
        except Exception as kickoff_error:
            error_msg = f"Error during kickoff: {str(kickoff_error)}"
            logger.error(error_msg)
            logger.error(traceback.format_exc())
            return JSONResponse(
                status_code=500,
                content={
                    "status": "error",
                    "message": error_msg,
                    "traceback": traceback.format_exc(),
                    "questions": [
                        "What are the fundamental concepts covered in this lecture?",
                        "How do these concepts relate to real-world applications?",
                        "Can you explain the key methodologies discussed?",
                        "What are the main challenges in implementing these concepts?",
                        "How does this topic connect with other areas of the course?"
                    ]
                }
            )
        
        # Extract questions from the nested structure
        try:
            # Access the second task's output (index 1)
            question_task_output = result.tasks_output[1]
            
            # Try different ways to access the content
            if hasattr(question_task_output, 'raw_output'):
                raw_questions = question_task_output.raw_output
            elif hasattr(question_task_output, 'raw'):
                raw_questions = question_task_output.raw
            elif hasattr(question_task_output, 'output'):
                raw_questions = question_task_output.output
            else:
                # If we can't find the output, convert the whole object to string
                raw_questions = str(question_task_output)
                
            logger.info(f"Raw questions: {raw_questions}")
            
            # Parse the JSON string
            try:
                if isinstance(raw_questions, str):
                    # Find everything between square brackets if it's a string
                    match = re.search(r'\[(.*)\]', raw_questions, re.DOTALL)
                    if match:
                        json_str = f"[{match.group(1)}]"
                        questions = json.loads(json_str)
                    else:
                        questions = json.loads(raw_questions)
                else:
                    # Maybe it's already properly structured
                    questions = raw_questions
                    
                logger.info(f"Parsed questions: {questions}")
            except json.JSONDecodeError as je:
                logger.error(f"JSON decode error: {str(je)}")
                # Try to clean the string more aggressively
                try:
                    # Extract anything that looks like a JSON array
                    text = re.sub(r'.*?\[(.*)\].*', r'[\1]', raw_questions, flags=re.DOTALL)
                    questions = json.loads(text)
                except Exception:
                    logger.error(f"Failed to parse JSON even after cleanup: {raw_questions}")
                    # Generate topic-specific questions as a fallback
                    questions = generate_topic_specific_questions(request.lecture_title, request.course_name)
        except (AttributeError, IndexError) as e:
            logger.error(f"Error accessing tasks_output: {str(e)}")
            if hasattr(result, 'tasks_output'):
                for i, task in enumerate(result.tasks_output):
                    logger.error(f"Task {i+1} type: {type(task)}")
                    logger.error(f"Task {i+1} dir: {dir(task)}")
            
            # Generate topic-specific questions as a fallback
            questions = generate_topic_specific_questions(request.lecture_title, request.course_name)
            
            # Return with warning but don't fail
            return JSONResponse(
                status_code=200,
                content={
                    "status": "warning",
                    "message": f"Used fallback questions due to error: {str(e)}",
                    "questions": questions
                }
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "questions": questions
            }
        )
        
    except Exception as e:
        logger.error(f"Error generating quiz: {str(e)}")
        logger.error(traceback.format_exc())
        
        # Generate topic-specific questions as a fallback
        questions = generate_topic_specific_questions(request.lecture_title, request.course_name)
        
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": f"Failed to generate questions: {str(e)}",
                "traceback": traceback.format_exc(),
                "questions": questions
            }
        )

def generate_topic_specific_questions(lecture_title, course_name):
    """Generate topic-specific questions based on lecture title and course name."""
    lecture_title = lecture_title.lower()
    course_name = course_name.lower()
    
    if "python" in lecture_title or "python" in course_name:
        return [
            "Explain the key features of Python that make it popular for beginners.",
            "How does Python handle variable declarations differently from languages like Java or C++?",
            "Describe the difference between lists and tuples in Python.",
            "What are Python modules and packages? How do they help with code organization?",
            "Explain how exception handling works in Python with try/except blocks."
        ]
    elif "machine learning" in lecture_title or "machine learning" in course_name:
        return [
            "What is machine learning and how does it differ from traditional programming?",
            "Explain the difference between supervised and unsupervised learning.",
            "What is the purpose of splitting data into training and test sets?",
            "Describe the concept of overfitting and how to prevent it.",
            "What are some common evaluation metrics for machine learning models?"
        ]
    elif "neural" in lecture_title or "deep learning" in course_name:
        return [
            "Explain the basic structure of a neural network.",
            "What is the role of activation functions in neural networks?",
            "How do convolutional neural networks (CNNs) differ from regular neural networks?",
            "What is backpropagation and why is it important for training neural networks?",
            "Describe the concept of transfer learning in deep learning."
        ]
    elif "data" in lecture_title or "analytics" in course_name:
        return [
            "What are the key steps in a typical data analysis workflow?",
            "Explain the difference between descriptive and inferential statistics.",
            "How do you handle missing data in a dataset?",
            "What is feature engineering and why is it important?",
            "Describe different visualization techniques and when you would use each one."
        ]
    else:
        # Default questions if topic doesn't match any specific categories
        return [
            f"Explain the core concepts of {lecture_title}.",
            f"How does {lecture_title} relate to other topics in {course_name}?",
            f"What are the practical applications of {lecture_title}?",
            f"Describe the challenges students often face when learning about {lecture_title}.",
            f"How has the field of {lecture_title} evolved over time?"
        ]
    

class AnswerRequest(BaseModel):
    lecture_title: str
    course_name: str
    questions: list[str]
    answers: list[str]

@app.post("/analyze-answers")
async def analyze_answers(request: AnswerRequest):
    try:
        logger.info(f"Analyzing answers for lecture: {request.lecture_title}")
        
        # Input validation
        if len(request.questions) != len(request.answers):
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": "Number of questions and answers must match",
                    "results": []
                }
            )
        
        # Analyze each answer using the analysis function
        results = []
        for i, (question, answer) in enumerate(zip(request.questions, request.answers)):
            analysis = analyze_student_answer(question, answer, request.lecture_title, request.course_name)
            results.append(analysis)
        
        # Calculate overall score
        correct_count = sum(1 for result in results if result["is_correct"])
        total_count = len(results)
        overall_score = (correct_count / total_count) * 100 if total_count > 0 else 0
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "overall_score": overall_score,
                "results": results
            }
        )
        
    except Exception as e:
        logger.error(f"Error analyzing answers: {str(e)}")
        logger.error(traceback.format_exc())
        
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": f"Failed to analyze answers: {str(e)}",
                "results": []
            }
        )

def analyze_student_answer(question: str, answer: str, lecture_title: str, course_name: str) -> dict:
    """
    Analyze a student's answer to determine if it's correct and provide feedback.
    
    This is a simplified version - in a real implementation, you would use an AI model 
    to evaluate the answer against expected keywords or concepts.
    """
    # Skip empty answers
    if not answer or answer.strip() == "":
        return {
            "is_correct": False,
            "score": 0,
            "feedback": "No answer provided. Please try to answer the question.",
            "question": question,
            "answer": answer
        }
    
    # Simplified analysis based on keywords in the answer
    # In a real implementation, you would use AI to evaluate the quality of the answer
    
    # Convert to lowercase for easier comparison
    question_lower = question.lower()
    answer_lower = answer.lower()
    lecture_lower = lecture_title.lower()
    course_lower = course_name.lower()
    
    # Extract expected keywords based on the question type
    expected_keywords = []
    
    # Python-related questions
    if "python" in question_lower or "python" in lecture_lower:
        if "feature" in question_lower or "popular" in question_lower:
            expected_keywords = ["readability", "easy", "simple", "libraries", "versatile", "interpreted"]
        elif "variable" in question_lower:
            expected_keywords = ["dynamic", "typing", "declaration", "assignment", "type"]
        elif "list" in question_lower and "tuple" in question_lower:
            expected_keywords = ["mutable", "immutable", "parentheses", "brackets", "modify"]
        elif "module" in question_lower or "package" in question_lower:
            expected_keywords = ["import", "organization", "reuse", "namespace", "library"]
        elif "exception" in question_lower:
            expected_keywords = ["try", "except", "catch", "handle", "error", "finally"]
    
    # Machine Learning-related questions
    elif "machine learning" in question_lower or "machine learning" in lecture_lower or "machine learning" in course_lower:
        if "differ" in question_lower or "traditional" in question_lower:
            expected_keywords = ["data", "patterns", "algorithm", "explicit", "programming", "learn"]
        elif "supervised" in question_lower and "unsupervised" in question_lower:
            expected_keywords = ["labeled", "unlabeled", "target", "classification", "clustering"]
        elif "training" in question_lower and "test" in question_lower:
            expected_keywords = ["generalization", "validation", "overfitting", "performance", "evaluate"]
        elif "overfitting" in question_lower:
            expected_keywords = ["regularization", "validation", "generalize", "complex", "flexible"]
        elif "evaluation" in question_lower or "metric" in question_lower:
            expected_keywords = ["accuracy", "precision", "recall", "f1", "auc", "roc"]
            
    # Neural Network-related questions
    elif "neural" in question_lower or "deep learning" in lecture_lower or "deep learning" in course_lower:
        if "basic structure" in question_lower or "structure" in question_lower:
            expected_keywords = ["input", "hidden", "output", "layer", "weight", "bias", "neuron"]
        elif "activation" in question_lower:
            expected_keywords = ["relu", "sigmoid", "tanh", "non-linear", "function"]
        elif "cnn" in question_lower or "convolutional" in question_lower:
            expected_keywords = ["filter", "kernel", "convolution", "pooling", "feature", "image"]
        elif "backpropagation" in question_lower:
            expected_keywords = ["gradient", "descent", "error", "weight", "update", "learning"]
        elif "transfer" in question_lower:
            expected_keywords = ["pretrained", "model", "feature", "extraction", "fine-tuning"]
    
    # Data Analysis-related questions
    elif "data" in question_lower or "analytics" in lecture_lower or "analytics" in course_lower:
        if "workflow" in question_lower or "steps" in question_lower:
            expected_keywords = ["collection", "cleaning", "exploration", "analysis", "visualization", "interpretation"]
        elif "descriptive" in question_lower and "inferential" in question_lower:
            expected_keywords = ["summarize", "population", "sample", "hypothesis", "testing", "inference"]
        elif "missing" in question_lower:
            expected_keywords = ["imputation", "deletion", "mean", "median", "mode", "regression"]
        elif "feature" in question_lower and "engineering" in question_lower:
            expected_keywords = ["transformation", "selection", "creation", "normalization", "scaling"]
        elif "visualization" in question_lower:
            expected_keywords = ["chart", "graph", "plot", "dashboard", "histogram", "scatter"]
            
    # Generic questions - look for topic-specific keywords
    else:
        # Extract key terms from the question and lecture title
        key_terms = set()
        for term in lecture_lower.split():
            if len(term) > 3:  # Only consider meaningful terms
                key_terms.add(term)
        
        for term in question_lower.split():
            if len(term) > 3 and term not in ["what", "explain", "describe", "discuss", "how", "when", "where", "which", "this", "that", "these", "those"]:
                key_terms.add(term)
        
        expected_keywords = list(key_terms)
    
    # Count how many expected keywords are in the answer
    keyword_matches = sum(1 for keyword in expected_keywords if keyword in answer_lower)
    
    # Check minimum answer length (at least 50 characters for a proper answer)
    min_length = 50
    length_adequate = len(answer) >= min_length
    
    # Calculate score based on keyword matches and length
    # This is a simple heuristic - you would use more sophisticated methods in practice
    if not expected_keywords:
        # If we couldn't determine expected keywords, just check length
        score = 70 if length_adequate else 30
        is_correct = length_adequate
    else:
        # Calculate score based on keyword matches with minimum threshold
        min_keywords_needed = min(3, len(expected_keywords))
        match_ratio = keyword_matches / len(expected_keywords) if expected_keywords else 0
        score = min(100, max(0, int(match_ratio * 100)))
        
        # Penalize for inadequate length
        if not length_adequate:
            score = max(0, score - 30)
            
        is_correct = score >= 60  # Consider correct if score is at least 60
    
    # Generate feedback based on the analysis
    if not length_adequate:
        feedback = "Your answer is too brief. Please provide a more detailed explanation."
    elif score >= 90:
        feedback = "Excellent answer! You've covered all the key concepts thoroughly."
    elif score >= 70:
        feedback = "Good answer. You've addressed most of the important points."
    elif score >= 50:
        feedback = "Partial answer. You've mentioned some relevant concepts, but missed others."
    else:
        feedback = "Your answer needs improvement. Try to include more specific details about key concepts."
    
    return {
        "is_correct": is_correct,
        "score": score,
        "feedback": feedback,
        "question": question,
        "answer": answer,
        "matched_keywords": keyword_matches,
        "expected_keywords_count": len(expected_keywords)
    }    

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception handler caught: {str(exc)}")
    logger.error(traceback.format_exc())
    
    # Try to extract lecture_title and course_name from the request
    try:
        body = await request.json()
        lecture_title = body.get("lecture_title", "Unknown Topic")
        course_name = body.get("course_name", "General Course")
    except:
        lecture_title = "Unknown Topic"
        course_name = "General Course"
    
    # Generate topic-specific questions as a fallback
    questions = generate_topic_specific_questions(lecture_title, course_name)
    
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": f"Internal server error: {str(exc)}",
            "traceback": traceback.format_exc(),
            "questions": questions
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, timeout_keep_alive=60)