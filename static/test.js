var queryHistory = [];
    document.addEventListener("DOMContentLoaded", function() {
      getQueryHistory();
      populateHistory();
    })
    function sendQuery(e) {
      e.preventDefault();
      var form = e.target;
      console.log(form);
      var query = form.sql.value;
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/sql", true);
      xhr.onload = function() {
        document.getElementById("response").innerText = this.responseText;
        updateHistory({sql: query, success: this.status == 200});
      }
      xhr.onerror = function() {
        updateHistory({sql: sql, success: false});
      }
      xhr.send(new FormData(form));
    }

    function rerun(e) {
      var form = document.getElementById("queryForm");
      form.sql.value = e.target.innerText;
      sendQuery({target: form, preventDefault: function() {}});
    }

    function getQueryHistory() {
      queryHistory = JSON.parse(localStorage.getItem("queryHistory") || "[]");
      console.log(queryHistory);
    }

    function populateHistory() {
      var el = document.getElementById("history");
      queryHistory.forEach(function(q) {
        appendHistory(el, q);
      });
    }

    function clearHistory() {
      localStorage.setItem("queryHistory", []);
      queryHistory = [];
      document.getElementById("history").innerHTML = "";
    }

    function appendHistory(historyEl, query) {
      var qEl = document.createElement("li");
      qEl.innerText = query.sql;
      if(query.success)
        qEl.classList.add("success");
      else
        qEl.classList.add("fail");
      qEl.onclick = rerun;
      historyEl.appendChild(qEl);
    }

    function updateHistory(query) {
      queryHistory.push(query);
      var el = document.getElementById("history");
      appendHistory(el, query);
      localStorage.setItem("queryHistory", JSON.stringify(queryHistory));
    }
