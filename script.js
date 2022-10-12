$(".thumbs-btns .thumb").hide();
$("#musicSeeMoreBtn").hide();
$("#drinkModal").hide();

// function to get 10 random songs from Music API
function getRandomInt(max) {
  return Math.ceil(Math.random() * max);
}

//music API and setting its variables
var musicTitle;
var musicPic;
var musicModalData;
function getMusicData() {
  const settings = {
    async: true,
    crossDomain: true,
    url: `https://shazam.p.rapidapi.com/charts/track?locale=en-US&pageSize=10&startFrom=${getRandomInt(
      190
    )}`,
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "shazam.p.rapidapi.com",
      "X-RapidAPI-Key": "6f27f2e39dmsh9c874ef8b0307c6p1cee6bjsn7b2e2cb10aac",
    },
  };
  $.ajax(settings).done(function (data) {
    console.log(data, "musicData");
    musicModalData = data.tracks;
    musicTitle = data.tracks[0].share.subject;
    musicPic = data.tracks[0].images.background;

    // if musicTitle too long in mobile version then get shorter
    var titleLength = musicTitle.length;
    console.log("titleLength", titleLength);
    // if ($(window).width() < 750) {
    if (titleLength > 25) {
      console.log(getWords(musicTitle));
      musicTitle = getWords(musicTitle) + "...";
      console.log(musicTitle);
    } else {
      musicTitle === musicTitle;
      console.log(musicTitle);
    }
    // }
    function getWords(str) {
      return str.split(/\s+/).slice(0, 5).join(" ");
    }
  });
}

// Drink API and its variables
const cocktailApi = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
var drinkData;
var ingredientsArray;
var measuresArray;
var directionsArray;
function getDrinkData() {
  $.ajax({
    url: cocktailApi,
    method: "GET",
    data: {
      "api-key": "1",
    },
    // only extracting data with value
  }).then(function (response) {
    drinkData = response.drinks[0];

    console.log(response);
    console.log(drinkData.strDrink);

    var drinkEntriesDataArray = Object.entries(drinkData);

    ingredientsArray = drinkEntriesDataArray
      .filter(
        ([key, value]) =>
          key.startsWith("strIngredient") && value && value.trim()
      )
      .map(([key, value]) => value);

    measuresArray = drinkEntriesDataArray
      .filter(
        ([key, value]) => key.startsWith("strMeasure") && value && value.trim()
      )
      .map(([key, value]) => value);

    var imageArray = drinkEntriesDataArray
      .filter(([key, value]) => key.startsWith("strDrinkThumb"))
      .map(([key, value]) => value);

    directionsArray = drinkEntriesDataArray
      .filter(([key, value]) => key.startsWith("strInstructions"))
      .map(([key, value]) => value);
  });
}

// function to append fave drinks list to offCanvas
function getFaveDrinksLi() {
  drinkFavArray = JSON.parse(localStorage.getItem("drinkFav")) || [];
  $("#append-fav-drinks").empty();
  for (let i = 0; i < drinkFavArray.length; i++) {
    const faveDrinkObj = drinkFavArray[i];
    var faveDrinkLi = $("<li>", {
      class: "list-group-flush",
    });
    faveDrinkLi.text(faveDrinkObj);
    $("#append-fav-drinks").append(faveDrinkLi);
  }
}

// function for drink recipe
function getDrinkRecipe() {
  $("#drinkModalTitle").text(drinkData.strDrink);
  $("#modalDrinkImage").attr("src", drinkData.strDrinkThumb);
  $("#appendDrinkIng").empty();
  for (let i = 0; i < ingredientsArray.length; i++) {
    const ingObj = ingredientsArray[i];
    var ingLi = $("<span>");
    ingLi.text(ingObj);
    const measuresObj = measuresArray[i] || "to taste";
    var measuresSpan = $("<li>", {
      class: "list-group-item",
    });
    measuresSpan.text(" " + measuresObj);
    ingLi.append(measuresSpan);
    $("#appendDrinkIng").append(ingLi);
  }
  $("#drinkDirections").text(drinkData.strInstructions);
}

// function/ event listner for music carousel
$(".carousel-bg").hide();
function getTenSongs() {
  $(".carousel-inner").empty();
  $(".carousel-bg").show();
  for (let i = 0; i < musicModalData.length; i++) {
    const songsObj = musicModalData[i];
    console.log(songsObj);
    var carouselItem = $("<div>", {
      class: "carousel-item",
    });
    if (i === 0) {
      carouselItem = $("<div>", {
        class: "carousel-item active",
      });
    } else {
      carouselItem = $("<div>", {
        class: "carousel-item",
      });
    }
    var songsImg = $("<img>", {
      src: songsObj.images.background,
      class: "d-block w-100",
    });
    var carouselCaption = $("<div>", {
      class: "carousel-caption d-none d-md-block",
    });
    var songsTitle = $("<h4>", {
      class: "carousel-caption d-none d-md-block bg-black rounded-3",
    });
    songsTitle.text(songsObj.share.subject);
    carouselCaption.append(songsTitle);
    carouselItem.append(songsImg);
    carouselItem.append(carouselCaption);
    $(".carousel-inner").append(carouselItem);
  }
}
