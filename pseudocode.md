# Weather App
## Goals

Display information about the current weather conditions in a place provided by a user. When the user loads the the application, an input field and a button are generated in the HTML document. When the user submits their location, the application sends a request to the OpenWeather API with that location and receives a response. If the request was successful, it populates the page with weather information: the place, the temperature, local conditions (like sunny, cloudy, or thunderstorms), and an image visualizing those conditions. If the request failed, an error message indicating the reason for failure is displayed instead.

## Variables

We want to track: the state of the page (loaded w/ no input, a correctly submitted location displayed, or an error message indicating the location was bad displayed), the location provided by the user, and the information provided by the API

Let's try an object for the app, WeatherApp:
- **WeatherApp**
  - **BASE_URL**: a constant string containing the base url of the OpenWeather API
  - **API_KEY**: a constant string containing a hexadecimal key to the OpenWeather API
  - *location*: an object representing a place in the world with measured weather
    - *zipCode*: a five-digit integer describing a postal code, derived from user input
    - *lat*: a floating point number describing a lattitude, obtained from OpenWeather's geocoding API after a zipCode has been provided
    - *lon*: a floating point number describing a longitude, obtained from OpenWeather's geocoding API after a zipCode has been provided
    - *city*: a string with the name of a city, obtained from OpenWeather's geocoding API after a zipCode has been provided
    - *country*: a string containing an abbreviation of a country, by default this will be 'US' for the United States, and will only change if the scope of this application changes
  - *weather*: an object containing properties that describe the current weather at a location, populated by a request to the OpenWeather API
    - *temperature*: an object containing three representations of the current temperature
      - *kelvin*: string, temperature in kelvin, the default value returned by the API
      - *celsius*: string, temperature in degrees celsius
      - *fahrenheit*: string, temperature in degrees fahrenheit
    - *condition*: a string describing the current state of the weather, like 'sunny' or 'blizzard', by default an empty string
    - *image*: a string containing the source path of an image to display depicting the current weather
  - *errorMessage*: a string with a message describing a problem with the user's inputted location, by default an empty string 


## Functions

WeatherApp has the following methods:
- **init**()
  - When called, generates the opening page: a title labeling our application 'Weather App', a text field where the user is prompted to provide a location, and a button to submit that data. The button is provided with an event listener that calls another method, **getData**
  - Procedure:
    1. START **init**
    2. GET a reference to the HTML element with the id "main" name it *main*
    3. CREATE a new document fragment, name it *newPage* 
    4. CREATE a new `<div>` element, name it *appShell*
    5. SET *appShell*'s class to "container"
    6. CREATE a new `<div>` element, name it *outerRow*
    7. SET *outerRow*'s class to "row justify-content-center"
    8. CREATE a new `<div>` element, name it *outerCol*
    9. SET *outerCol*'s class to "col-4"
    10. CREATE a new `<div>` element, name it *appHead*
    11. SET *appHead*'s class to "container"
    12. SET *appHead*'s id to "app-head"
    13. CREATE a new `<div>` element, name it *innerRow*
    14. SET *innerRow*'s class to "row"
    15. CREATE a new `<div>` element, name it *innerCol*
    16. SET *innerCol*'s class to "col"
    17. CREATE a new `<h3>` element, name it *header*
    18. SET *header*'s class to "text-center"
    18. SET *header*'s inner text to 'Weather App'
    19. APPEND *header* to *innerCol*
    20. CREATE a new `<div>` element, name it *appForm*
    21. SET *appForm*'s id to "app-form"
    22. CREATE a new `<label>` element, name it *formLabel*
    23. SET *formLabel*'s for attribute to "zip-code-entry"
    24. SET *formLabel*'s class to "form-label*
    25. SET *formLabel*'s inner text to "Enter a zip code:"
    26. CREATE a new `<div>` element, name it *inputGroup*
    27. SET *inputGroup*'s class to "input-group*
    28. CREATE a new `<input>` element, name it *zipCodeEntry*
    29. SET *zipCodeEntry*'s id to "zip-code-entry"
    30. SET *zipCodeEntry*'s class to "form-control"
    31. SET *zipCodeEntry*'s type to "text"
    32. APPEND *zipCodeEntry* to *inputGroup*
    33. CREATE a new `<button>` element, name it *zipCodeSubmit*
    34. SET *zipCodeSubmit*'s id to "zip-code-submit"
    35. SET *zipCodeSubmit*'s class to "btn btn-primary"
    36. SET *zipCodeSumbit*'s type to "button"
    38. SET *zipCodeSubmit*'s inner text to "Get Weather"
    37. ADD an event listener to *zipCodeSubmit* that calls the **getData** method after a 'click' event
    38. APPEND *zipCodeSubmit* to *inputGroup*
    39. CREATE a new `<div>` element, name it *formText*
    40. SET *formText*'s class to "form-text"
    41. SET *formText*'s inner text to "Enter a 5-digit US postal code, e.g. 90210"
    42. APPEND *formLabel* to *appForm*
    43. APPEND *inputGroup* to *appForm*
    44. APPEND *formText* to *appForm*
    45. APPEND *appForm* to *innerCol*
    46. APPEND *innerCol* to *innerRow*
    47. APPEND *innerRow* to *appHead*
    48. APPEND *appHead* to *outerCol*
    49. CREATE a new `<div>` element, name it *appBody*
    50. SET *appBody*'s class to "container"
    51. SET *appBody*'s id to "app-body"
    52. APPEND *appBody* to *outerCol*
    53. APPEND *outerCol* to *outerRow*
    54. APPEND *outerRow* to *appShell*
    55. APPEND *appShell* to *newPage*
    56. APPEND *newPage* to *main*
    57. END **init** (!!!)
