(function() {
  let addStreaks = function() {
    // Streaks view already rendered
    if (document.getElementById('streak-container') !== null) {
      return;
    }

    let days = document.querySelectorAll('rect.day');

    // Not on a page with contribution history
    if (days.length == 0) {
      return;
    }

    let getDate = function(day) {
      let raw = day.getAttribute('data-date');
      let parts = raw.split('-');

      return {
        year: parseInt(parts[0]),
        month: parseInt(parts[1]),
        day: parseInt(parts[2]),
        timestamp: Date.parse(raw),
      };
    }

    // Get the full list of streaks
    let streaks = [];
    let streak = null;
    let totalContributions = 0;

    for (let i = 0; i < days.length; i++) {
      let count = parseInt(days[i].getAttribute('data-count'));
      let date = getDate(days[i]);

      totalContributions += count;

      // End streak
      if (count == 0) {
        if (streak !== null) {
          streak = null;
        }

        continue;
      }

      // Start streak
      if (streak === null) {
        streak = {
          start: date,
          days: 0,
          end: date,
        };

        streaks.push(streak);
      }

      // Continue streak
      streak.end = date;
      streak.days++;
    }

    // Contribution span
    let firstDay = getDate(days[0]);
    let lastDay = getDate(days[days.length - 1]);

    // Find the longest streak
    let longestStreak = null;
    for (let i = 0; i < streaks.length; i++) {
      if (longestStreak === null || streaks[i].days > longestStreak.days) {
        longestStreak = streaks[i];
      }
    }

    // Find the current streak
    let currentStreak = null;

    if (streaks.length > 0) {
      let today = getDate(days[days.length - 1]);
      let yesterday = getDate(days[days.length - 2]);
      let lastStreak = streaks[streaks.length - 1];

      if (lastStreak.end.timestamp === today.timestamp ||
          lastStreak.end.timestamp === yesterday.timestamp) {
        currentStreak = lastStreak;
      }
    }

    // Render output
    let into = document.querySelector('#contributions-calendar');

    let container = document.createElement('div');
    container.id = 'streak-container';
    container.style.display = 'flex';

    let applyPaneStyle = function(ele, borderRight) {
      ele.style.flex = '1 1 auto';
      ele.style.textAlign = 'center';
      ele.style.borderTop = 'solid 1px #d8d8d8';
      ele.style.padding = '13px 0px';
      if (borderRight) {
        ele.style.borderRight = 'solid 1px #d8d8d8';
      }
    }

    let appendText = function(parentEle, className, text) {
      let ele = document.createElement('div');
      ele.className = className;

      let textNode = document.createTextNode(text);
      ele.appendChild(textNode);

      parentEle.appendChild(ele);
    }

    let appendSmallText = function(parentEle, text) {
      appendText(parentEle, 'text-muted', text);
    }

    let appendLargeText = function(parentEle, text) {
      appendText(parentEle, 'vcard-fullname', text);
    }

    let monthToName = function(index) {
      switch (index) {
        case 1: return 'January';
        case 2: return 'February';
        case 3: return 'March';
        case 4: return 'April';
        case 5: return 'May';
        case 6: return 'June';
        case 7: return 'July';
        case 8: return 'August';
        case 9: return 'September';
        case 10: return 'October';
        case 11: return 'November';
        case 12: return 'December';
      }
    }

    let monthToAbbv = function(index) {
      switch (index) {
        case 1: return 'Jan';
        case 2: return 'Feb';
        case 3: return 'Mar';
        case 4: return 'Apr';
        case 5: return 'May';
        case 6: return 'Jun';
        case 7: return 'Jul';
        case 8: return 'Aug';
        case 9: return 'Sep';
        case 10: return 'Oct';
        case 11: return 'Nov';
        case 12: return 'Dec';
      }
    }

    let monthDate = function(obj) {
      return monthToName(obj.month) + ' ' + obj.day;
    }

    let fullDate = function(obj) {
      return monthToAbbv(obj.month) + ' ' + obj.day + ', ' + obj.year;
    }

    let appendStreakSpan = function(parentEle, streak) {
      let text = monthDate(streak.start) + ' - ' + monthDate(streak.end);

      appendSmallText(parentEle, text);
    }

    let renderStreak = function(parentEle, streak) {
      if (streak !== null) {
        appendLargeText(parentEle, streak.days + ' days');
        appendStreakSpan(parentEle, streak);
      } else {
        appendLargeText(parentEle, '0 days');
        appendSmallText(parentEle, 'Rock - Hard Place');
      }
    }

    // Render year of contributions
    let year = document.createElement('div');
    applyPaneStyle(year, true);
    appendSmallText(year, 'Year of contributions');
    appendLargeText(year, totalContributions.toLocaleString()  + ' total');
    appendSmallText(year, fullDate(firstDay) + ' - ' + fullDate(lastDay));
    container.appendChild(year);

    // Render longest streak
    let longest = document.createElement('div');
    applyPaneStyle(longest, true);
    appendSmallText(longest, 'Longest streak');
    renderStreak(longest, longestStreak);
    container.appendChild(longest);

    // Render current streak
    let current = document.createElement('div');
    applyPaneStyle(current, false);
    appendSmallText(current, 'Current streak');
    renderStreak(current, currentStreak);
    container.appendChild(current);

    into.appendChild(container);
  };

  setInterval(addStreaks, 250);

  addStreaks();
})();
