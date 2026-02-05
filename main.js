document.getElementById('ano').textContent = new Date().getFullYear();

document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(link.getAttribute('href'))
            .scrollIntoView({ behavior: 'smooth' });
    });
});

//estrutura do Bot

/* CONFIGURAÇÕES */
const whatsappNumero = "5521982846871"; // SEU WHATSAPP
const TEMPO_INATIVIDADE = 30000;

let nivel = 1;
let mensagemInicialEnviada = false;
let timerInatividade = null;
let avisoInatividadeEnviado = false;

let lead = {
    servico: "",
    detalhes: "",
    nome: "",
    telefone: ""
};

const messages = document.getElementById("messages");
const input = document.getElementById("input");

/* BOT */
function abrirBot() {
    const bot = document.getElementById("chatbot");
    bot.style.display = "flex";
    bot.classList.remove("minimized");

    if (!mensagemInicialEnviada) {
        messages.innerHTML = "";
        mensagemInicial();
    }

    iniciarTimerInatividade();
}

function minimizarBot() {
    document.getElementById("chatbot").classList.toggle("minimized");
}

function fecharBot() {
    document.getElementById("chatbot").style.display = "none";
}

function mensagemInicial() {
    setTimeout(() => botMsg("👷‍♂️ Olá! Sou o assistente virtual da InfraWork Engenharia."), 500);
    setTimeout(() => botMsg("Selecione o serviço desejado:"), 1200);

    const servicos = {
        "1": "Projetos Estruturais",
        "2": "Drenagem Urbana",
        "3": "Pavimentação",
        "4": "Abastecimento de Água",
        "5": "Rede de Esgoto",
        "6": "Topografia",
        "7": "Laudos e Vistorias",
        "8": "Execução / Gerenciamento",
        "9": "Consultoria Técnica"
    };

    let lista = "";
    for (let key in servicos) {
        lista += `${key}️⃣ ${servicos[key]}<br>`; // <br> adiciona quebra de linha
    }

    setTimeout(() => botMsg("Nossos serviços incluem:<br>" + lista), 2000);

    mensagemInicialEnviada = true;
}


/* ENVIO DE MENSAGENS */
function enviar() {
    const msg = input.value.trim();
    if (!msg) return;

    avisoInatividadeEnviado = false;
    iniciarTimerInatividade();

    messages.innerHTML += `<div class="user">${msg}</div>`;

    const servicos = {
        "1": "Projetos Estruturais",
        "2": "Drenagem Urbana",
        "3": "Pavimentação",
        "4": "Abastecimento de Água",
        "5": "Rede de Esgoto",
        "6": "Topografia",
        "7": "Laudos e Vistorias",
        "8": "Execução / Gerenciamento",
        "9": "Consultoria Técnica"
    };

    if (nivel === 1) {
        if (!servicos[msg]) return botMsg("Escolha de 1 a 9 🙂");
        lead.servico = servicos[msg];
        botMsg("Descreva brevemente o serviço.");
        nivel = 2;
    }
    else if (nivel === 2) {
        lead.detalhes = msg;
        botMsg("Qual é o seu nome?");
        nivel = 3;
    }
    else if (nivel === 3) {
        lead.nome = msg;
        botMsg("Informe seu WhatsApp com DDD 📱");
        nivel = 4;
    }
    else if (nivel === 4) {
        if (!msg.match(/^\d{10,13}$/)) {
            return botMsg("Informe apenas números com DDD 🙂");
        }
        lead.telefone = msg;
        salvarLead(lead);

        botMsg("Encaminhando para um engenheiro 🚀");

        const texto = `Olá! Meu nome é ${lead.nome}.
Serviço: ${lead.servico}
Detalhes: ${lead.detalhes}
Telefone: ${lead.telefone}`;

        window.open(
            `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(texto)}`,
            "_blank"
        );

        // Reinicia o bot após enviar
        setTimeout(() => {
            messages.innerHTML = "";       // limpa a conversa
            nivel = 1;                     // reinicia o fluxo
            mensagemInicialEnviada = false;
            avisoInatividadeEnviado = false;
            mensagemInicial();             // envia a mensagem inicial novamente
        }, 1000);

        nivel = 5;
    }

    input.value = "";
    messages.scrollTop = messages.scrollHeight;
}

/* MENSAGENS DO BOT */
function botMsg(texto) {
    messages.innerHTML += `<div class="bot">${texto}</div>`;
    messages.scrollTop = messages.scrollHeight;
}

/* INATIVIDADE */
function iniciarTimerInatividade() {
    clearTimeout(timerInatividade);
    timerInatividade = setTimeout(() => {
        if (!avisoInatividadeEnviado && nivel < 5) {
            botMsg("👋 Ainda estou por aqui! Posso ajudar?");
            avisoInatividadeEnviado = true;
        }
    }, TEMPO_INATIVIDADE);
}

/* SALVAR LEAD */
function salvarLead(dados) {
    const leads = JSON.parse(localStorage.getItem("leads")) || [];
    leads.push({ ...dados, data: new Date().toLocaleString() });
    localStorage.setItem("leads", JSON.stringify(leads));

    const som = document.getElementById("alertSound");
    if (som) som.play();

    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Novo Lead 🚀", {
            body: `${dados.nome} - ${dados.servico}`
        });
    }
}
