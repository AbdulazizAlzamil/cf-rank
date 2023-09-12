const input_username = document.getElementById("input-username");
const users = document.getElementById("users");
const form = document.getElementsByTagName("form")[0];
const contestElements = document.getElementById("upcoming-contests");
const toggleAsideButton = document.getElementById("toggle-aside-button");
const aside = document.querySelector("aside");

async function CreateUserSlot(username) {
  const res = await fetch(
    `https://codeforces.com/api/user.rating?handle=${username}`
  );
  const data = await res.json();
  const res2 = await fetch(
    `https://codeforces.com/api/user.info?handles=${username}`
  );
  const data2 = await res2.json();

  const currentRating = data.result[data.result.length - 1].newRating;
  const maxRating = data2.result[0].maxRating;
  const handle = data2.result[0].handle;
  const rank = Capitalzie(data2.result[0].rank);

  const newUser = `<div class="${GetRankColor(currentRating)} slot">
      <div class="bg"></div>
      <div class="slot__normal-info">
        <a class="slot__username" href="https://codeforces.com/profile/${handle}" target="_blank">${handle}</a>
        <div class="slot__current-rating">Current rating: ${currentRating}</div>
        <div class="ruler--small"></div>
        <div class="slot__max-rating">Max rating: ${maxRating}</div>
      </div>
      <div class="slot__rank-name">${rank}</div>
    </div>`;

  users.innerHTML += newUser;
}

function GetRankColor(currentRank) {
  let color;
  if (currentRank <= 1199) {
    color = "newbie";
  } else if (currentRank >= 1200 && currentRank <= 1399) {
    color = "pupil";
  } else if (currentRank >= 1400 && currentRank <= 1599) {
    color = "specialist";
  } else if (currentRank >= 1600 && currentRank <= 1899) {
    color = "expert";
  } else if (currentRank >= 1900 && currentRank <= 2099) {
    color = "candidate-master";
  } else if (currentRank >= 2100 && currentRank <= 2299) {
    color = "master";
  } else if (currentRank >= 2300 && currentRank <= 2399) {
    color = "international-master";
  } else if (currentRank >= 2400 && currentRank <= 2599) {
    color = "grandmaster";
  } else if (currentRank >= 2600 && currentRank <= 2999) {
    color = "international-grandmaster";
  } else if (currentRank >= 3000) {
    color = "legendary-grandmaster";
  }

  return color;
}

function Capitalzie(str) {
  const parts = str.split(" ");
  for (let i = 0; i < parts.length; i++) {
    parts[i] =
      parts[i][0].toUpperCase() + parts[i].substring(1, parts[i].length);
  }

  return parts.join(" ");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = input_username.value.trim();
  if (username) {
    CreateUserSlot(username);
  }
  input_username.value = "";
});

async function GetUpcomingContests() {
  const res = await fetch("https://codeforces.com/api/contest.list?gym=false");
  const data = await res.json();
  const contests = data.result.filter((contest) => contest.phase === "BEFORE");

  const contestSlotData = contests.map((contest) => {
    const startTime = new Date(contest.startTimeSeconds * 1000);
    const day = startTime.getDate();
    const month = startTime.getMonth() + 1;
    const year = startTime.getFullYear();
    const formattedStartDate = `${day}/${month}/${year}`;
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();

    return {
      id: contest.id,
      name: contest.name,
      start_date: formattedStartDate,
      start_hour: startHour,
      start_minute: startMinute,
      start_time: startTime,
      duration: contest.durationSeconds,
    };
  });

  contestSlotData.sort((a, b) => a.start_time - b.start_time);

  let contestSlots = "";
  contestSlotData.forEach((contest) => {
    contestSlots += `
        <div class="ruler"></div>
        <div class="contest">
          <div class="contest__name">
            <a href="https://codeforces.com/contests" target="_blank">${
              contest.name
            }</a>
          </div>
          <div class="contest__start-date">Start date: ${
            contest.start_date
          }</div>
          <div class="contest__start-time">Start time: ${contest.start_hour}:${
      contest.start_minute
    }</div>
          <div class="contest__duration">Duration: ${FormatDuration(
            contest.duration
          )}</div>
        </div>
      `;
  });

  contestElements.innerHTML = contestSlots;
}

toggleAsideButton.addEventListener("click", () => {
  aside.classList.toggle("active");
});

function FormatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h${minutes !== 0 ? ` ${minutes}m` : ""}`;
}

GetUpcomingContests();
