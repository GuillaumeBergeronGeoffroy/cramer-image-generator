const getTweet = () => {
  const tweet = document.getElementById("tweet").value;
  buildTweet(tweet);
};

const buildTweet = (tweetText) => {
  var header = new Image();
  header.crossOrigin = "Anonymous";
  header.src = "./img/top.png";

  var footer = new Image();
  footer.crossOrigin = "Anonymous";
  footer.src = "./img/bottom.png";

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  var canvasWidth = 500;
  var paddingLeftRight = 18;
  var fontSize = 25;

  context.font = fontSize + "px Arial";

  canvas.width = canvasWidth;

  Promise.all([
    new Promise((resolve, reject) => {
      header.onload = resolve;
      header.onerror = reject;
    }),
    new Promise((resolve, reject) => {
      footer.onload = resolve;
      footer.onerror = reject;
    }),
  ]).then(() => {
    var canvasWidth = header.width;
    var textAreaWidth = canvasWidth - 2 * paddingLeftRight - 20;

    context.font = fontSize + "px Arial";

    var lines = Math.ceil(context.measureText(tweetText).width / textAreaWidth);
    var textAreaHeight = lines * fontSize + 30;

    canvas.width = canvasWidth;
    canvas.height = header.height + textAreaHeight + footer.height;

    context.fillStyle = "rgb(21, 32, 43)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(header, 0, 0);
    context.drawImage(footer, 0, canvas.height - footer.height);

    context.font = "24px Arial";
    context.fillStyle = "rgb(139, 152, 165)";

    var textXPos = 0 + 18;
    var textYPos = canvas.height - footer.height + 34;
    context.fillText(
      getTimeline() + " • Twitter for iPhone",
      textXPos,
      textYPos
    );

    context.fillStyle = "#000";
    context.textBaseline = "middle";

    var words = tweetText.split(" ");
    var line = [];
    context.textBaseline = "middle";
    var halfFontSize = fontSize / 2;

    var textAreaMiddle = header.height + textAreaHeight / 2 - 15 * lines;
    var y = textAreaMiddle;

    context.font = fontSize + "px Arial";
    var colors = words.map((word) => {
      if (
        word.startsWith("@") ||
        word.startsWith("#") ||
        word.startsWith("$")
      ) {
        return "rgb(29, 155, 240)";
      } else {
        return "#FFFFFF";
      }
    });

    var currentLine = [words[0]];
    var currentColor = [colors[0]];
    for (var n = 1; n < words.length; n++) {
      var word = words[n];
      var nextLine = currentLine.concat(word);
      var nextLineWidth = context.measureText(nextLine.join(" ")).width;
      if (nextLineWidth > textAreaWidth) {
        for (var i = 0; i < currentLine.length; i++) {
          context.fillStyle = currentColor[i];
          context.fillText(currentLine[i], paddingLeftRight, y + halfFontSize);
          paddingLeftRight += context.measureText(currentLine[i] + " ").width;
        }
        paddingLeftRight = 18;
        y += fontSize;
        currentLine = [word];
        currentColor = [colors[n]];
      } else {
        currentLine.push(word);
        currentColor.push(colors[n]);
      }
    }
    for (var i = 0; i < currentLine.length; i++) {
      context.fillStyle = currentColor[i];
      context.fillText(currentLine[i], paddingLeftRight, y + halfFontSize);
      paddingLeftRight += context.measureText(currentLine[i] + " ").width;
    }

    var link = document.createElement("a");
    link.download = "tweet.png";
    link.href = canvas.toDataURL();
    link.click();
  });
};

const getTimeline = () => {
  // Generate the current timestamp
  var now = new Date();

  // Get hours, minutes, day, month, and year
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var day = now.getDate();
  var month = now.toLocaleString("default", { month: "long" }); // get month name
  var year = now.getFullYear();

  // Convert hours from 24-hour to 12-hour format and set AM/PM
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Format the timestamp
  var timestamp =
    hours +
    ":" +
    minutes +
    " " +
    ampm +
    " • " +
    month +
    " " +
    day +
    ", " +
    year;

  // Then use the timestamp as your text
  return timestamp;
};
