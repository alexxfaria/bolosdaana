function enviarWhatsApp() {
  const numero = "5543999608255"; // número da Ana com DDI e DDD
  const nome = document.getElementById("nome").value.trim();
  const data = document.getElementById("data").value;
  const pagamento = document.getElementById("pagamento").value;
  const valorPix = document.getElementById("valor-pix")?.value.trim();

  if (!nome) {
    alert("Por favor, preencha seu nome.");
    return;
  }

  if (!data) {
    alert("Por favor, selecione a data da retirada.");
    return;
  }

  if (!pagamento) {
    alert("Por favor, selecione a forma de pagamento.");
    return;
  }

  let mensagem = `Olá, quero encomendar bolos com as seguintes informações:%0A`;

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
    const checkbox = document.querySelector(`input[name="bolo${i}"]`);
    const peso = document.querySelector(`input[name="peso${i}"]`);
    
    if (checkbox && checkbox.checked && peso && peso.value > 0) {
      const nomeBolo = checkbox.parentElement.textContent.replace(/[\n\r]/g, "").trim();
      mensagem += `• ${nomeBolo}: ${peso.value} kg%0A`;
    }
  }

  let algumSelecionado = false;

  for (let i = 1; i <= 21; i++) {
    const checkbox = document.querySelector(`input[name="bolo${i}"]`);
    const peso = document.querySelector(`input[name="peso${i}"]`);

    if (checkbox && checkbox.checked && peso && parseFloat(peso.value) > 0) {
      algumSelecionado = true;

      if (parseFloat(peso.value) < 1.5) {
        const nomeBolo = checkbox.parentElement.textContent.replace(/[\n\r]/g, "").trim();
        alert(`O bolo "${nomeBolo}" precisa ter no mínimo 1,5 kg.`);
        return;
      }

      const nomeBolo = checkbox.parentElement.textContent.replace(/[\n\r]/g, "").trim();
      mensagem += `• ${nomeBolo}: ${peso.value}kg%0A`;
    }
  }

  if (!algumSelecionado) {
    alert("Selecione pelo menos um bolo com o peso mínimo de 1,5 kg.");
    return;
  }

  mensagem += `%0A✅ Conforme indicado no cardápio. Obrigado!`;

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