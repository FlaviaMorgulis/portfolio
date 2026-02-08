from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from openai import OpenAI
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('EMAIL_USER')

mail = Mail(app)

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


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')

        try:
            # Send email to yourself
            msg = Message(
                subject=f"New Contact Form Submission: {subject}",
                recipients=[os.getenv('EMAIL_USER')],
                body=f"""
New contact form submission:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}
                """
            )
            mail.send(msg)

            # Send confirmation email to the user
            confirmation_msg = Message(
                subject="I received your message!",
                recipients=[email],
                body=f"""
Hi {name},

Thank you for reaching out! I received your message and will get back to you soon.

Best regards,
Flavia
                """
            )
            mail.send(confirmation_msg)

            print(f"Email sent successfully from {name}")
            return render_template('contact.html', success=True)

        except Exception as e:
            print(f"Error sending email: {e}")
            return render_template('contact.html', success=False, error=str(e))

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
    app.run(debug=os.getenv('FLASK_ENV') == 'development')
