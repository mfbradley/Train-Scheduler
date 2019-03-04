$(document).ready(function () {
    /* global firebase */
    /* global moment */
    $(".alert").hide();
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDxrI5mWSglqm1P37qlaxr41vmbItKopjE",
        authDomain: "trainschedule-930e4.firebaseapp.com",
        databaseURL: "https://trainschedule-930e4.firebaseio.com",
        projectId: "trainschedule-930e4",
        storageBucket: "trainschedule-930e4.appspot.com",
        messagingSenderId: "211869557537"
    };

    firebase.initializeApp(config);

    var db = firebase.database();

    var nextArrival;
    var minutesAway;



    // on-click event handler for the submit button in the Add Train form
    $("#submitButton").on("click", function (event) {
        event.preventDefault();

        // grab values of the input fields
        var trainName = $("#inputTrainName").val().trim();
        var destination = $("#inputDestination").val().trim();
        var firstTrainTime = $("#inputFirstTrainTime").val().trim();
        var frequency = $("#inputFrequency").val().trim();

        console.log(parseInt(firstTrainTime.substr(0,2)))
        function validateTime() {
            if (firstTrainTime.substr(2, 1) === ":") {
                if (!firstTrainTime.match(/^\d\d:\d\d/)) {
                    return false;
                }

                else if (parseInt(firstTrainTime.substr(0, 2)) >= 24 || parseInt(firstTrainTime.substr(3, 2)) >= 60) {
                    return false;
                }

                else {
                    return true;
                }
            }

            else {
                return false;
            }
        }

        if (!trainName || !destination || !firstTrainTime || !frequency) {
            $(".alert").text("All form fields must be filled out.");
            $(".alert").show();
        }

        else if (!validateTime()) {
            $(".alert").text("Invalid First Train Time format.");
            $(".alert").show();
        }

        else if (isNaN(frequency)) {
            $(".alert").text("Invalid time for Train Frequency.");
            $(".alert").show();

        }

        else if (trainName && destination && validateTime() && frequency) {
            $(".alert").hide();
            console.log("valid time");
            // push values into Firebase
            db.ref().push({
                trainName: trainName,
                destination: destination,
                firstTrainTime: firstTrainTime,
                frequency: frequency,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });

            // clear input fields on the form
            $("#inputTrainName").val("");
            $("#inputDestination").val("");
            $("#inputFirstTrainTime").val("");
            $("#inputFrequency").val("");
        }
        else {
            $(".alert").text("All form fields must be filled out.");
            $(".alert").show();
        }
    });

    // when a new train is added to Firebase...
    db.ref().on("child_added", function (childSnapshot, prevChildKey) {

        // Grab values from Add Train input fields
        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var firstTrainTime = childSnapshot.val().firstTrainTime;
        var frequency = childSnapshot.val().frequency;

        // using Moment.js calculate ...
        // convert first train time so it is scheduled in the present
        var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");

        // calculate difference in time between the first train time and the current time (this will be used to determine minutes away)
        var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");

        // calculate the time remainder 
        var timeRemainder = diffTime % frequency;

        // subtract time remainder from frequency to calculate how many minutes remain until the next train
        var minutesTilTrain = frequency - timeRemainder;

        // display next train arrival in HH:mm format
        var nextArrival = moment().add(minutesTilTrain, "minutes");

        // create a new row and append new train (from Add Train form) to Current Train Schedule
        var newRow = $('<tr>');
        newRow.append($('<td>').text(trainName));
        newRow.append($('<td>').text(destination));
        newRow.append($('<td>').text(frequency));
        newRow.append($('<td>').text(nextArrival.format("HH:mm")));
        newRow.append($('<td>').text(minutesTilTrain));

        $(".table").append(newRow);


    });

});
