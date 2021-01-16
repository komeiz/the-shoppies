import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [resultArray, setResultArray] = useState([]);
  const [nominationsArray, setNominationsArray] = useState([]);
  const [seachResultName, setResultName] = useState("");
  const [loading, setLoading] = useState(false);
  const [nomIDs, setNomIds] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showView, setView] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setResultName("");
      setView(false);
      setLoading(true);
      fetchMovies(event.target.value);
    }
  };

  const fetchMovies = async (val) => {
    let response = await fetch(
      `http://www.omdbapi.com/?s=${val}&apikey=5fa09413`
    );
    let data = await response.json();
    //console.log(data.Search);
    if (data.Search !== undefined) {
      setResultArray(data.Search);
      setResultName(val);
      setView(false);
    } else {
      setView(true);
    }
    setLoading(false);
  };

  const nominateMovieBtn = (item) => {
    if (nominationsArray.length === 5) {
      alert("You can't have more than 5 nominations");
      return;
    }

    let filteredArray = nominationsArray.filter(
      (obj) => obj.imdbID === item.imdbID
    );

    if (filteredArray.length > 0) {
      return;
    } else {
      setNomIds([...nomIDs, item.imdbID]);
    }

    setNominationsArray([...nominationsArray, item]);
    // disableBtn()
  };

  const removeNominated = (item) => {
    //console.log(item.imdbID);
    let filteredArray = nomIDs.filter((val) => val !== item.imdbID);
    setNomIds(filteredArray);

    let secondFilteredArray = nominationsArray.filter(
      (obj) => obj.imdbID !== item.imdbID
    );
    setNominationsArray(secondFilteredArray);

    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  return (
    <div className="main">
      <div className="container">
        <h1 className=" page-title">The Shoppies</h1>

        <div className="search-section">
          <div className="container">
            <label
              for="movie-title"
              className="form-label movie-tlt text-black"
            >
              Movie title
            </label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <i className="fa fa-search"> </i>
              </span>
              <input
                type="text"
                className="form-control "
                id="movie-title"
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="spinner-con text-center mt-5">
            <div className="spinner-border text-light " role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {nominationsArray.length === 5 && (
          <div class="alert-banner">
            <p>
              Your nominated movies list is complete and cannot be more than 5!
            </p>
          </div>
        )}

        {showView && (
          <div class="alert-banner">
            <p>You do not have a search result!</p>
          </div>
        )}

        {!showView && seachResultName !== "" && (
          <div className="results-nominees-sec">
            <div className=" srch-rels-sec ">
              <h4 className="text-primary">
                Results for {`${seachResultName}`}
              </h4>
              <ul className="movies-list">
                {resultArray.map((item, index) => (
                  <li className="d-flex flex-row" key={index}>
                    <div className="movie-title-year-sec">
                      <span>
                        {item.Title} {`(${item.Year})`}
                      </span>
                    </div>
                    <div className="nominate-btns-sec">
                      <button
                        disabled={nomIDs.includes(item.imdbID) ? true : false}
                        className="btn btn-primary"
                        onClick={() => nominateMovieBtn(item)}
                      >
                        Nominate
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className=" nominations-sec">
              {showAlert && (
                <div class="text-danger del-alert">
                  <p>You just deleted a movie!</p>
                </div>
              )}
              <h4 className="text-success">Nominations</h4>
              <ul className="nominated-list-sec">
                {nominationsArray.map((item, index) => (
                  <li className="d-flex flex-row" key={index}>
                    <div className="nominated-sec">
                      <span>{item.Title}</span>
                    </div>

                    <div className="remove-btns-sec">
                      <button
                        onClick={() => removeNominated(item)}
                        className="btn btn-danger"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
                {nominationsArray.length == 0 && (
                  <div class="empty-alert ">
                    <p>Your list is empty!</p>
                  </div>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
