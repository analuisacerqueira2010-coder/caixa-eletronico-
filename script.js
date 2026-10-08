// ==========================================
// CONFIGURAÇÕES DO CAIXA
// ==========================================

// Saldo inicial disponível
let saldo = 2500;

// Notas disponíveis no caixa
const notasDisponiveis = [100, 50, 20, 10, 5, 2];


// ==========================================
// ELEMENTOS HTML
// ==========================================

const form = document.getElementById("saqueForm");
const inputValor = document.getElementById("valor");

const mensagem = document.getElementById("mensagem");
const resultado = document.getElementById("resultado");

const notasContainer = document.getElementById("notas");

const saldoElement = document.getElementById("saldo");
const valorSacadoElement = document.getElementById("valorSacado");
const novoSaldoElement = document.getElementById("novoSaldo");


// ==========================================
// FORMATAÇÃO DE MOEDA
// ==========================================

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// ==========================================
// ATUALIZA O SALDO NA TELA
// ==========================================

function atualizarSaldo() {

    saldoElement.textContent = formatarMoeda(saldo);

}


// ==========================================
// MOSTRAR MENSAGEM
// ==========================================

function mostrarMensagem(texto, tipo = "error") {

    mensagem.textContent = texto;

    mensagem.className = `message ${tipo}`;

}


// ==========================================
// ESCONDER MENSAGEM
// ==========================================

function esconderMensagem() {

    mensagem.className = "message hidden";

}


// ==========================================
// CALCULAR NOTAS
// ==========================================

function calcularNotas(valor) {

    let restante = valor;

    const resultadoNotas = [];

    for (const nota of notasDisponiveis) {

        const quantidade = Math.floor(restante / nota);

        if (quantidade > 0) {

            resultadoNotas.push({
                valor: nota,
                quantidade: quantidade
            });

            restante -= nota * quantidade;
        }

    }

    // Se ainda sobrou algum valor,
    // significa que não é possível montar
    // o saque utilizando as notas disponíveis.

    if (restante !== 0) {
        return null;
    }

    return resultadoNotas;
}


// ==========================================
// MOSTRAR RESULTADO
// ==========================================

function mostrarResultado(valor, notas) {

    notasContainer.innerHTML = "";

    valorSacadoElement.textContent = formatarMoeda(valor);

    novoSaldoElement.textContent = formatarMoeda(saldo);


    notas.forEach(nota => {

        const elemento = document.createElement("div");

        elemento.className = "note";

        elemento.innerHTML = `
            <div class="note-left">

                <div class="note-icon">
                    R$
                </div>

                <span class="note-value">
                    Nota de ${formatarMoeda(nota.valor)}
                </span>

            </div>

            <span class="note-quantity">
                ${nota.quantidade} ${
                    nota.quantidade === 1
                        ? "nota"
                        : "notas"
                }
            </span>
        `;

        notasContainer.appendChild(elemento);

    });


    resultado.classList.remove("hidden");

}


// ==========================================
// REALIZAR SAQUE
// ==========================================

form.addEventListener("submit", function(event) {

    event.preventDefault();

    esconderMensagem();

    resultado.classList.add("hidden");


    // Converte o valor digitado para número
    const valor = Number(inputValor.value);


    // ======================================
    // VALIDAÇÃO 1
    // ======================================

    if (!inputValor.value || isNaN(valor)) {

        mostrarMensagem(
            "Digite um valor válido para realizar o saque."
        );

        return;
    }


    // ======================================
    // VALIDAÇÃO 2
    // ======================================

    if (valor <= 0) {

        mostrarMensagem(
            "O valor do saque deve ser maior que zero."
        );

        return;
    }


    // ======================================
    // VALIDAÇÃO 3
    // ======================================

    if (!Number.isInteger(valor)) {

        mostrarMensagem(
            "O caixa trabalha apenas com valores inteiros."
        );

        return;
    }


    // ======================================
    // VALIDAÇÃO 4
    // ======================================

    if (valor > saldo) {

        mostrarMensagem(
            `Saldo insuficiente. Seu saldo atual é ${formatarMoeda(saldo)}.`
        );

        return;
    }


    // ======================================
    // CALCULAR NOTAS
    // ======================================

    const notas = calcularNotas(valor);


    // ======================================
    // VALIDAÇÃO 5
    // ======================================

    if (!notas) {

        mostrarMensagem(
            "Não é possível realizar esse saque com as notas disponíveis: R$ 100, R$ 50, R$ 20, R$ 10, R$ 5 e R$ 2."
        );

        return;
    }


    // ======================================
    // ATUALIZA SALDO
    // ======================================

    saldo -= valor;

    atualizarSaldo();


    // ======================================
    // MOSTRAR RESULTADO
    // ======================================

    mostrarResultado(valor, notas);

    mostrarMensagem(
        "Saque realizado com sucesso!",
        "success"
    );


    // Limpa o campo
    inputValor.value = "";

});


// ==========================================
// BOTÕES DE VALORES RÁPIDOS
// ==========================================

const botoesRapidos = document.querySelectorAll(
    ".quick-values button"
);


botoesRapidos.forEach(botao => {

    botao.addEventListener("click", function() {

        const valor = Number(this.dataset.value);

        inputValor.value = valor;

        inputValor.focus();

    });

});


// ==========================================
// INICIALIZAÇÃO
// ==========================================

atualizarSaldo();