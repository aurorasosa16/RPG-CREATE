const btnCriar = document.getElementById("btn-criar");
const btnEntrar = document.getElementById("btn-entrar");

const popupCriar = document.getElementById("popup-criar");
const popupEntrar = document.getElementById("popup-entrar");

btnCriar.addEventListener("click", function() {
    popupCriar.classList.add("ativo");
});

btnEntrar.addEventListener("click", function() {
    popupEntrar.classList.add("ativo");
});

const botoesFechar = document.querySelectorAll(".fechar");

botoesFechar.forEach(function(botao) {
    botao.addEventListener("click", function() {
        popupCriar.classList.remove("ativo");
        popupEntrar.classList.remove("ativo");
    });
});

window.addEventListener("click", function(evento) {
    if (evento.target === popupCriar) {
        popupCriar.classList.remove("ativo");
    }

    if (evento.target === popupEntrar) {
        popupEntrar.classList.remove("ativo");
    }
});

const painelMestre = document.getElementById("painel-mestre");
const painelJogador = document.getElementById("painel-jogador");

const confirmarCriar = document.getElementById("confirmar-criar");
const confirmarEntrar = document.getElementById("confirmar-entrar");

confirmarCriar.addEventListener("click", function () {
    const nome = document.getElementById("nome-rpg").value.trim();
    const descricao = document.getElementById("descricao-rpg").value.trim();

    if (!nome) {
        alert("Digite o nome do RPG.");
        return;
    }

    const codigo = "RPG" + Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase();

    const sala = { nome, descricao, codigo };

    localStorage.setItem("sala-" + codigo, JSON.stringify(sala));

    document.getElementById("titulo-sala").textContent = nome;
    document.getElementById("descricao-sala").textContent = descricao;
    document.getElementById("codigo-gerado").textContent = codigo;

    popupCriar.classList.remove("ativo");
    painelMestre.classList.add("visivel");
});

document.getElementById("copiar-codigo").addEventListener("click", async function () {
    const codigo = document.getElementById("codigo-gerado").textContent;

    try {
        await navigator.clipboard.writeText(codigo);
        alert("Código copiado!");
    } catch (erro) {
        window.prompt("Copie o código da sala:", codigo);
    }
});

confirmarEntrar.addEventListener("click", function () {
    const codigo = document.getElementById("codigo-sala")
        .value.trim().toUpperCase();

    const dados = localStorage.getItem("sala-" + codigo);

    if (!dados) {
        alert("Sala não encontrada neste navegador.");
        return;
    }

    const sala = JSON.parse(dados);

    document.getElementById("sala-jogador").textContent =
        "Sala: " + sala.nome;

    popupEntrar.classList.remove("ativo");
    painelJogador.classList.add("visivel");
});

document.getElementById("salvar-personagem").addEventListener("click", function () {
    const nome = document.getElementById("nome-personagem").value.trim();
    const raca = document.getElementById("raca-personagem").value.trim();
    const classe = document.getElementById("classe-personagem").value.trim();
    const historia = document.getElementById("historia-personagem").value.trim();

    if (!nome) {
        alert("Digite o nome do personagem.");
        return;
    }

    const personagem = { nome, raca, classe, historia };

    localStorage.setItem("personagem-rpg", JSON.stringify(personagem));

    document.getElementById("mensagem-personagem").textContent =
        "Personagem salvo com sucesso!";
});

document.querySelectorAll(".voltar-inicio").forEach(function (botao) {
    botao.addEventListener("click", function () {
        painelMestre.classList.remove("visivel");
        painelJogador.classList.remove("visivel");
    });
});

const abrirMundo = document.getElementById("abrir-mundo");
const editorMundo = document.getElementById("editor-mundo");
const historiaMundo = document.getElementById("historia-mundo");
const listaLocais = document.getElementById("lista-locais");
const adicionarLocal = document.getElementById("adicionar-local");
const salvarMundo = document.getElementById("salvar-mundo");
const mensagemMundo = document.getElementById("mensagem-mundo");

function criarCampoLocal(nome = "", descricao = "") {
    const item = document.createElement("div");
    item.className = "local-item";

    const campoNome = document.createElement("input");
    campoNome.type = "text";
    campoNome.placeholder = "Nome do local";
    campoNome.className = "nome-local";
    campoNome.value = nome;

    const campoDescricao = document.createElement("textarea");
    campoDescricao.placeholder = "Descrição do local";
    campoDescricao.className = "descricao-local";
    campoDescricao.value = descricao;

    const remover = document.createElement("button");
    remover.type = "button";
    remover.textContent = "Remover local";

    remover.addEventListener("click", function() {
        item.remove();
        mensagemMundo.textContent = "Salve para confirmar a alteração.";
    });

    item.append(campoNome, campoDescricao, remover);
    listaLocais.appendChild(item);
}

abrirMundo.addEventListener("click", function() {
    editorMundo.classList.toggle("aberto");

    if (!editorMundo.classList.contains("aberto")) {
        return;
    }

    const codigo = document.getElementById("codigo-gerado")
        .textContent.trim();

    const dados = localStorage.getItem("mundo-" + codigo);
    const mundo = dados ? JSON.parse(dados) : {
        historia: "",
        locais: []
    };

    historiaMundo.value = mundo.historia;
    listaLocais.innerHTML = "";

    mundo.locais.forEach(function(local) {
        criarCampoLocal(local.nome, local.descricao);
    });

    mensagemMundo.textContent = "";
});

adicionarLocal.addEventListener("click", function() {
    criarCampoLocal();
});

salvarMundo.addEventListener("click", function() {
    const codigo = document.getElementById("codigo-gerado")
        .textContent.trim();

    const locais = [];

    document.querySelectorAll("#lista-locais .local-item")
        .forEach(function(item) {
            const nome = item.querySelector(".nome-local").value.trim();
            const descricao = item.querySelector(".descricao-local")
                .value.trim();

            if (nome !== "") {
                locais.push({ nome, descricao });
            }
        });

    const mundo = {
        historia: historiaMundo.value.trim(),
        locais: locais
    };

    localStorage.setItem("mundo-" + codigo, JSON.stringify(mundo));

    mensagemMundo.textContent = "Mundo salvo com sucesso!";
});
