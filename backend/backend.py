from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI
openai = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4"
)

# Mock database (replace with real database in production)
courses = []
users = []

# Create AI Agents
teacher_agent = Agent(
    role='Teaching Expert',
    goal='Help create and improve course materials',
    backstory='Expert in education with years of experience in curriculum development',
    verbose=True,
    allow_delegation=False,
    llm=openai
)

grading_agent = Agent(
    role='Grading Assistant',
    goal='Help evaluate student work and provide feedback',
    backstory='Experienced in educational assessment and feedback',
    verbose=True,
    allow_delegation=False,
    llm=openai
)

student_support_agent = Agent(
    role='Student Support Specialist',
    goal='Help identify and assist struggling students',
    backstory='Expert in student success and academic support',
    verbose=True,
    allow_delegation=False,
    llm=openai
)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/courses', methods=['GET'])
def get_courses():
    return jsonify(courses)

@app.route('/api/courses', methods=['POST'])
def create_course():
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
        
    new_course = {
        'id': len(courses) + 1,
        'title': data['title'],
        'code': data.get('code', ''),
        'description': data.get('description', ''),
        'professor': data.get('professor', ''),
        'created_at': datetime.now().isoformat()
    }
    
    # Use AI to enhance course description
    task = Task(
        description=f"Enhance the course description for {data['title']}",
        agent=teacher_agent
    )
    
    crew = Crew(
        agents=[teacher_agent],
        tasks=[task],
        process=Process.sequential
    )
    
    result = crew.kickoff()
    new_course['ai_enhanced_description'] = result
    
    courses.append(new_course)
    return jsonify(new_course), 201

@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    course = next((c for c in courses if c['id'] == course_id), None)
    if course is None:
        return jsonify({'error': 'Course not found'}), 404
    return jsonify(course)

@app.route('/api/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    data = request.get_json()
    course = next((c for c in courses if c['id'] == course_id), None)
    
    if course is None:
        return jsonify({'error': 'Course not found'}), 404
        
    course.update({
        'title': data.get('title', course['title']),
        'code': data.get('code', course['code']),
        'description': data.get('description', course['description']),
        'professor': data.get('professor', course['professor']),
        'updated_at': datetime.now().isoformat()
    })
    
    return jsonify(course)

@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    course = next((c for c in courses if c['id'] == course_id), None)
    
    if course is None:
        return jsonify({'error': 'Course not found'}), 404
        
    courses.remove(course)
    return '', 204

@app.route('/api/analyze/student-performance', methods=['POST'])
def analyze_student_performance():
    data = request.get_json()
    
    if not data or 'student_id' not in data:
        return jsonify({'error': 'Missing student ID'}), 400
        
    task = Task(
        description=f"Analyze performance and provide recommendations for student {data['student_id']}",
        agent=student_support_agent
    )
    
    crew = Crew(
        agents=[student_support_agent],
        tasks=[task],
        process=Process.sequential
    )
    
    result = crew.kickoff()
    
    return jsonify({
        'analysis': result,
        'student_id': data['student_id']
    })

@app.route('/api/grade/assignment', methods=['POST'])
def grade_assignment():
    data = request.get_json()
    
    if not data or 'submission' not in data:
        return jsonify({'error': 'Missing submission'}), 400
        
    task = Task(
        description=f"Grade assignment and provide detailed feedback",
        agent=grading_agent
    )
    
    crew = Crew(
        agents=[grading_agent],
        tasks=[task],
        process=Process.sequential
    )
    
    result = crew.kickoff()
    
    return jsonify({
        'grade': result,
        'submission_id': data.get('submission_id')
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing credentials'}), 400
        
    # Mock authentication (replace with real authentication in production)
    return jsonify({
        'token': 'mock_token',
        'user': {
            'id': 1,
            'email': data['email'],
            'role': 'teacher'
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)