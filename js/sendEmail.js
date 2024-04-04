const form = document.getElementById("contactForm");
const toast = document.getElementById("emailToast");
const emailMessage = document.getElementById("emailMessage");
const time = document.getElementById("timeNow");

async function handleSubmit(event) {
  event.preventDefault();
  let message = "";
  let data = new FormData(event.target);
  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
        'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      message = "Obrigado por enviar a sua mensagem!";
      form.reset()
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          message = data["errors"].map(error => error["message"]).join(", ")
        } else {
          message = "Opa! Houve um problema em enviar a sua mensagem!"
        }
      })
    }
  }).catch(error => {
    message = "Opa! Houve um problema em enviar a sua mensagem! Erro: " + error;
  }).finally(() => {
    const bsToast = new bootstrap.Toast(toast);
    emailMessage.innerHTML = message;
    time.innerHTML = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    bsToast.show();
  });
}
form.addEventListener("submit", handleSubmit);