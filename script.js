function enviarWhatsApp(event) {
  event.preventDefault();
  const numero = "5543999608255";
  const nome = document.getElementById("nome").value.trim();
  const data = document.getElementById("data").value;
  const pagamento = document.getElementById("pagamento").value;
  const valorPix = document.getElementById("valor-pix")?.value.trim();

  // Limpa mensagens de erro antes da validação
  document.getElementById('nome-error').textContent = "";
  document.getElementById('data-error').textContent = "";
  document.getElementById('pagamento-error').textContent = "";

  let valido = true;

  if (!nome) {
    document.getElementById('nome-error').textContent = "Por favor, preencha seu nome.";
    valido = false;
  }

  if (!data) {
    document.getElementById('data-error').textContent = "Por favor, selecione a data da retirada.";
    valido = false;
  }

  if (!pagamento) {
    document.getElementById('pagamento-error').textContent = "Por favor, selecione a forma de pagamento.";
    valido = false;
  }

  // Validação dos bolos selecionados e pesos mínimos
  let algumSelecionado = false;
  let mensagem = `Olá, gostaria de fazer um pedido:%0A`;

  if (!valido) {
    // Rolar até o primeiro erro e focar no campo correspondente
    const campos = ['nome', 'data', 'pagamento'];
    for (const id of campos) {
      const erroEl = document.getElementById(id + '-error');
      if (erroEl && erroEl.textContent) {
        const campo = document.getElementById(id);
        if (campo) {
          campo.scrollIntoView({ behavior: 'smooth', block: 'center' });
          campo.focus();
        }
        break; // só rola para o primeiro erro
      }
    }
    return; // para envio
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
      case "pix": forma = "PIX"; break;
      case "credito": forma = "Cartão de crédito"; break;
      case "debito": forma = "Cartão de débito"; break;
      case "dinheiro": forma = "Dinheiro"; break;
    }
    mensagem += `%0A💰 Forma de pagamento: ${forma}`;
    if (pagamento === "pix" && valorPix) {
      mensagem += `%0A💵 Valor via PIX: R$ ${valorPix}`;
    }
  }

  mensagem += `%0A%0A🍰 Bolos encomendados:%0A`;

  for (let i = 1; i <= 21; i++) {
    const peso = document.querySelector(`input[name="peso${i}"]`);

    if (peso && parseFloat(peso.value) > 0) {
      const li = peso.closest("li");
      const nomeBolo = [...li.childNodes]
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .join(" ")
        .trim();

      if (parseFloat(peso.value) < 1.5) {
        alert(`O bolo "${nomeBolo}" precisa ter no mínimo 1,5 kg.`); // Esse alerta você pode adaptar depois para uma mensagem inline
        return;
      }

      mensagem += `• ${nomeBolo}: ${peso.value} kg%0A`;
      algumSelecionado = true;
    }
  }

  if (!algumSelecionado) {
    alert("Selecione pelo menos um bolo com o peso mínimo de 1,5 kg."); // Também pode adaptar para mensagem inline
    return;
  }

  mensagem += `%0A✅ Aguardo confirmação, obrigado!`;

  // Enviar para o WhatsApp
  window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
}

function mostrarPix() {
  const pagamento = document.getElementById("pagamento").value;
  const campoPix = document.getElementById("campo-pix");
  campoPix.style.display = (pagamento === "pix") ? "block" : "none";
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
    let currentValue = parseFloat(input.value);
    if (isNaN(currentValue) || currentValue < 1.5) {
      input.value = 1.5; // valor inicial
    } else {
      input.value = (currentValue + 0.5).toFixed(1);
    }
  }
}

function decreaseWeight(inputName) {
  const input = document.querySelector(`input[name="${inputName}"]`);
  if (input) {
    let currentValue = parseFloat(input.value) || 0;
    if (currentValue >= 2.0) {
      input.value = (currentValue - 0.5).toFixed(1);
    } else if (currentValue > 1.5) {
      input.value = 1.5; // Enforce minimum of 1.5 kg
    }
  }
}  

document.addEventListener('DOMContentLoaded', () => {
  const dataInput = document.getElementById('data');
  const hojeMaisDois = new Date();
  hojeMaisDois.setDate(hojeMaisDois.getDate() + 2);

  const ano = hojeMaisDois.getFullYear();
  const mes = String(hojeMaisDois.getMonth() + 1).padStart(2, '0');
  const dia = String(hojeMaisDois.getDate()).padStart(2, '0');

  dataInput.value = `${ano}-${mes}-${dia}`;
});
