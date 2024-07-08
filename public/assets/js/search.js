const searchFormHandler = async (event) => {
  event.preventDefault();

  const query = document.querySelector("#movie-search").value.trim();

  if (query) {
    window.location.replace(`/search/${query}`);
  }
};

document
  .querySelector(".search-form")
  .addEventListener("submit", searchFormHandler);
