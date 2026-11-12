export const projects = [
  {
    "id": "quorum",
    "title": "Quorum",
    "slug": "quorum",
    "category": "Agentic AI",
    "year": 2026,
    "summary": "A role-based, source-grounded AI research system.",
    "description": "Searches for up to three relevant web sources, retrieves available page text, and uses Groq to produce a concise research report and evidence review. Includes a Streamlit interface and a command-line runner.",
    "techStack": [
      "Python",
      "LangChain",
      "Tavily",
      "BeautifulSoup",
      "Groq",
      "Streamlit"
    ],
    "githubUrl": "https://github.com/aryanjaiswal-454/Quorum-AI-Research-System",
    "liveUrl": "https://quorum-ai-research-system.streamlit.app/",
    "demoUrl": "https://www.linkedin.com/posts/aryan5178_research-gets-more-useful-when-you-can-follow-ugcPost-7525999807363166208-P3Y2/",
    "image": "/assets/projects/quorum.png",
    "featured": true,
    "order": 1
  },
  {
    "id": "network-security",
    "title": "Network Security — Phishing Detection",
    "slug": "network-security-phishing-detection",
    "category": "Machine Learning / AI",
    "year": 2026,
    "summary": "An end-to-end ML pipeline and deployed phishing-detection API.",
    "description": "Covers data ingestion, validation, preprocessing, feature engineering, model selection, experiment tracking, and deployment. The best-model F1 score is 97.65%, precision is 97.26%, and recall is 98.05%. The service is packaged as a Dockerized FastAPI API and deployed using AWS services.",
    "techStack": [
      "Python",
      "scikit-learn",
      "FastAPI",
      "MongoDB Atlas",
      "MLflow",
      "DagsHub",
      "Docker",
      "AWS S3",
      "AWS ECR",
      "AWS EC2",
      "GitHub Actions"
    ],
    "githubUrl": "https://github.com/aryanjaiswal-454/Network-Security",
    "liveUrl": null,
    "demoUrl": "https://youtu.be/tjDm-z14DZU",
    "image": "/assets/projects/network-security.jpg",
    "featured": true,
    "order": 2
  },
  {
    "id": "devtinder",
    "title": "DevTinder",
    "slug": "devtinder",
    "category": "Full-Stack Development",
    "year": 2026,
    "summary": "A developer networking platform with profiles and connection requests.",
    "description": "A full-stack application for discovering and connecting with developers. Includes REST APIs for registration, profile management, and connection requests, with JWT authentication, bcrypt password hashing, and MongoDB-backed data.",
    "techStack": [
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT",
      "bcrypt"
    ],
    "githubUrl": "https://github.com/aryanjaiswal-454/DevTinder",
    "liveUrl": "https://dev-tinder-five-rho.vercel.app",
    "demoUrl": "https://www.linkedin.com/posts/aryan5178_mern-webdevelopment-fullstackdeveloper-ugcPost-7444141552911945728-S290/",
    "image": "/assets/projects/dev-tinder.png",
    "featured": true,
    "order": 3
  },
  {
    "id": "student-performance-prediction",
    "title": "Student Performance Prediction",
    "slug": "student-performance-prediction",
    "category": "Machine Learning / AI",
    "year": 2026,
    "summary": "An end-to-end ML web app that predicts mathematics scores.",
    "description": "A regression workflow with exploratory analysis, preprocessing, feature engineering, model comparison, hyperparameter tuning, and a Flask application for predictions.",
    "techStack": [
      "Python",
      "scikit-learn",
      "Pandas",
      "NumPy",
      "XGBoost",
      "CatBoost",
      "Flask"
    ],
    "githubUrl": "https://github.com/aryanjaiswal-454/Student-Performance-Prediction",
    "liveUrl": "https://student-performance-prediction-3ovu.onrender.com/",
    "demoUrl": null,
    "image": "/assets/projects/student-performance-app.png",
    "featured": false,
    "order": 4
  },
  {
    "id": "weather-agent",
    "title": "Weather Agent",
    "slug": "weather-agent",
    "category": "Agentic AI",
    "year": 2026,
    "summary": "A conversational weather app with LLM-driven tool calls.",
    "description": "A Streamlit chat application that uses an LLM tool-call loop and a weather lookup backed by geocoding and forecast APIs.",
    "techStack": [
      "Python",
      "Streamlit",
      "LLM tool calling",
      "Jinja",
      "Requests"
    ],
    "githubUrl": "https://github.com/aryanjaiswal-454/Learning-AI/tree/main/8_Weather_Agent_App",
    "liveUrl": "https://weather-agent-20m03.streamlit.app/",
    "demoUrl": null,
    "image": "/assets/projects/weather-agent-app.png",
    "featured": false,
    "order": 5
  },
  {
    "id": "imdb-sentiment-analysis",
    "title": "IMDb Movie Review Sentiment Analysis",
    "slug": "imdb-movie-review-sentiment-analysis",
    "category": "Machine Learning / AI",
    "summary": "A Streamlit app that classifies IMDb reviews as positive or negative.",
    "description": "Predicts the sentiment of a movie review using a SimpleRNN model built with TensorFlow/Keras, with an interactive Streamlit interface.",
    "techStack": [
      "Python",
      "TensorFlow/Keras",
      "SimpleRNN",
      "Streamlit",
      "NumPy"
    ],
    "githubUrl": "https://github.com/aryanjaiswal-454/IMDB-Sentiment-Analysis",
    "liveUrl": "https://imdb-sentiment-analysis-ai.streamlit.app/",
    "demoUrl": null,
    "image": "/assets/projects/imdb-sentiment-analysis.png",
    "featured": true,
    "order": 6
  }
];
export default projects;