- **getData**
  - When called, **getData** checks for a value in the 'zip-code-entry' element in the HTML document, and if it is there and (seemingly) a valid zip code, makes a request to the OpenWeather Geocoding API to convert the zip code to expanded location information. If that succeeds, the information is used to make a call to the OpenWeather data API to get information about the current weather at that location. If this request is successful, the response is passed to the **updateWeather** method to extract the data, and then a call is made to the **updatePage** method to display that information to the page. If the requests fail, or our preliminary check of the value of the location element indicated that a proper location was not provided, instead the *errorMessage* property is updated to a description of the problem, and **updatePage** is called to display the error message.
  - Procedure:
    1. START **getData**
    2. GET a reference to the 'zip-code-entry' element in the HTML document
    3. IF the 'zip-code-entry' element has no value
       - SET *errorMessage* to "Please provide a location"
       - CALL **updatePage**
    4. ELSE IF the value of the 'zip-code-entry' element is not exactly 5 characters long
       - SET *errorMessage* to "5 digits are required"
       - CALL **updatePage**
    5. ELSE IF the value of the 'zip-code-entry' element is not an integer
       - SET *errorMessage* to "Only digits, no letters, periods or dashes"
       - CALL **updatePage**
    6. ELSE (input value looks good)
       - SET the *zipCode* property of *location* equal to the value of the 'zip-code-entry' element
       - INIT a *zipOptions* object with the keys *baseURL* and *params*, where *baseURL* has a value of **BASE_URL**, and *params* with an object as its value. *params* contains the keys *zip* with the value of the *zipCode* and *country* properties of *location*, joined by a comma, and *appid* with the value of **API_KEY**
       - Create a new promise using the Axios client's `get` command, making a call to OpenWeather's geocoding API using *zipOptions* as the config argument
         - If the call is successful
           - SET location's *lat* property to the response's *lat* property
           - SET *location*'s *lon* property to the response's *lon* property
           - SET *location*'s *city* property to the response's *name* property
           - INIT a *weatherOptions* object with the keys *baseURL* and *params*, where *baseURL* has a value of **BASE_URL** and *params* with an object as its value. *params* contains the keys *lat* with the value of lat property of *location*, *lon* with the value of the *lon* property of *location*, and *appid* with the value of **API_KEY**
           - Create a new promise using the Axios client's `get` command, making a call to OpenWeather's data API using *weatherOptions* as the config argument
             - IF the call is successful
               - CALL **updateWeather**, passing it the response
               - THEN CALL **updatePage**
             - ELSE IF the call fails
               - SET *errorMessage* to response (probably a server error if the input was good for the first API call)
               - CALL **updatePage**
             - ENDIF 
         - ELSE IF the (geocoding) call fails
           - SET *errorMessage* to (zipCode): (message response, should be "not found")
           - CALL **updatePage**
         - ENDIF
    7. ENDIF
    8. END **getData**
  - updatePage should have been called in all of the conditional statements; it would be nice to just do a call at the end, but waiting on the promise to be fulfilled means at least those calls need to be in the `.then` functions
- **updateWeather** (*data*)
  - When called, **updateWeather** picks through the *data* object generated by the OpenWeather API and sets the properties of *weather* to the relevant properties of data
  - Procedure:
    1. START **updateWeather**
    2. READ *data*
    3. SET the *kelvin* property of the *temperature* object of *weather* to a string with the value of the *temp* property of the *main* object of *data* plus the string " K"
    4. CALCULATE and SET the *celsius* property of the *temperature* object of *weather* to a string with the value of the *temp* property of the *main* object of *data* - 273.15 plus the string " C"
    5. CALCULATE and SET the *fahrenheit* property of the *temperature* object of *weather* to a string with the value (the value of the *temp* property of the *main* object of *data* -273.15) * 9 / 5 + 32 plus the string " F"
    6. SET the *condition* property of *weather* to the value of the *description* property of the *weather* object of *data*
    7. SET the *image* property of *weather* to the string `<img src='https://openweathermap.org/img/wn/` + the value of the *icon* property of the *weather* object of *data* + the string `@2x.png' alt='An icon depicting current weather conditions'>` (this url points to a 100x100 pixel image representation of the current weather)
    8. END **updateWeather**
