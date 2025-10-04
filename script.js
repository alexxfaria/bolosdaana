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

// Funções para a Pop-up de Reajuste
function mostrarPopup() {
    document.getElementById('popup-reajuste').style.display = 'flex';
}

function fecharPopup() {
    document.getElementById('popup-reajuste').style.display = 'none';
    // Opcional: Salvar no localStorage para não mostrar de novo
    // localStorage.setItem('avisoVisto', 'true');
}

// Mostra a pop-up quando a página carregar
window.onload = function() {
    // Verifica se o usuário já viu o aviso (se a linha do localStorage estiver descomentada)
    // if (localStorage.getItem('avisoVisto') !== 'true') {
        mostrarPopup();
    // }
};

/**
 * Função para atualizar o preço do quilo do bolo e aplicar
 * destaque em vermelho por 10 dias após o reajuste.
 */
function atualizarPrecoKilo() {
    // 1. Definições de Datas
    // Data de Início do Reajuste: 01/11/2025 (Mês 10, pois JS conta de 0 a 11)
    const dataReajuste = new Date(2025, 10, 1); 
    
    // Data de Fim do Destaque (10 dias após o reajuste): 11/11/2025
    // Usamos o dia 11 para que o destaque dure até o final do dia 10.
    const dataFimDestaque = new Date(2025, 10, 11);
    
    // Data e hora atuais
    const dataAtual = new Date();
    
    // 2. Pegue o elemento HTML
    const precoElemento = document.getElementById('preco-kilo');
    
    if (!precoElemento) return; // Garante que o elemento existe antes de prosseguir

    // 3. Lógica do Reajuste
    if (dataAtual >= dataReajuste) {
        // Se a data do reajuste já chegou (ou passou)
        precoElemento.textContent = 'R$ 70,00';
        
        // 4. Lógica do Destaque Vermelho
        // Verifica se a data atual está entre 01/11 e 10/11
        if (dataAtual < dataFimDestaque) {
            // Aplica a cor de destaque (vermelho para aviso)
            precoElemento.style.color = 'crimson'; 
            precoElemento.style.fontWeight = 'bold'; // Reforça o destaque
            
        } else {
            // Se já passou o período de 10 dias, remove o destaque
            // (Você pode definir a cor normal do seu site aqui, se precisar)
            precoElemento.style.color = ''; // Volta à cor padrão do seu CSS (ou defina uma cor)
            precoElemento.style.fontWeight = ''; 
        }

    } else {
        // Antes do reajuste: mantém o preço antigo e cor normal
        precoElemento.textContent = 'R$ 65,00';
        precoElemento.style.color = ''; 
    }
}

// Certifique-se de que a função é chamada no carregamento da página
window.onload = function() {
    // ... outras funções (como mostrarPopup) ...
    
    // CHAMA A FUNÇÃO DE REAJUSTE
    atualizarPrecoKilo(); 
};

document.addEventListener('DOMContentLoaded', () => {
  const dataInput = document.getElementById('data');
  const hojeMaisDois = new Date();
  hojeMaisDois.setDate(hojeMaisDois.getDate() + 2);

  const ano = hojeMaisDois.getFullYear();
  const mes = String(hojeMaisDois.getMonth() + 1).padStart(2, '0');
  const dia = String(hojeMaisDois.getDate()).padStart(2, '0');

  dataInput.value = `${ano}-${mes}-${dia}`;
});
