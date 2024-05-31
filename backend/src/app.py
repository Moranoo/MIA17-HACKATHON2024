from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
import pandas as pd
import os
from dotenv import load_dotenv
import joblib

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

app = Flask(__name__)
CORS(app)

connection_url = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
engine = create_engine(connection_url)

# Charger le modèle de prédiction
model = joblib.load('random_forest_model.pkl')

@app.route('/medals_by_country', methods=['GET'])
def medals_by_country():
    country = request.args.get('country')
    query = f"SELECT * FROM cleaned_olympic_data WHERE country_name = '{country}'"
    data = pd.read_sql(query, con=engine)
    return data.to_json(orient='records')

@app.route('/medals_by_team_and_year', methods=['GET'])
def medals_by_team_and_year():
    team = request.args.get('team')
    year = request.args.get('year')
    query = f"SELECT * FROM cleaned_olympic_results1 WHERE discipline_title = '{team}' AND game_year = {year}"
    data = pd.read_sql(query, con=engine)
    return data.to_json(orient='records')

@app.route('/prediction_2024', methods=['GET'])
def prediction_2024():
    data_df = pd.read_sql("SELECT * FROM cleaned_olympic_data;", con=engine)
    result1_df = pd.read_sql("SELECT * FROM cleaned_olympic_results1;", con=engine)
    merged_data = pd.merge(data_df, result1_df, on=['country_name', 'game_year'], how='left')
    
    data_2024 = merged_data[merged_data['game_year'] == 2016].copy()
    data_2024['game_year'] = 2024
    
    features_2024 = data_2024[['country_name', 'game_year', 'total_disciplines', 'total_events']]
    features_2024_encoded = pd.get_dummies(features_2024, columns=['country_name'])
    features_train_encoded = pd.get_dummies(merged_data[merged_data['game_year'] <= 2016][['country_name', 'game_year', 'total_disciplines', 'total_events']], columns=['country_name'])
    features_2024_encoded = features_2024_encoded.reindex(columns=features_train_encoded.columns, fill_value=0)

    y_pred_2024 = model.predict(features_2024_encoded)
    prediction_2024 = pd.DataFrame({'country_name': data_2024['country_name'], 'predicted_medals': y_pred_2024})
    
    return prediction_2024.to_json(orient='records')

@app.route('/predict', methods=['GET'])
def predict():
    country = request.args.get('country')
    year = int(request.args.get('year'))
    total_disciplines = int(request.args.get('total_disciplines'))
    total_events = int(request.args.get('total_events'))
    
    features = pd.DataFrame({
        'country_name': [country],
        'game_year': [year],
        'total_disciplines': [total_disciplines],
        'total_events': [total_events]
    })
    
    features_encoded = pd.get_dummies(features, columns=['country_name'])
    features_train_encoded = pd.get_dummies(pd.read_sql("SELECT * FROM cleaned_olympic_data WHERE game_year <= 2016", con=engine)[['country_name', 'game_year', 'total_disciplines', 'total_events']], columns=['country_name'])
    features_encoded = features_encoded.reindex(columns=features_train_encoded.columns, fill_value=0)
    
    predicted_medals = model.predict(features_encoded)
    
    return jsonify({'predicted_medals': predicted_medals[0]})

@app.route('/countries', methods=['GET'])
def get_countries():
    query = "SELECT DISTINCT country_name FROM cleaned_olympic_data"
    data = pd.read_sql(query, con=engine)
    return jsonify(data['country_name'].tolist())

@app.route('/teams', methods=['GET'])
def get_teams():
    query = "SELECT DISTINCT discipline_title FROM cleaned_olympic_results1"
    data = pd.read_sql(query, con=engine)
    return jsonify(data['discipline_title'].tolist())

if __name__ == '__main__':
    app.run(debug=True)
