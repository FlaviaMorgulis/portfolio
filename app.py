from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Load CV data


def load_cv_data():
    with open('cv_data.json', 'r') as f:
        return json.load(f)


cv_data = load_cv_data()


def load_system_prompt():
    """Load and format the system prompt with CV data."""
    with open('system_prompt.txt', 'r') as f:
        template = f.read()

    return template.format(
        name=cv_data['name'],
        title=cv_data['title'],
        bio=cv_data['bio'],
        experience=json.dumps(cv_data['experience'], indent=2),
        skills=json.dumps(cv_data['skills'], indent=2),
        projects=json.dumps(cv_data['projects'], indent=2),
        education=json.dumps(cv_data['education'], indent=2),
        email=cv_data['contact']['email'],
        linkedin=cv_data['contact']['linkedin'],
        github=cv_data['contact']['github']
    )


SYSTEM_PROMPT = load_system_prompt()


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/projects')
def projects():
    return render_template('projects.html')


@app.route('/skills')
def skills():
    return render_template('skills.html')


@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message', '')

        if not user_message:
            return jsonify({'response': 'Please ask me something!'}), 400

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=500
        )

        bot_response = response.choices[0].message.content
        return jsonify({'response': bot_response})

    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error in chat endpoint: {e}")
        print(f"Full traceback:\n{error_trace}")
        return jsonify({'response': f'Sorry, I encountered an error: {str(e)}.'}), 500


if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development')
