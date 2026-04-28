function enviarWhatsApp(event) {
  event.preventDefault();
  const numero = "5543999608255";
  const nome = document.getElementById("nome").value.trim();
  const data = document.getElementById("data").value;
  const pagamento = document.getElementById("pagamento").value;
  const valorPix = document.getElementById("valor-pix")?.value.trim();

  document.getElementById("nome-error").textContent = "";
  document.getElementById("data-error").textContent = "";
  document.getElementById("pagamento-error").textContent = "";

  let valido = true;

  if (!nome) {
    document.getElementById("nome-error").textContent = "Por favor, preencha seu nome.";
    valido = false;
  }

  if (!data) {
    document.getElementById("data-error").textContent = "Por favor, selecione a data da retirada.";
    valido = false;
  }

  if (!pagamento) {
    document.getElementById("pagamento-error").textContent = "Por favor, selecione a forma de pagamento.";
    valido = false;
  }

  let algumSelecionado = false;
  let mensagem = "Olá, gostaria de fazer um pedido:%0A";

  if (!valido) {
    const campos = ["nome", "data", "pagamento"];
    for (const id of campos) {
      const erroEl = document.getElementById(`${id}-error`);
      if (erroEl && erroEl.textContent) {
        const campo = document.getElementById(id);
        if (campo) {
          campo.scrollIntoView({ behavior: "smooth", block: "center" });
          campo.focus();
        }
        break;
      }
    }
    return;
  }

  if (nome) {
    mensagem += `%0A👤 Nome: ${nome}`;
  }

  if (data) {
    mensagem += `%0A📅 Data da retirada: ${data.split("-").reverse().join("/")}`;
  }

  if (pagamento) {
    let forma = "";
    switch (pagamento) {
      case "pix":
        forma = "PIX";
        break;
      case "credito":
        forma = "Cartão de crédito";
        break;
      case "debito":
        forma = "Cartão de débito";
        break;
      case "dinheiro":
        forma = "Dinheiro";
        break;
      default:
        forma = pagamento;
        break;
    }

    mensagem += `%0A💰 Forma de pagamento: ${forma}`;
    if (pagamento === "pix" && valorPix) {
      mensagem += `%0A💵 Valor via PIX: R$ ${valorPix}`;
    }
  }

  mensagem += "%0A%0A🎂 Bolos encomendados:%0A";

  const pesos = document.querySelectorAll('input[name^="peso"]');
  for (const peso of pesos) {
    if (parseFloat(peso.value) > 0) {
      const li = peso.closest("li");
      const nomeBolo = li.querySelector(".flavor-name")?.textContent.trim() || "";

      if (parseFloat(peso.value) < 1.5) {
        alert(`O bolo "${nomeBolo}" precisa ter no mínimo 1,5 kg.`);
        return;
      }

      mensagem += `• ${nomeBolo}: ${peso.value} kg%0A`;
      algumSelecionado = true;
    }
  }

  if (!algumSelecionado) {
    alert("Selecione pelo menos um bolo com o peso mínimo de 1,5 kg.");
    return;
  }

  mensagem += "%0A✅ Aguardo confirmação, obrigado!";
  window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
}

function mostrarPix() {
  const pagamento = document.getElementById("pagamento").value;
  const campoPix = document.getElementById("campo-pix");
  campoPix.style.display = pagamento === "pix" ? "block" : "none";
}

function copiarPix() {
  const input = document.getElementById("chave-pix");
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand("copy");

  const feedback = document.getElementById("pix-feedback");
  feedback.style.display = "inline";
  setTimeout(() => {
    feedback.style.display = "none";
  }, 2000);
}

function increaseWeight(inputName) {
  const input = document.querySelector(`input[name="${inputName}"]`);
  if (input) {
    const currentValue = parseFloat(input.value);
    if (isNaN(currentValue) || currentValue < 1.5) {
      input.value = 1.5;
    } else {
      input.value = (currentValue + 0.5).toFixed(1);
    }
  }
}

function decreaseWeight(inputName) {
  const input = document.querySelector(`input[name="${inputName}"]`);
  if (input) {
    const currentValue = parseFloat(input.value) || 0;
    if (currentValue >= 2.0) {
      input.value = (currentValue - 0.5).toFixed(1);
    } else if (currentValue > 1.5) {
      input.value = 1.5;
    }
  }
}

function mostrarPopup() {
  const popup = document.getElementById("popup-reajuste");
  if (popup) {
    popup.style.display = "flex";
    localStorage.setItem("avisoVisto", "true");
  }
}

function fecharPopup() {
  document.getElementById("popup-reajuste").style.display = "none";
  document.removeEventListener("click", primeiroClique);
  document.removeEventListener("scroll", primeiroClique);
  document.removeEventListener("touchstart", primeiroClique);
}

function primeiroClique() {
  if (localStorage.getItem("avisoVisto") !== "true") {
    mostrarPopup();
  }

  document.removeEventListener("click", primeiroClique);
  document.removeEventListener("scroll", primeiroClique);
  document.removeEventListener("touchstart", primeiroClique);
}

function atualizarPrecoKilo() {
  const dataReajuste = new Date(2026, 5, 1);
  const dataFimDestaque = new Date(2026, 5, 11);
  const dataAtual = new Date();
  const precoElemento = document.getElementById("preco-kilo");

  if (!precoElemento) {
    return;
  }

  if (dataAtual >= dataReajuste) {
    precoElemento.textContent = "R$ 75,00";

    if (dataAtual < dataFimDestaque) {
      precoElemento.style.color = "#ffe0de";
      precoElemento.style.fontWeight = "700";
    } else {
      precoElemento.style.color = "";
      precoElemento.style.fontWeight = "";
    }
  } else {
    precoElemento.textContent = "R$ 70,00";
    precoElemento.style.color = "";
  }
}

window.addEventListener("load", () => {
  document.addEventListener("click", primeiroClique, { once: true });
  document.addEventListener("scroll", primeiroClique, { once: true });
  document.addEventListener("touchstart", primeiroClique, { once: true });
  atualizarPrecoKilo();
});

document.addEventListener("DOMContentLoaded", () => {
  const dataInput = document.getElementById("data");
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  dataInput.value = `${ano}-${mes}-${dia}`;
});
