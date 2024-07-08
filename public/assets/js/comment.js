const ratingCommentHandler = async (id, event) => {
  event.preventDefault();
  const comment = document.querySelector("#comment-input").value.trim();
  const rating = document.querySelector("#rating-input").value.trim();

  if (comment && rating) {
    console.log("sending request for ID ", id);
    const response = await fetch(`/api/movie/${id}`, {
      method: "PUT",
      body: JSON.stringify({ user_comment: comment, user_rating: rating }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      //   document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  }
};

$("button").click(function (e) {
  e.preventDefault();
  const localID = $(this).attr("id");
  if (localID === "searchButton") {
    const query = document.querySelector("#movie-search").value.trim();

    if (query) {
      window.location.replace(`/search/${query}`);
    }

    return;
  }
  console.log(localID);
  const commentString = `#comment-input-${localID}`;
  const ratingString = `#rating-input-${localID}`;
  const comment = String($(commentString).val());
  console.log("comment: ", comment);
  const rating = Number($(ratingString).val());
  console.log("rating: ", rating);
  if (comment && rating) {
    console.log("sending request for ID ", localID);
    const fetchString = `/api/movies/${localID}`;
    const response = fetch(fetchString, {
      method: "PUT",
      body: JSON.stringify({ user_comment: comment, user_rating: rating }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      //   alert(response.statusText);
    }
  }
});
