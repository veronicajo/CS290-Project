/* ---------- Bootstrap's Carousel ---------- */

// Activate Carousel
$(".carousel").carousel()

// Enable Carousel Indicators
$(".item1").click(function(){
  $(".carousel").carousel(0);
});
$(".item2").click(function(){
  $(".carousel").carousel(1);
});
$(".item3").click(function(){
  $(".carousel").carousel(2);
});
$(".item4").click(function(){
  $(".carousel").carousel(3);
});
  
// Enable Carousel Controls
$(".carousel-control-prev").click(function(){
  $(".carousel").carousel("prev");
});
$(".carousel-control-next").click(function(){
  $(".carousel").carousel("next");
});

/* ---------- Button on Edvard Munch Page ---------- */

// Only runs if we are on the Edvard Munch page
var buttonElement = document.getElementById("emunchMore")
if (buttonElement != null) {
  buttonElement.addEventListener("click", function(event) {
    var url = "http://flip2.engr.oregonstate.edu:7531/emunch/more"
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener('load', function() {
      var response = JSON.parse(req.responseText);
      var column = document.getElementById("eMMoreData");
      var resArray = response.default.geoMapData;

      var headerRow = document.createElement("div");
      headerRow.appendChild(document.createTextNode("Here are the top 10 countries where Edvard Munch was most Googled:"));
      column.appendChild(headerRow);
      column.appendChild(document.createElement("br"));

      for (index = 0; index < 18; index++) {
        if (resArray[index].hasData[0] == true) {
          var new_row = document.createElement("div");
          var country = document.createTextNode(resArray[index].geoName);
          new_row.appendChild(country);
          column.appendChild(new_row);
        }
      }
      disableButton("emunchMore");
    });
    req.send(null);
    event.preventDefault();
  })

  function disableButton(buttonName) {
    document.getElementById(buttonName).disabled = true;
  }
}

/* ---------- Form POST Request on Sources Page ---------- */

// Only runs if we are on the Sources page
var formButton = document.getElementById("submitSurvey")
if (formButton != null) {
  formButton.addEventListener("click", function(event) {
    var url = "http://httpbin.org/post"
    var req = new XMLHttpRequest();
    var input = {visitorName: null, visitorEmail: null, visitorComments: null};
    input.visitorName = document.getElementById('visitorName').value;
    input.visitorEmail = document.getElementById('visitorEmail').value;
    input.visitorComments = document.getElementById('visitorComments').value;

    if ((input.visitorName != "") && (input.visitorComments != "")) {
      req.open("POST", url, true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400){
          var resMsg = document.createElement("row")
          document.getElementById("survey").appendChild(resMsg)
          resMsg.appendChild(document.createTextNode("Thank you for submitting the survey! "))
        }
      });
      req.send(JSON.stringify(input));
    }
    else {
      var errorMsg = document.createElement("row")
      document.getElementById("survey").appendChild(errorMsg)
      errorMsg.appendChild(document.createTextNode("Please enter a name and comment. "))
    }
    event.preventDefault();
  });
}