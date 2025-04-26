from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from typing import Dict, Any
import os
import logging
import yaml

logger = logging.getLogger(__name__)

@CrewBase
class AgentsAi():
    """AgentsAi crew for generating quiz questions"""

    # Get the directory of the current file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Construct the correct paths to the YAML files
    agents_config_path = os.path.join(current_dir, 'agents_nahj.yaml')
    tasks_config_path = os.path.join(current_dir, 'tasks_nahj.yaml')
    
    logger.debug(f"Agent config path: {agents_config_path}")
    logger.debug(f"Tasks config path: {tasks_config_path}")
    
    # Load configurations manually since yaml_loader isn't available
    try:
        with open(agents_config_path, 'r') as f:
            agents_config = yaml.safe_load(f)
        with open(tasks_config_path, 'r') as f:
            tasks_config = yaml.safe_load(f)
        logger.info("Successfully loaded YAML configurations")
    except Exception as e:
        logger.error(f"Error loading YAML configurations: {str(e)}")
        # Default configuration fallback
        agents_config = {
            'researcher': {
                'role': 'Educational Content Analyst',
                'goal': 'Analyze lecture and course materials to identify key concepts and learning objectives',
                'backstory': 'An expert in curriculum analysis who can quickly identify the most important learning points from educational content.',
                'tools': [],
                'allow_delegation': False
            },
            'question_writer': {
                'role': 'Quiz Question Writer',
                'goal': 'Create 5 insightful questions about the lecture content that test understanding',
                'backstory': 'A professional educator with years of experience creating effective assessment questions for university courses.',
                'tools': [],
                'allow_delegation': False
            }
        }
        
        tasks_config = {
            'research_task': {
                'name': 'Analyze Lecture Content',
                'description': 'Analyze this educational content:\nCourse: {course_name}\nLecture: {lecture_title}\nIdentify the 5 most important concepts students should understand.',
                'expected_output': 'A markdown list of 5 key concepts with brief explanations of their importance.',
                'agent': 'researcher'
            },
            'question_task': {
                'name': 'Generate Quiz Questions',
                'description': 'Using the key concepts identified in the research task, create 5 assessment questions that:\n1. Cover different cognitive levels (remember, understand, apply, analyze, evaluate)\n2. Are clear and unambiguous\n3. Test genuine understanding of the material\n4. Are appropriate for university-level students',
                'expected_output': 'A JSON array containing 5 well-formulated questions about the lecture content.\nFormat: ["question1", "question2", ...]',
                'agent': 'question_writer'
            }
        }
        logger.warning("Using fallback configuration")

    @agent
    def researcher(self) -> Agent:
        try:
            return Agent(
                role=self.agents_config['researcher']['role'],
                goal=self.agents_config['researcher']['goal'],
                backstory=self.agents_config['researcher']['backstory'],
                verbose=True
            )
        except Exception as e:
            logger.error(f"Error creating researcher agent: {str(e)}")
            # Fallback to hardcoded values if there's an error
            return Agent(
                role="Educational Content Analyst",
                goal="Analyze lecture and course materials to identify key concepts",
                backstory="An expert in curriculum analysis who can identify important learning points.",
                verbose=True
            )

    @agent
    def question_writer(self) -> Agent:
        try:
            return Agent(
                role=self.agents_config['question_writer']['role'],
                goal=self.agents_config['question_writer']['goal'],
                backstory=self.agents_config['question_writer']['backstory'],
                verbose=True
            )
        except Exception as e:
            logger.error(f"Error creating question_writer agent: {str(e)}")
            # Fallback to hardcoded values if there's an error
            return Agent(
                role="Quiz Question Writer",
                goal="Create 5 insightful questions about the lecture content",
                backstory="A professional educator with experience creating assessment questions.",
                verbose=True
            )

    @task
    def research_task(self) -> Task:
        try:
            return Task(
                description=self.tasks_config['research_task']['description'],
                expected_output=self.tasks_config['research_task']['expected_output'],
                agent=self.researcher(),
                output_file='key_concepts.md'
            )
        except Exception as e:
            logger.error(f"Error creating research task: {str(e)}")
            # Fallback to hardcoded values if there's an error
            return Task(
                description="Analyze this educational content:\nCourse: {course_name}\nLecture: {lecture_title}\nIdentify the 5 most important concepts students should understand.",
                expected_output="A markdown list of 5 key concepts with brief explanations of their importance.",
                agent=self.researcher(),
                output_file='key_concepts.md'
            )

    @task
    def question_task(self) -> Task:
        try:
            return Task(
                description=self.tasks_config['question_task']['description'],
                expected_output=self.tasks_config['question_task']['expected_output'],
                agent=self.question_writer(),
                output_file='quiz_questions.json',
                context=[self.research_task()]
            )
        except Exception as e:
            logger.error(f"Error creating question task: {str(e)}")
            # Fallback to hardcoded values if there's an error
            return Task(
                description="Using the key concepts identified in the research task, create 5 assessment questions that test understanding of the material.",
                expected_output="A JSON array containing 5 well-formulated questions about the lecture content.\nFormat: [\"question1\", \"question2\", ...]",
                agent=self.question_writer(),
                output_file='quiz_questions.json',
                context=[self.research_task()]
            )

    @crew
    def crew(self) -> Crew:
        """Creates the quiz question generation crew"""
        try:
            return Crew(
                agents=[self.researcher(), self.question_writer()],
                tasks=[self.research_task(), self.question_task()],
                process=Process.sequential,
                verbose=True
            )
        except Exception as e:
            logger.error(f"Error creating crew: {str(e)}")
            raise