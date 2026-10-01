function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  // FIXED: Using a standard for-loop to safely read the HTML 'value' attribute
  for (var i = 0; i < uiBathrooms.length; i++) {
    if (uiBathrooms[i].checked) {
        return parseInt(uiBathrooms[i].value);
    }
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  // FIXED: Using a standard for-loop to safely read the HTML 'value' attribute
  for (var i = 0; i < uiBHK.length; i++) {
    if (uiBHK[i].checked) {
        return parseInt(uiBHK[i].value);
    }
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  
  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  
  // Base validation to ensure inputs are captured correctly
  if (!sqft || sqft.value === "") {
      alert("Please enter a valid area square feet value.");
      return;
  }

  var url = "http://127.0.0.1:5000/predict_home_price"; // Direct local testing URL
  // var url = "/api/predict_home_price"; // Nginx URL

  console.log("Sending payload:", {
      total_sqft: parseFloat(sqft.value),
      bhk: bhk,
      bath: bathrooms,
      location: location.value
  });

  $.post(url, {
      total_sqft: parseFloat(sqft.value),
      bhk: bhk,
      bath: bathrooms,
      location: location.value
  }, function(data, status) {
      console.log("Response data:", data);
      
      if (data && data.estimated_price !== undefined) {
          // FIXED: Updates the empty <h2> inside your yellow #uiEstimatedPrice box safely
          $('#uiEstimatedPrice h2').text(data.estimated_price.toString() + " Lakh");
      } else {
          $('#uiEstimatedPrice h2').text("Error with prediction data");
      }
      console.log(status);
  }).fail(function(xhr, status, error) {
      console.error("Error from Flask backend:", xhr.responseText);
      $('#uiEstimatedPrice h2').text("Server Connection Error");
  });
}

function onPageLoad() {
  console.log("document loaded");
  var url = "http://127.0.0.1:5000/get_location_names"; // Direct local testing URL
  // var url = "/api/get_location_names"; // Nginx URL
  
  $.get(url, function(data, status) {
      console.log("got response for get_location_names request");
      if(data && data.locations) {
          var locations = data.locations;
          var uiLocations = $('#uiLocations');
          uiLocations.empty();
          
          // Add a placeholder default value
          uiLocations.append('<option value="" disabled selected>Choose a Location</option>');
          
          // FIXED: Uses safe programmatic loop for adding data options array
          locations.forEach(function(loc) {
              var opt = document.createElement('option');
              opt.value = loc;
              opt.innerHTML = loc;
              uiLocations.append(opt);
          });
      }
  });
}

window.onload = onPageLoad;