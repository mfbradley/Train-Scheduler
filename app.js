$(document).ready(function() {
    /* global firebase */
    /* global moment */

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



    $("#submitButton").on("click", function(event) {
        event.preventDefault();

        var trainName = $("#inputTrainName").val().trim();
        var destination = $("#inputDestination").val().trim();
        var firstTrainTime = $("#inputFirstTrainTime").val().trim();
        var frequency = $("#inputFrequency").val().trim();



        db.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        console.log(trainName);
        console.log(destination);
        console.log(firstTrainTime);
        console.log(frequency);

        $("#inputTrainName").val("");
        $("#inputDestination").val("");
        $("#inputFirstTrainTime").val("");
        $("#inputFrequency").val("");

    });

    db.ref().on("child_added", function(childSnapshot, prevChildKey) {
        console.log(childSnapshot.val());

        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var firstTrainTime = childSnapshot.val().firstTrainTime;
        var frequency = childSnapshot.val().frequency;

        console.log(trainName);
        console.log(destination);
        console.log(firstTrainTime);
        console.log(frequency);

        var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
        console.log(firstTrainTimeConverted);

        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

        var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        var timeRemainder = diffTime % frequency;
        console.log(timeRemainder);

        var minutesTilTrain = frequency - timeRemainder;
        console.log("MINUTES TIL TRAIN: " + minutesTilTrain);

        var nextArrival = moment().add(minutesTilTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));

        var newRow = $('<tr>');
        newRow.append($('<td>').text(trainName));
        newRow.append($('<td>').text(destination));
        newRow.append($('<td>').text(frequency));
        newRow.append($('<td>').text(nextArrival.format("HH:mm")));
        newRow.append($('<td>').text(minutesTilTrain));

        $(".table").append(newRow);
    });

});
