/* =====================================================
   CONFIGURAÇÕES DO CARRINHO
===================================================== */

const CHAVE_CARRINHO = "novaEraReisCarrinho";

const NUMERO_WHATSAPP = "5521979767849";

let carrinho = carregarCarrinho();


/* =====================================================
   ELEMENTOS DO CARRINHO
===================================================== */

const btnAbrirCarrinho =
    document.getElementById("btnAbrirCarrinho");

const btnFecharCarrinho =
    document.getElementById("btnFecharCarrinho");

const btnContinuarComprando =
    document.getElementById("btnContinuarComprando");

const fundoCarrinho =
    document.getElementById("fundoCarrinho");

const carrinhoLateral =
    document.getElementById("carrinhoLateral");

const contadorCarrinho =
    document.getElementById("contadorCarrinho");

const resumoCarrinho =
    document.getElementById("resumoCarrinho");

const itensCarrinho =
    document.getElementById("itensCarrinho");

const totalCarrinho =
    document.getElementById("totalCarrinho");

const btnFinalizarWhatsapp =
    document.getElementById("btnFinalizarWhatsapp");


/* =====================================================
   FORMATAR PREÇO
===================================================== */

function formatarPrecoCarrinho(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =====================================================
   CARREGAR DO NAVEGADOR
===================================================== */

function carregarCarrinho() {

    try {

        const dados =
            localStorage.getItem(
                CHAVE_CARRINHO
            );

        if (!dados) {

            return [];

        }

        const lista =
            JSON.parse(dados);

        return Array.isArray(lista)
            ? lista
            : [];

    }

    catch (erro) {

        console.error(
            "Erro ao carregar carrinho:",
            erro
        );

        return [];

    }

}


/* =====================================================
   SALVAR NO NAVEGADOR
===================================================== */

function salvarCarrinho() {

    localStorage.setItem(
        CHAVE_CARRINHO,
        JSON.stringify(carrinho)
    );

}


/* =====================================================
   GERAR CHAVE DO ITEM
===================================================== */

function gerarChaveItem(
    produtoId,
    tamanho,
    cor
) {

    return [
        produtoId,
        tamanho || "",
        cor || ""
    ].join("|");

}


/* =====================================================
   ADICIONAR AO CARRINHO
===================================================== */

function adicionarAoCarrinho({
    produto,
    tamanho = "",
    cor = "",
    quantidade = 1
}) {

    if (!produto) {

        return false;

    }

    quantidade =
        Number(quantidade);

    if (
        !Number.isFinite(quantidade) ||
        quantidade < 1
    ) {

        quantidade = 1;

    }

    const chave =
        gerarChaveItem(
            produto.id,
            tamanho,
            cor
        );

    const itemExistente =
        carrinho.find(
            item =>
                item.chave === chave
        );

    if (itemExistente) {

        itemExistente.quantidade +=
            quantidade;

    }

    else {

        carrinho.push({

            chave: chave,

            produtoId:
                produto.id,

            nome:
                produto.nome,

            preco:
                Number(produto.preco),

            imagem:
                Array.isArray(produto.imagens) &&
                produto.imagens.length > 0
                    ? produto.imagens[0]
                    : "",

            tamanho:
                tamanho,

            cor:
                cor,

            quantidade:
                quantidade

        });

    }

    salvarCarrinho();

    atualizarCarrinho();

    return true;

}


/* =====================================================
   REMOVER ITEM
===================================================== */

function removerItemCarrinho(chave) {

    carrinho =
        carrinho.filter(
            item =>
                item.chave !== chave
        );

    salvarCarrinho();

    atualizarCarrinho();

}


/* =====================================================
   ALTERAR QUANTIDADE
===================================================== */

function alterarQuantidadeCarrinho(
    chave,
    alteracao
) {

    const item =
        carrinho.find(
            item =>
                item.chave === chave
        );

    if (!item) {

        return;

    }

    item.quantidade += alteracao;

    if (item.quantidade <= 0) {

        removerItemCarrinho(
            chave
        );

        return;

    }

    salvarCarrinho();

    atualizarCarrinho();

}


/* =====================================================
   TOTAL DE UNIDADES
===================================================== */

function calcularQuantidadeCarrinho() {

    return carrinho.reduce(
        (total, item) =>
            total + item.quantidade,
        0
    );

}


/* =====================================================
   TOTAL EM DINHEIRO
===================================================== */

function calcularTotalCarrinho() {

    return carrinho.reduce(
        (total, item) =>
            total +
            (
                item.preco *
                item.quantidade
            ),
        0
    );

}


/* =====================================================
   ABRIR CARRINHO
===================================================== */

function abrirCarrinho() {

    if (!carrinhoLateral) {

        return;

    }

    carrinhoLateral.classList.add(
        "aberto"
    );

    fundoCarrinho?.classList.add(
        "aberto"
    );

    document.body.classList.add(
        "carrinho-aberto"
    );

}


/* =====================================================
   FECHAR CARRINHO
===================================================== */

function fecharCarrinho() {

    carrinhoLateral?.classList.remove(
        "aberto"
    );

    fundoCarrinho?.classList.remove(
        "aberto"
    );

    document.body.classList.remove(
        "carrinho-aberto"
    );

}


/* =====================================================
   RENDERIZAR ITEM
===================================================== */

function criarHtmlItemCarrinho(item) {

    let variacoes = [];

    if (item.tamanho) {

        variacoes.push(
            `Tamanho: ${item.tamanho}`
        );

    }

    if (item.cor) {

        variacoes.push(
            `Cor: ${item.cor}`
        );

    }

    const variacaoTexto =
        variacoes.join(" • ");

    return `

        <div
            class="item-carrinho"
            data-chave="${item.chave}"
        >

            <div class="item-carrinho-imagem">

                ${
                    item.imagem
                        ? `
                            <img
                                src="${item.imagem}"
                                alt="${item.nome}"
                            >
                          `
                        : ""
                }

            </div>


            <div class="item-carrinho-info">

                <h3>
                    ${item.nome}
                </h3>

                ${
                    variacaoTexto
                        ? `
                            <p class="item-carrinho-variacao">
                                ${variacaoTexto}
                            </p>
                          `
                        : ""
                }

                <p class="item-carrinho-preco">
                    ${formatarPrecoCarrinho(
                        item.preco
                    )}
                </p>


                <div class="item-carrinho-acoes">

                    <div class="controle-quantidade">

                        <button
                            type="button"
                            class="btn-diminuir-item"
                            data-chave="${item.chave}"
                            aria-label="Diminuir quantidade"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantidade}
                        </span>

                        <button
                            type="button"
                            class="btn-aumentar-item"
                            data-chave="${item.chave}"
                            aria-label="Aumentar quantidade"
                        >
                            +
                        </button>

                    </div>


                    <button
                        type="button"
                        class="btn-remover-item"
                        data-chave="${item.chave}"
                    >
                        Remover
                    </button>

                </div>

            </div>

        </div>

    `;

}


/* =====================================================
   ATUALIZAR CARRINHO
===================================================== */

function atualizarCarrinho() {

    const quantidade =
        calcularQuantidadeCarrinho();

    const total =
        calcularTotalCarrinho();


    /* CONTADOR */

    if (contadorCarrinho) {

        contadorCarrinho.textContent =
            quantidade;

    }


    /* RESUMO */

    if (resumoCarrinho) {

        resumoCarrinho.textContent =
            quantidade === 0
                ? "Nenhum item adicionado"
                : quantidade === 1
                    ? "1 item no carrinho"
                    : `${quantidade} itens no carrinho`;

    }


    /* TOTAL */

    if (totalCarrinho) {

        totalCarrinho.textContent =
            formatarPrecoCarrinho(
                total
            );

    }


    /* BOTÃO FINALIZAR */

    if (btnFinalizarWhatsapp) {

        btnFinalizarWhatsapp.disabled =
            quantidade === 0;

    }


    /* ITENS */

    if (!itensCarrinho) {

        return;

    }


    if (carrinho.length === 0) {

        itensCarrinho.innerHTML = `

            <div class="carrinho-vazio">

                <span class="carrinho-vazio-icone">
                    🛒
                </span>

                <h3>
                    Seu carrinho está vazio
                </h3>

                <p>
                    Escolha seus produtos e adicione ao carrinho.
                </p>

            </div>

        `;

        return;

    }


    itensCarrinho.innerHTML =
        carrinho
            .map(
                criarHtmlItemCarrinho
            )
            .join("");

}


/* =====================================================
   FINALIZAR PELO WHATSAPP
===================================================== */

function finalizarPedidoWhatsapp() {

    if (carrinho.length === 0) {

        return;

    }


    const linhas = [];

    linhas.push(
        "Olá! Quero fazer este pedido na Nova Era Reis:"
    );

    linhas.push("");


    carrinho.forEach(
        (item, indice) => {

            linhas.push(
                `${indice + 1}. ${item.nome}`
            );

            if (item.tamanho) {

                linhas.push(
                    `Tamanho: ${item.tamanho}`
                );

            }

            if (item.cor) {

                linhas.push(
                    `Cor: ${item.cor}`
                );

            }

            linhas.push(
                `Quantidade: ${item.quantidade}`
            );

            linhas.push(
                `Valor unitário: ${formatarPrecoCarrinho(
                    item.preco
                )}`
            );

            linhas.push(
                `Subtotal: ${formatarPrecoCarrinho(
                    item.preco *
                    item.quantidade
                )}`
            );

            linhas.push("");

        }
    );


    linhas.push(
        `Total do pedido: ${formatarPrecoCarrinho(
            calcularTotalCarrinho()
        )}`
    );

    linhas.push("");

    linhas.push(
        "Gostaria de confirmar a disponibilidade e combinar o pagamento/entrega."
    );


    const mensagem =
        linhas.join("\n");


    const link =
        `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;


    window.open(
        link,
        "_blank"
    );

}


/* =====================================================
   CLIQUES NOS ITENS DO CARRINHO
===================================================== */

if (itensCarrinho) {

    itensCarrinho.addEventListener(
        "click",
        evento => {

            const diminuir =
                evento.target.closest(
                    ".btn-diminuir-item"
                );

            const aumentar =
                evento.target.closest(
                    ".btn-aumentar-item"
                );

            const remover =
                evento.target.closest(
                    ".btn-remover-item"
                );


            if (diminuir) {

                alterarQuantidadeCarrinho(
                    diminuir.dataset.chave,
                    -1
                );

                return;

            }


            if (aumentar) {

                alterarQuantidadeCarrinho(
                    aumentar.dataset.chave,
                    1
                );

                return;

            }


            if (remover) {

                removerItemCarrinho(
                    remover.dataset.chave
                );

            }

        }
    );

}


/* =====================================================
   EVENTOS DO PAINEL
===================================================== */

btnAbrirCarrinho?.addEventListener(
    "click",
    abrirCarrinho
);

btnFecharCarrinho?.addEventListener(
    "click",
    fecharCarrinho
);

btnContinuarComprando?.addEventListener(
    "click",
    fecharCarrinho
);

fundoCarrinho?.addEventListener(
    "click",
    fecharCarrinho
);

btnFinalizarWhatsapp?.addEventListener(
    "click",
    finalizarPedidoWhatsapp
);


/* =====================================================
   TECLA ESC
===================================================== */

document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key === "Escape"
        ) {

            fecharCarrinho();

        }

    }
);


/* =====================================================
   DISPONIBILIZAR FUNÇÕES PARA OUTRAS PÁGINAS
===================================================== */

window.NovaEraCarrinho = {

    adicionar:
        adicionarAoCarrinho,

    abrir:
        abrirCarrinho,

    atualizar:
        atualizarCarrinho,

    obterItens:
        () => [...carrinho]

};


/* =====================================================
   INICIAR
===================================================== */

atualizarCarrinho();