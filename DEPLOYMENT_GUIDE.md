# Deployment Guide for Render

## Prerequisites

- GitHub account with your code pushed
- Render account (free: render.com)
- A `.env` file with your environment variables

## Environment Variables Setup

Before deploying, ensure your `.env` file contains:

```
OPENAI_API_KEY=your_openai_key
EMAIL_USER=flaviaefmorgulis@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FLASK_ENV=production
```

## Steps to Deploy to Render

1. **Push to GitHub**
   - Make sure your code is pushed to GitHub
   - The `.env` file should NOT be in git (it's in .gitignore)

2. **Create a New Web Service on Render**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose the correct repository

3. **Configure the Service**
   - **Name**: Something like "flavia-portfolio"
   - **Environment**: Python 3
   - **Region**: Choose closest to you or default
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app` (should auto-fill)

4. **Add Environment Variables**
   - In the "Environment" section, add:
     - `OPENAI_API_KEY` = your OpenAI key
     - `EMAIL_USER` = flaviaefmorgulis@gmail.com
     - `EMAIL_PASSWORD` = your Gmail app password
     - `FLASK_ENV` = production

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Wait 5-10 minutes for the deployment to complete
   - Once done, you'll get a URL like: `https://flavia-portfolio.onrender.com`

6. **Verify**
   - Visit the generated URL
   - Test the contact form
   - Check the chat functionality

## Important Notes

- **Free Tier**: Render's free tier will spin down inactive services after 15 minutes. Consider upgrading to keep it always running.
- **Email Setup**: Make sure you've generated a Gmail App Password (not regular password)
- **Static Files**: Render should serve your static files automatically
- **Logs**: Check Render's logs if something isn't working

## Local Testing Before Deploy

To test locally first:

```
FLASK_ENV=development python app.py
```

Then visit: `http://localhost:5000`

## Troubleshooting

- **Email not sending**: Check your Gmail app password in environment variables
- **Static files not loading**: Make sure the `static/` folder is committed to git
- **API errors**: Check that OPENAI_API_KEY is correctly set

Good luck! 🚀
