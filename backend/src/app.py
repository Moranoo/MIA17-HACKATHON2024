from flask import Flask, request, jsonify
import joblib
import pandas as pd
from sqlalchemy import create_engine
from flask_cors import CORS
from dotenv import load_dotenv
import os
import tensorflow as tf

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

# Afficher les colonnes disponibles
print(results_df.columns)

# Charger le modèle RandomForest
model_filename = 'model.joblib'
model = joblib.load(model_filename)

# Charger le modèle Keras/TensorFlow
best_model = tf.keras.models.load_model('best_model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    features = pd.DataFrame(data['features'])
    
    # Vérification des valeurs manquantes
    if features.isnull().values.any():
        return jsonify({'error': 'Input contains NaN values'}), 400
    
    prediction = model.predict(features)
    return jsonify({'prediction': prediction.tolist()})

@app.route('/predict_keras', methods=['POST'])
def predict_keras():
    data = request.get_json(force=True)
    features = pd.DataFrame(data['features'])
    
    # Prétraitement des données
    features_scaled = scaler.transform(features)
    
    prediction = best_model.predict(features_scaled)
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
    countries = results_df['country_name'].unique().tolist()
    return jsonify(countries)

@app.route('/teams')
def get_teams():
    teams = results_df['country_name'].unique().tolist()
    return jsonify(teams)

@app.route('/years')
def get_years():
    years = results_df['slug_game'].str.extract(r'(\d{4})')[0].dropna().unique().tolist()
    return jsonify(sorted(years))

@app.route('/disciplines')
def get_disciplines():
    disciplines = results_df['discipline_title'].dropna().unique().tolist()
    return jsonify(disciplines)

@app.route('/events')
def get_events():
    events = results_df['event_title'].dropna().unique().tolist()
    return jsonify(events)

@app.route('/game_slugs')
def get_game_slugs():
    game_slugs = results_df['slug_game'].dropna().unique().tolist()
    return jsonify(game_slugs)

@app.route('/participant_types')
def get_participant_types():
    participant_types = results_df['participant_type'].dropna().unique().tolist()
    return jsonify(participant_types)

@app.route('/value_unit_categories')
def get_value_unit_categories():
    if 'value_unit_category' in results_df.columns:
        value_unit_categories = results_df['value_unit_category'].dropna().unique().tolist()
        return jsonify(value_unit_categories)
    else:
        return jsonify([])  # Return an empty list if the column does not exist

@app.route('/value_types')
def get_value_types():
    if 'value_type' in results_df.columns:
        value_types = results_df['value_type'].dropna().unique().tolist()
        return jsonify(value_types)
    else:
        return jsonify([])  # Return an empty list if the column does not exist

if __name__ == '__main__':
    app.run(debug=True)