- **updatePage**
  - When called, **updatePage** checks to see if there is currently an error message described. If there is, that message is rendered to the screen. If not, and there is weather data available to show, that is instead rendered to the screen.
  - Procedure
    1. START **updatePage**
    2. GET a reference to the HTML element with the id 'app-body', name it *body*
    3. CREATE a new HTML document fragment, name it *newPage*
    4. IF *errorMessage* contains a non-empty string
       - CALL **makeRow** with *errorMessage* as an argument and APPEND the result to *newPage*
       - SET *errorMessage* to an empty string
    5. ELSE IF *condition* of the *weather* property contains a non-empty string
       - CALL **makeRow** with the *city* property of *location* and the string "City" as arguments and APPEND the result to *newPage*
       - CALL **makeRow** with the *temperature* property of *weather* and the string "Temperature" as arguments and APPEND the result to *newPage*
       - CALL **makeRow** with the *condition* property of *weather* and the string "Condition" as arguments and APPEND the result to *newPage*
       - CALL **makeRow** with the *image* property of *weather* and the string "Other Info" as arguments and APPEND the result to *newPage*
       - SET *condition* of the *weather* property to an empty string
    6. ENDIF 
    7. APPEND *newPage* to *body*
    8. END **updatePage**
  - TODO:
    - Clear out the rest of data in *location* and *weather*, possibly storing it in local storage
    - The titles I'm passing to makeRow are *mostly* the same as the property name, would be nice if I didn't have to type them out. Could set up an array or object that defines the order of elements on the page that would be extendable
    - Make a clear/reset button to remove stuff rendered to the screen, possibly
- **makeRow** (*element*, *title*)
  - When called, **makeRow** creates HTML elements to make a new row using Bootstrap's grid system that contains the passed *element*. It checks for the presence of a passed *title*; if there is one, it calls the **makeTable** method to create a table out of the *element* and *title*. If no title is passed, it instead writes the *element* to a paragraph `<p>` and appends it to the 'col' `<div>`.  It returns a reference to the top 'row' `<div>` Currently this is only planned to be used for the body of the app, but I would like to also make it work for the form at the top of the head.
  - Procedure
    1. START **makeRow**
    2. READ *element*, *title*
    3. CREATE a new `<div>` element, name it *row*
    4. SET *row*'s class to "row"
    5. CREATE a new `<div>` element, name it *col*
    6. SET *col*'s class to "col"
    7. IF there is a title
       - INIT *table* to the value of **makeTable**, passed *element* and *title* as arguments
       - APPEND *table* to *col*
    8. ELSE
       - CREATE a new `<p>` element, name it *para*
       - SET *para*'s inner text to *element*
       - APPEND *para* to *col*
    9. ENDIF
    10. APPEND *col* to *row*
    11. RETURN *row*
    12. END **makeRow**
- **makeTable** (*element*, *title*)
  - When called, **makeTable** creates HTML elements to populate a table with the passed *element* and *title*. The table has two rows; on top is a row that contains the *title*, while the bottom row contains however many items are contained in *element*. *element* will be either a string, resulting in one table cell, or an object containing multiple strings, which will be placed into multiple table cells. The row containing the title will be styled to have a different color, and the whole table will have a border. **makeTable** returns a reference to the fleshed-out `<table>` element.
  - Procedure
    1. START **makeTable**
    2. READ *element*, *title*
    3. CREATE a new `<table>` element, name it *table*
    4. SET *table*'s class to "table table-bordered"
    5. CREATE a new `<thead>` element, name it *head*
    6. CREATE a new `<tr>` element, name it *topRow*
    7. SET *topRow*'s class to "table-warning*
    8. CREATE a new `<th>` element, name it *titleCell*
    9. SET *titleCell*'s scope to "col"
    10. SET *titleCell*'s inner text to *title*
    11. APPEND *titleCell* to *topRow*
    12. APPEND *topRow* to *head*
    13. APPEND *head* to *table*
    14. CREATE a new `<tbody>` element, name it *body*
    15. SET *body*'s class to "table-group-divider"
    16. CREATE a new `<tr>` element, name it *bottomRow*
    17. IF *element* is an object
        - INIT *properties* as an array containing all of the properties of *element*  (In Javascript: `Object.getOwnPropertyNames(element)`)
        - FOR every property of *properties*
          - CREATE a new `<td>` element, name it *elementCell*
          - SET *elementCell*'s inner text to that property of *element*
          - APPEND *elementCell* to *bottomRow*
        - ENDFOR
    18. ELSE (*element* is a single string)
        - CREATE a new `<td>` element, name it *elementCell*
        - SET *elementCell*'s inner text to *element*
        - APPEND *elementCell* to *bottomRow*
    19. ENDIF
    20. APPEND *bottomRow* to *body*
    21. APPEND *body* to *table*
    22. RETURN *table*
    23. END **makeTable**
## Procedure
1. START
2. INIT **Weather-APP**
3. CALL **Weather-APP**.**init**()
4. WAIT for user input
5. CALL **getData** when the 'zip-code-submit' button is clicked