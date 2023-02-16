/*
    This application generates elements on an HTML page to receive a US zip
        from a user and make a call to OpenWeather's public APIs to get the
        current weather at that location, then display some of that information
        on the page, as well as tell the user if and how that lookup was
        unsuccessful.
*/
const WeatherApp = {
    // The base url for OpenWeather's public APIs
    BASE_URL: "https://api.openweathermap.org/",

    // My key to access OpenWeather's public APIs, please don't use outside
    // of this application
    API_KEY: "233860124f2a0242d7f74efedc30506b",

    // An object containing various descriptors of a place in the world
    location: {
        zipCode: 0,
        lat: 0,
        lon: 0,
        city: "",
        country: "us"
    },

    // An object containing properties that describe weather conditions in a
    // given location
    weather: {
        temperature: {
            kelvin: "",
            celsius: "",
            fahrenheit: ""
        },
        condition: "",
        image: ""
    },

    // A string giving detailed information about application fail states
    errorMessage: "",

    // Function to render the starting state of the page, with a header element
    // to name the application and a set of input elements for a user to submit
    // a zip code
    init: function () {
        let main = document.getElementById('main');

        let newPage = new DocumentFragment();

        let appShell = document.createElement('div');
        appShell.className = "container";

        let outerRow = document.createElement('div');
        outerRow.className = "row justify-content-center";

        let outerCol = document.createElement('div');
        outerCol.className = "col-4";

        let appHead = document.createElement('div');
        appHead.className = "container";
        appHead.id = "app-head";

        let innerRow = document.createElement('div');
        innerRow.className = "row"

        let innerCol = document.createElement('div');
        innerCol.className = "col";

        let header = document.createElement('h3');
        header.className = "text-center";
        header.innerText = "Weather App";
        innerCol.appendChild(header);

        let appForm = document.createElement('div');
        appForm.id = "app-form";

        let formLabel = document.createElement('label');
        formLabel.setAttribute('for', "zip-code-entry");
        formLabel.innerText = "Enter a zip code:"

        let inputGroup = document.createElement('div');
        inputGroup.className = "input-group";

        let zipCodeEntry = document.createElement('input');
        zipCodeEntry.id = "zip-code-entry";
        zipCodeEntry.className = "form-control";
        zipCodeEntry.setAttribute('type', "text");
        inputGroup.appendChild(zipCodeEntry);

        let zipCodeSubmit = document.createElement('button');
        zipCodeSubmit.id = "zip-code-submit";
        zipCodeSubmit.className = "btn btn-primary";
        zipCodeSubmit.setAttribute('type', "button");
        zipCodeSubmit.innerText = "Get Weather";
        zipCodeSubmit.addEventListener('click', this.getData);
        inputGroup.appendChild(zipCodeSubmit);

        let formText = document.createElement('div');
        formText.className = "form-text";
        formText.innerText = "Enter a 5-digit US postal code, e.g. 90210";

        appForm.appendChild(formLabel);
        appForm.appendChild(inputGroup);
        appForm.appendChild(formText);

        innerCol.appendChild(appForm);
        innerRow.appendChild(innerCol);
        appHead.appendChild(innerRow);

        outerCol.appendChild(appHead);

        let appBody = document.createElement('div');
        appBody.className = "container";
        appBody.id = "app-body";
        outerCol.appendChild(appBody);

        outerRow.appendChild(outerCol);
        appShell.appendChild(outerRow);
        newPage.appendChild(appShell);

        main.appendChild(newPage);

    },

    // The callback function for the event listener attached to the submit
    // button, this checks the contents of the text field. If it looks like a
    // proper zip code, an attempt to access the OpenWeather API with that
    // code is attempted. If it succeeds, the weather data is fetched and
    // displayed. If the access attempt failed, or if the input provided did
    // not appear to be a zip code, an error message is created and displayed.
    getData: function () {
        console.log("button clicked!")
    },

    // A function that takes the data received from a successful API call and
    // stores the relevant information from it in local memory
    updateWeather: function (data) {},

    // A function that displays the most recently generated content to the
    // page, either information about the current weather in a valid zip code,
    // or an error message describing why no weather information is available.
    updatePage: function () {},

    // A function that creates a row and column <div> element to interact with
    // Bootstrap's stylesheet. The column contains either a table with a piece
    // of weather information, or a paragraph containing an error message.
    makeRow: function (element, title) {},

    // A function that creates a table with two rows, the first with a title
    // and the second with enough cells to display all components of an
    // element that was passed to it. 
    makeTable: function (element, title) {}
}

// Call to initialize the page
WeatherApp.init();