#!/usr/bin/env python
import os
os.environ["CREWAI_TELEMETRY"] = "disabled"
os.environ["OTEL_SDK_DISABLED"] = "true"
import logging
import json
import traceback
import sys

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Make sure the current directory is in the path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(current_dir))

def test_crew():
    logger.info("Testing CrewAI setup...")
    
    try:
        # Test importing the AgentsAi class - adjust the import based on your directory structure
        logger.info("Importing AgentsAi...")
        from agents_ai.crew import AgentsAi
        
        # Test creating an instance
        logger.info("Creating AgentsAi instance...")
        agents_ai = AgentsAi()
        
        # Test creating a crew
        logger.info("Creating crew...")
        crew = agents_ai.crew()
        
        # Test sample inputs
        test_inputs = {
            'lecture_title': 'Introduction to Python',
            'course_name': 'Programming Fundamentals',
        }
        
        logger.info(f"Running crew with inputs: {test_inputs}")
        result = crew.kickoff(inputs=test_inputs)
        
        # Log the results
        logger.info("Crew execution completed!")
        
        # Print tasks output
        logger.info("Tasks output:")
        for i, task_output in enumerate(result.tasks_output):
            logger.info(f"Task {i+1}: {task_output}")
            
            # Debug: Print the full attributes of the task_output
            logger.debug(f"Task {i+1} dir: {dir(task_output)}")
            
        # Try to parse the questions - UPDATED to fix the error
        try:
            # Access the second task's output (index 1)
            question_task_output = result.tasks_output[1]
            # Print all attributes to debug
            logger.info(f"Question task attributes: {dir(question_task_output)}")
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
            
            # Try to parse as JSON, with a fallback
            try:
                if isinstance(raw_questions, str):
                    # Find everything between square brackets if it's a string
                    import re
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
                
                print("\n----- Generated Questions -----")
                if isinstance(questions, list):
                    for i, q in enumerate(questions):
                        print(f"{i+1}. {q}")
                else:
                    print(questions)
                print("------------------------------\n")
                
                return True
            except json.JSONDecodeError as je:
                logger.error(f"JSON decode error: {str(je)}")
                logger.error(f"Raw content: {raw_questions}")
                # Just display the raw output
                print("\n----- Generated Output (not JSON) -----")
                print(raw_questions)
                print("------------------------------\n")
                return True
                
        except (AttributeError, IndexError) as e:
            logger.error(f"Error accessing task output: {str(e)}")
            if hasattr(result, 'tasks_output'):
                for i, task in enumerate(result.tasks_output):
                    logger.error(f"Task {i+1} type: {type(task)}")
                    logger.error(f"Task {i+1} dir: {dir(task)}")
                    logger.error(f"Task {i+1} str: {str(task)}")
            return False
            
    except Exception as e:
        logger.error(f"Test failed: {str(e)}")
        logger.error(traceback.format_exc())
        return False

if __name__ == "__main__":
    success = test_crew()
    if success:
        print("CrewAI test completed successfully!")
    else:
        print("CrewAI test failed. Check the logs for details.")