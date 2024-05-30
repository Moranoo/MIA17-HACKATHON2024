from flask import Flask, request, jsonify
import joblib
import pandas as pd
from sqlalchemy import create_engine
from flask_cors import CORS
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Informations de connexion à la base de données depuis les variables d'environnement
username = os.getenv('DB_USERNAME')
password = os.getenv('DB_PASSWORD')
host = os.getenv('DB_HOST')
port = os.getenv('DB_PORT')
database = os.getenv('DB_DATABASE')

connection_url = f'postgresql://{username}:{password}@{host}:{port}/{database}'

# Créer une connexion à la base de données
engine = create_engine(connection_url)

# Charger les données à partir de la base de données
athletes_df = pd.read_sql("SELECT * FROM olympic_athletes;", con=engine)
hosts_df = pd.read_sql("SELECT * FROM olympic_hosts;", con=engine)
medals_df = pd.read_sql("SELECT * FROM olympic_medals;", con=engine)
results_df = pd.read_sql("SELECT * FROM olympic_results;", con=engine)
cleaned_olympic_data_df = pd.read_sql("SELECT * FROM cleaned_olympic_data;", con=engine)
cleaned_olympic_results_df = pd.read_sql("SELECT * FROM cleaned_olympic_results1;", con=engine)

# Charger le modèle sauvegardé
model_filename = 'olympic_model.pkl'
model = joblib.load(model_filename)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    features = pd.DataFrame(data['features'])
    prediction = model.predict(features)
    return jsonify({'prediction': prediction.tolist()})

@app.route('/medals_by_country', methods=['GET'])
def medals_by_country():
    country = request.args.get('country')
    if not country:
        return jsonify({'error': 'Country parameter is required'}), 400

    country_medals = medals_df[medals_df['country_name'] == country]
    medals_by_year = country_medals.groupby(['slug_game', 'medal_type']).size().unstack(fill_value=0)
    medals_by_year.reset_index(inplace=True)
    return jsonify(medals_by_year.to_dict(orient='records'))

@app.route('/medals_by_team_year', methods=['GET'])
def medals_by_team_year():
    team = request.args.get('team')
    year = request.args.get('year')
    if not team or not year:
        return jsonify({'error': 'Team and Year parameters are required'}), 400

    team_medals = medals_df[(medals_df['participant_title'] == team) & (medals_df['slug_game'].str.contains(year))]
    medals_by_event = team_medals.groupby(['event_title', 'medal_type']).size().unstack(fill_value=0)
    medals_by_event.reset_index(inplace=True)
    return jsonify(medals_by_event.to_dict(orient='records'))

@app.route('/top_teams', methods=['GET'])
def top_teams():
    medals_count = medals_df.groupby('participant_title').size().reset_index(name='total_medals')
    top_teams = medals_count.nlargest(10, 'total_medals')
    return jsonify(top_teams.to_dict(orient='records'))

@app.route('/countries')
def get_countries():
    countries = medals_df['country_name'].unique().tolist()
    return jsonify(countries)

@app.route('/teams')
def get_teams():
    teams = cleaned_olympic_data_df['country_name'].unique().tolist()
    return jsonify(teams)

@app.route('/years')
def get_years():
    years = cleaned_olympic_data_df['game_year'].unique().tolist()
    return jsonify(sorted(years))

if __name__ == '__main__':
    app.run(debug=True)
