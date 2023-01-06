let follow;
const dataTable = document.createElement('div');
dataTable.className = 'console-table';
function start(password) {
  const sock = chrome.runtime.connect({name: password});

  sock.onMessage.addListener((msg) => {
    if (msg) {
      switch (msg.console) {
      case 'log':
        console.log(...msg.consoleArgs);
        break;
      case 'error':
        console.error(...msg.consoleArgs);
        break;
      case 'debug':
        console.debug(...msg.consoleArgs);
        break;
      default:
      }
      AppendLog(msg);
    }
  });

  function AppendLog(msg) {
    if (msg.console) {
      const div = document.createElement('div');
      div.className = 'console-row';
      const logType = document.createElement('span');
      switch (msg.console) {
      case 'log':
        logType.innerText = '[LOG] ';
        logType.className = 'console-log';
        break;
      case 'error':
        logType.innerText = '[!!!] ';
        logType.className = 'console-error';
        break;
      case 'debug':
        logType.innerText = '[DBG] ';
        logType.className = 'console-debug';
        break;
      default:
      }

      const consoleMsg = document.createElement('span');
      consoleMsg.className = 'console-message';

      consoleMsg.innerText = msg.consoleArgs.map((arg) => {
        return arg.toString();
      }).join(' ');
      div.appendChild(logType);
      div.appendChild(consoleMsg);
      dataTable.appendChild(div);
      if (follow && follow.checked) {
        document.body.scrollTop = document.body.scrollHeight;
      }
    }
  }
}

window.onload = () => {
  document.body.appendChild(dataTable);
  const startButton = document.getElementById('start-button');
  const passwordInput = document.getElementById('code');
  follow = document.getElementById('follow');
  window.follow = follow;
  startButton.onclick = (e) => {
    start(code.value);
    document.getElementById('auth').remove();
  };

};
