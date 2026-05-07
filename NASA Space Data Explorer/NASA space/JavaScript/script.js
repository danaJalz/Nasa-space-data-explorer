// Dana Alzahrani 2310370
// NASA Space Data Explorer (APOD + Random APOD)

// Select main DOM elements
const dataTypeSelect = document.getElementById("dataType");
const dateInput      = document.getElementById("dateInput");
const getDataBtn     = document.getElementById("getDataBtn");
const clearBtn       = document.getElementById("clearBtn");
const userNote       = document.getElementById("userNote");
const liveNote       = document.getElementById("liveNote");
const resultsSection = document.getElementById("results");

// NASA API Key
const NASA_API_KEY = "t7Twz28Z2gfKEaM3ZgbxRASx7OePSaMdOVdjRQPB";

// EVENTS
getDataBtn.addEventListener("click", handleGetData);
clearBtn.addEventListener("click", clearResults);

// Live note preview
userNote.addEventListener("keyup", function () {
  liveNote.textContent = userNote.value ? `Your note: ${userNote.value}` : "";
});

// MAIN HANDLER
function handleGetData() {
  const selectedType = dataTypeSelect.value;
  const selectedDate = dateInput.value;

  clearResults(false); // remove old cards but keep the note

  // "APOD by date" option
  if (selectedType === "apod") {
    if (!selectedDate) {
      showError("Please select a date before getting data.");
      return;
    }
    fetchApodData(selectedDate);
  }

  // "Random APOD" option
  if (selectedType === "random") {
    fetchRandomApod();
  }
}

/*  FETCH APOD DATA (BY DATE)*/
function fetchApodData(date) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`;

  fetch(url)
    .then(res => {
      // Handle invalid responses (404, 400, etc.)
      if (!res.ok) throw new Error("APOD fetch failed");
      return res.json();  // Convert JSON text → JS Object
    })
    .then(data => renderApodCard(data)) // Pass API data to card renderer
    .catch(() => showError("Could not load APOD data. Try another date."));
}

/* FETCH RANDOM APOD (COUNT=1)*/
function fetchRandomApod() {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&count=1`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Random APOD fetch failed");
      return res.json(); // API returns an ARRAY
    })
    .then(dataList => {
      const data = dataList[0]; // extract the first (and only) item
      renderApodCard(data);
    })
    .catch(() => showError("Could not load a random picture. Try again."));
}

/*  DISPLAY APOD DATA AS CARD */
function renderApodCard(data) {
  const card = document.createElement("div");
  card.className = "card";

  const title = document.createElement("h2");
  title.textContent = data.title || "Astronomy Picture";
  card.appendChild(title);

  const datePara = document.createElement("p");
  datePara.textContent = `Date: ${data.date}`;
  card.appendChild(datePara);

  const mediaType = document.createElement("p");
  mediaType.textContent = `Media Type: ${data.media_type}`;
  card.appendChild(mediaType);

  // Media element (IMAGE)
  let mediaElement;

  if (data.media_type === "image") {
    mediaElement = document.createElement("img");
    mediaElement.src = data.url;
  }

  if (mediaElement) {
    mediaElement.className = "media";

    // Zoom on double-click (Event type #2)
    mediaElement.addEventListener("dblclick", function () {
      mediaElement.classList.toggle("zoomed");
    });

    card.appendChild(mediaElement);
  }

  const explanation = document.createElement("p");
  explanation.className = "explanation";
  explanation.textContent = data.explanation || "No explanation available.";
  card.appendChild(explanation);

  // HD link (only if provided by API)
  if (data.hdurl) {
    const hdLink = document.createElement("a");
    hdLink.href = data.hdurl;
    hdLink.target = "_blank"; // open in new tab
    hdLink.textContent = "View HD Version";
    card.appendChild(hdLink);
  }

  resultsSection.appendChild(card);
}

/*  CLEAR RESULTS SECTION*/
function clearResults(clearNote = true) {
  resultsSection.innerHTML = "";

  if (clearNote) {
    userNote.value = "";
    liveNote.textContent = "";
  }
}

/*  DISPLAY ERROR MESSAGE*/
function showError(message) {
  clearResults(false);

  const p = document.createElement("p");
  p.className = "error";
  p.textContent = message;

  resultsSection.appendChild(p);
}
