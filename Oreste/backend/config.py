class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///soldier.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'super-secret'  # Use a stronger key in production
    CORS_ORIGINS = ["http://localhost:3000"]  # Frontend allowed origins
