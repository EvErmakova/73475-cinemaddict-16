const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class ApiService {
  #url = null;
  #authorization = null;

  constructor(url, authorization) {
    this.#url = url;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `'movies'/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptFilmToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  getComments = async (filmId) => (
    this.#load({url: `comments/${filmId}`}).then(ApiService.parseResponse)
  );

  addComment = async (filmId, comment) => {
    const response = await this.#load({
      url: `comment/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(this.#adaptCommentToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  deleteComment = async (commentId) => (
    this.#load({url: `comments/${commentId}`})
  );

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(`${this.#url}/${url}`, {method, body, headers});

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptFilmToServer = ({id, filmInfo, userDetails, comments}) => {
    const adaptedFilm = {
      id,
      'film_info': {
        ...filmInfo,
        'alternative_title': filmInfo.alternativeTitle,
        'total_rating': filmInfo.totalRating,
        'age_rating': filmInfo.ageRating,
        release: {
          date: filmInfo.release.date.toISOString(),
          'release_country': filmInfo.releaseCountry
        }
      },
      'user_details': {
        ...userDetails,
        'already_watched': userDetails.alreadyWatched,
        'watching_date': userDetails.watchingDate instanceof Date ? userDetails.watchingDate.toISOString() : null
      },
      comments
    };

    delete adaptedFilm['film_info'].alternativeTitle;
    delete adaptedFilm['film_info'].totalRating;
    delete adaptedFilm['film_info'].ageRating;
    delete adaptedFilm['film_info'].releaseCountry;
    delete adaptedFilm['user_details'].alreadyWatched;
    delete adaptedFilm['user_details'].watchingDate;

    return adaptedFilm;
  }

  #adaptCommentToServer = (comment) => ({
    ...comment,
    date: comment.date.toISOString()
  });

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
