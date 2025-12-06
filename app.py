from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/experience')
def experience():
    return render_template('experience.html')


@app.route('/projects')
def projects():
    return render_template('projects.html')


@app.route('/skills')
def skills():
    return render_template('skills.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')

    # TODO: Integrate with OpenAI or other AI service
    # For now, return a placeholder response
    bot_response = f"Thanks for asking! You said: '{user_message}'. AI integration coming soon - I'll be trained on the portfolio owner's CV and experience!"

    return jsonify({'response': bot_response})


if __name__ == '__main__':
    app.run(debug=True)
