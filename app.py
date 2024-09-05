import pandas as pd
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify


def createSimilarity():
    data = pd.read_csv('main_data.csv')  # reading the dataset
    cv = CountVectorizer()
    countMatrix = cv.fit_transform(data['comb'])
    similarity = cosine_similarity(countMatrix)  # creating the similarity matrix
    return data, similarity


def getAllMovies():
    data = pd.read_csv('main_data.csv')
    return list(data['movie_title'].str.capitalize())


def Recommend(movie):
    movie = movie.lower()
    try:
        data.head()  # checks if data is already loaded
        similarity.shape  # checks if similarity matrix is already created
    except:
        data, similarity = createSimilarity()  # load if not already available

    if movie not in data['movie_title'].unique():
        return 'Sorry! The movie you requested is not present in our database.'
    else:
        movieIndex = data.loc[data['movie_title'] == movie].index[0]
        lst = list(enumerate(similarity[movieIndex]))
        lst = sorted(lst, key=lambda x: x[1], reverse=True)
        lst = lst[1:20]  # excluding first item since it is the requested movie itself
        movieList = []
        for i in range(len(lst)):
            a = lst[i][0]
            movieList.append(data['movie_title'][a])
        return movieList


app = Flask(__name__, static_folder='movie-recommender-app/build', static_url_path='/')
CORS(app)

@app.route('/api/movies', methods=['GET'])
@cross_origin()
def movies():
    # returns all the movies in the dataset
    movies = getAllMovies()
    result = {'arr': movies}
    return jsonify(result)


@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/similarity/<name>')
@cross_origin()
def similarity(name):
    movie = name
    recommendations = Recommend(movie)
    if isinstance(recommendations, str):  # check if it's an error message
        apiResult = {'movies': recommendations}
        return jsonify(apiResult)
    else:
        apiResult = {'movies': recommendations}
        return jsonify(apiResult)


@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True)
