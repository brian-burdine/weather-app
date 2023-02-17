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
        appHead.className = "container mb-5";
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
        zipCodeSubmit.addEventListener('click', this.getData.bind(this));
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
        console.log("button clicked!");

        // Grab the contents of the zip code entry field
        let zipCodeEntry = document.getElementById('zip-code-entry');
        let zipCodeTest = zipCodeEntry.value;

        // Check to see if the value obtained looks like a zip code
        if (!zipCodeTest) {
            this.errorMessage = "Please provide a location";
            this.updatePage();
        } else if (zipCodeTest.length != 5) {
            this.errorMessage = "5 digits are required";
            this.updatePage();
        } else if (!Number.isInteger(Number(zipCodeTest))) {
            this.errorMessage = "Only digits, no letters, periods or dashes";
            this.updatePage();
        }
        else { // Input looks solid
            // Store the provided value in the location property
            this.location.zipCode = zipCodeTest;

            // Create a config option to use in the axios call
            let zipOptions = {
                baseURL: this.BASE_URL,
                params: {
                    zip: this.location.zipCode + "," + this.location.country,
                    appid: this.API_KEY
                }
            };

            // Create a promise to access the OpenWeather geocoder API
            axios.get("geo/1.0/zip", zipOptions)
                .then((response) => {
                    this.location.lat = response.data["lat"];
                    this.location.lon = response.data["lon"];
                    this.location.city = response.data["name"];
                    
                    console.log(this.location);

                    // Create a config option to use in the axios call
                    let weatherOptions = {
                        baseURL: this.BASE_URL,
                        params: {
                            lat: this.location.lat,
                            lon: this.location.lon,
                            appid: this.API_KEY
                        }
                    };

                    // Create a promise to access the OpenWeather weather API
                    axios.get("data/2.5/weather", weatherOptions)
                        .then((response) => {
                            this.updateWeather(response.data);
                            this.updatePage();
                        })
                        .catch((error) => {
                            console.log("Call failed");
                            console.log(error);

                            this.errorMessage = error;
                            this.updatePage();
                        });
                })
                .catch((error) => {
                    console.log("Call failed");
                    console.log(error);

                    this.errorMessage = error;
                    this.updatePage();
                });
        }

    },

    // A function that takes the data received from a successful API call and
    // stores the relevant information from it in local memory
    updateWeather: function (data) {
        console.log("updateWeather called");

        // Grab the temperature, doing conversions from kelvin as necessary
        let temp = data.main.temp;
        this.weather.temperature.kelvin = temp + " K";
        this.weather.temperature.celsius = (temp - 273.15) + " C";
        this.weather.temperature.fahrenheit = ((temp -273.15) * 9 / 5 + 32) 
            + " F";
        
        // Get the current condition, capitalize the first letter
        this.weather.condition = data.weather[0].description;
        this.weather.condition = this.weather.condition.charAt(0).toUpperCase()
            + this.weather.condition.substring(1);
        
        // Get the icon for the current weather
        this.weather.image = '<img src="https://openweathermap.org/img/wn/'
            + data.weather[0].icon + '@2x.png" alt ="An icon depicting current '
            + 'weather conditions">';
        
        console.log(this.weather);
    },

    // A function that displays the most recently generated content to the
    // page, either information about the current weather in a valid zip code,
    // or an error message describing why no weather information is available.
    updatePage: function () {
        console.log("updatePage called");
        
        console.log(this.location);

        // Get a reference to the container for the body, create a border 
        // around it
        let body = document.getElementById('app-body');
        body.classList.add("border-2");

        // Create a new html fragment to write new elements to
        let newPage = new DocumentFragment();

        // If an error message has been created, display it and empty it
        if (this.errorMessage) {
            newPage.appendChild(this.makeRow(this.errorMessage));
            console.log(this.errorMessage);
            this.errorMessage = "";
        }
        // If no error message exists and the weather condition has been set,
        // display the weather and empty out the condition
        else if (this.weather.condition) {
            newPage.appendChild(this.makeRow(this.location.city, "City"));
            newPage.appendChild(this.makeRow(this.weather.temperature, 
                "Temperature"));
            newPage.appendChild(this.makeRow(this.weather.condition, 
                "Condition"));
            newPage.appendChild(this.makeRow(this.weather.image, 
                "Other Info"));
            console.log(this.weather.condition);
            this.weather.condition = "";
        }

        // Add the created elements to the body
        body.appendChild(newPage);
    },

    // A function that creates a row and column <div> element to interact with
    // Bootstrap's stylesheet. The column contains either a table with a piece
    // of weather information, or a paragraph containing an error message.
    makeRow: function (element, title) {
        // Create a new row and column to place content in
        let row = document.createElement('div');
        row.className = "row mb-3";
        let col = document.createElement('div');
        col.className = "col";

        // If a title was passed, convert element and title into a table and
        // place it in the column. Otherwise, create a paragraph with element
        // and place it in the column
        if (title) {
            let table = this.makeTable(element, title);
            col.appendChild(table);
        } else {
            let para = document.createElement('p');
            para.innerText = element;
            col.appendChild(para);
        }

        // Place the column in the row and return the reference to the row
        row.appendChild(col);
        return row;
    },

    // A function that creates a table with two rows, the first with a title
    // and the second with enough cells to display all components of an
    // element that was passed to it. 
    makeTable: function (element, title) {
        // Create a table element, give it a border
        let table = document.createElement('table');
        table.className = "table table-bordered";
        
        // Create the table heading
        let head = document.createElement('thead');
        let topRow = document.createElement('tr');
        topRow.className = "table-warning";
        let titleCell = document.createElement('th');
        titleCell.setAttribute('scope', 'col');
        titleCell.innerText = title;
        topRow.appendChild(titleCell);
        head.appendChild(topRow);

        // Create the table body
        let body = document.createElement('tbody');
        body.className = "table-group-divider";
        let bottomRow = document.createElement('tr');
        // If element is a string, create a single cell and put element inside
        if (typeof element == "string") {
            let elementCell = document.createElement('td');
            elementCell.innerHTML = element;
            bottomRow.appendChild(elementCell);
        } else if (typeof element == "object") {
            let properties = Object.getOwnPropertyNames(element);
            debugger;
            for (property of properties) {
                let elementCell = document.createElement('td');
                elementCell.innerHTML = element[property];
                bottomRow.appendChild(elementCell);
            }
        }
        body.appendChild(bottomRow);

        // Complete the table and return it
        table.appendChild(head);
        table.appendChild(body);
        return table;
    }
}

// Call to initialize the page
WeatherApp.init();