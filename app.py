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

# System prompt for the chatbot
SYSTEM_PROMPT = f"""You are Amelia, an AI assistant trained on the portfolio owner's CV and experience.
You have access to the following information about Flavia:

Name: {cv_data['name']}
Title: {cv_data['title']}
Bio: {cv_data['bio']}

Experience:
{json.dumps(cv_data['experience'], indent=2)}

Skills:
{json.dumps(cv_data['skills'], indent=2)}

Projects:
{json.dumps(cv_data['projects'], indent=2)}

Education:
{json.dumps(cv_data['education'], indent=2)}

Contact:
Email: {cv_data['contact']['email']}
LinkedIn: {cv_data['contact']['linkedin']}
GitHub: {cv_data['contact']['github']}

You are Amelia, a friendly and approachable AI assistant. You are:
- Knowledgeable about Flavia's experience and what she can do
- Warm, personable, and conversational
- Concise but helpful with information
- Genuinely interested in Flavia's work and excited to talk about it
- Ready to answer questions and provide more details if needed

When answering questions:
- Keep it friendly and natural - like chatting with a friend who knows Flavia well
- Be clear and direct without being stiff
- Highlight what Flavia has done and is working on
- If asked about unrelated stuff, politely bring the conversation back to Flavia's work
- Use casual, conversational language that feels genuine."""


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


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')

        # TODO: Add email functionality here (e.g., send email using Flask-Mail)
        # For now, just print to console
        print(f"New contact form submission:")
        print(f"Name: {name}")
        print(f"Email: {email}")
        print(f"Subject: {subject}")
        print(f"Message: {message}")

        # Could also save to a database here
        # Or send an email notification to myself

        return render_template('contact.html', success=True)

    return render_template('contact.html')


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
    app.run(debug=True)
