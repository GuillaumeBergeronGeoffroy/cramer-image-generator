const getTweet = (download = false) => {
  const tweet = document.getElementById("tweet").value;
  const repostCount = document.getElementById("repostCount").value;
  const quoteCount = document.getElementById("quoteCount").value;
  const likeCount = document.getElementById("likeCount").value;
  buildTweet(
    tweet,
    repostCount != 0 ? repostCount : 0,
    quoteCount != 0 ? quoteCount : 0,
    likeCount != 0 ? likeCount : 0,
    download
  );
};

const buildTweet = (
  tweetText,
  repostCount,
  quoteCount,
  likeCount,
  download
) => {
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

    var repostXPos = textXPos; // Position at the start of the line
    var repostYPos = textYPos + 92; // Move 30px down from previous line

    statFontSize = 26;
    context.fillStyle = "#FFFFFF";
    context.font = "bold " + statFontSize + "px Arial";
    context.fillText(repostCount, repostXPos, repostYPos);

    context.fillStyle = "rgb(139, 152, 165)";
    context.font = statFontSize + "px Arial";
    context.fillText(
      " Retweets",
      repostXPos + context.measureText(repostCount).width,
      repostYPos
    );

    var quotesXPos =
      repostXPos + context.measureText(repostCount + " Retweets").width + 35; // Move right by the width of previous label + 10px
    var quotesYPos = repostYPos; // Keep the same vertical position

    context.fillStyle = "#FFFFFF";
    context.font = "bold " + statFontSize + "px Arial";
    context.fillText(quoteCount, quotesXPos, quotesYPos);

    context.fillStyle = "rgb(139, 152, 165)";
    context.font = statFontSize + "px Arial";
    context.fillText(
      " Quote Tweets",
      quotesXPos + context.measureText(quoteCount).width,
      quotesYPos
    );

    var likesXPos =
      quotesXPos + context.measureText(quoteCount + " Quote Tweets").width + 35; // Move right by the width of previous label + 10px
    var likesYPos = quotesYPos; // Keep the same vertical position

    context.fillStyle = "#FFFFFF";
    context.font = "bold " + fontSize + "px Arial";
    context.fillText(likeCount, likesXPos, likesYPos);

    context.fillStyle = "rgb(139, 152, 165)";
    context.font = fontSize + "px Arial";
    context.fillText(
      " Likes",
      likesXPos + context.measureText(likeCount).width,
      likesYPos
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
    var lineSpacing = 8; // Padding between lines (in pixels)
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
        y += fontSize + lineSpacing; // Add line spacing to the vertical position
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

    if (download) {
      var link = document.createElement("a");
      link.download = "tweet.png";
      link.href = canvas.toDataURL();
      link.click();
    } else {
      document.getElementById("tweetOutput").innerHTML = "";
      // add to page
      var img = document.createElement("img");
      img.src = canvas.toDataURL();
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.objectPosition = "center";
      img.style.borderRadius = "15px";
      img.style.boxShadow = "0px 0px 10px 0px rgba(0,0,0,0.75)";
      img.style.marginTop = "10px";
      img.style.marginBottom = "20px";
      img.style.marginLeft = "auto";
      img.style.marginRight = "auto";
      img.style.display = "block";
      document.getElementById("tweetOutput").appendChild(img);
    }
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
