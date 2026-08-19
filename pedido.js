/* =====================================================
   PARÂMETROS DA URL
===================================================== */

const parametrosPedido =
    new URLSearchParams(
        window.location.search
    );


const codigoPedido =
    parametrosPedido.get(
        "codigo"
    );


/* =====================================================
   ELEMENTOS
===================================================== */

const pedidoCarregando =
    document.getElementById(
        "pedidoCarregando"
    );


const pedidoConteudo =
    document.getElementById(
        "pedidoConteudo"
    );


const pedidoErro =
    document.getElementById(
        "pedidoErro"
    );


const pedidoCodigo =
    document.getElementById(
        "pedidoCodigo"
    );


const pedidoStatus =
    document.getElementById(
        "pedidoStatus"
    );


const pedidoLista =
    document.getElementById(
        "pedidoLista"
    );


const pedidoQuantidade =
    document.getElementById(
        "pedidoQuantidade"
    );


const pedidoTotal =
    document.getElementById(
        "pedidoTotal"
    );


/* =====================================================
   FORMATAR PREÇO
===================================================== */

function formatarPrecoPedido(
    valor
) {

    return Number(valor)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


/* =====================================================
   FORMATAR STATUS
===================================================== */

function formatarStatusPedido(
    status
) {

    const nomes = {

        novo:
            "Novo",

        confirmado:
            "Confirmado",

        pago:
            "Pago",

        entregue:
            "Entregue",

        cancelado:
            "Cancelado"

    };


    return nomes[status] ||
        status ||
        "Novo";

}


/* =====================================================
   VERIFICAR PROMOÇÃO
===================================================== */

function itemTemPromocao(
    item
) {

    const original =
        Number(
            item.preco_original
        );


    const final =
        Number(
            item.preco_final
        );


    return (
        Number.isFinite(
            original
        ) &&
        Number.isFinite(
            final
        ) &&
        original > final
    );

}


/* =====================================================
   CRIAR HTML DO ITEM
===================================================== */

function criarHtmlItemPedido(
    item
) {

    const promocao =
        itemTemPromocao(
            item
        );


    return `

        <article class="pedido-item">

            <div class="pedido-item-imagem">

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


            <div class="pedido-item-info">

                <h2>
                    ${item.nome}
                </h2>


                ${
                    item.tamanho

                        ? `

                            <p class="pedido-item-variacao">
                                Tamanho: ${item.tamanho}
                            </p>

                          `

                        : ""
                }


                ${
                    item.cor

                        ? `

                            <p class="pedido-item-variacao">
                                Cor: ${item.cor}
                            </p>

                          `

                        : ""
                }


                <p class="pedido-item-quantidade">

                    Quantidade:
                    <strong>
                        ${item.quantidade}
                    </strong>

                </p>


                <div class="pedido-precos">

                    ${
                        promocao

                            ? `

                                <span class="pedido-preco-original">

                                    ${formatarPrecoPedido(
                                        item.preco_original
                                    )}

                                </span>

                              `

                            : ""
                    }


                    <span class="pedido-preco-final">

                        ${formatarPrecoPedido(
                            item.preco_final
                        )}

                    </span>

                </div>


                <p class="pedido-subtotal">

                    Subtotal:
                    ${formatarPrecoPedido(
                        item.subtotal
                    )}

                </p>

            </div>

        </article>

    `;

}


/* =====================================================
   MOSTRAR ERRO
===================================================== */

function mostrarErroPedido() {

    pedidoCarregando.style.display =
        "none";


    pedidoConteudo.style.display =
        "none";


    pedidoErro.style.display =
        "block";

}


/* =====================================================
   CARREGAR PEDIDO
===================================================== */

async function carregarPedido() {

    if (
        !codigoPedido
    ) {

        mostrarErroPedido();

        return;

    }


    try {

        /* =============================================
           BUSCAR PEDIDO
        ============================================= */

        const {
            data: pedido,
            error: erroPedido
        } =
            await supabaseClient
                .from(
                    "pedidos"
                )
                .select(
                    "*"
                )
                .eq(
                    "codigo",
                    codigoPedido
                )
                .single();


        if (
            erroPedido ||
            !pedido
        ) {

            console.error(
                "Erro ao buscar pedido:",
                erroPedido
            );


            mostrarErroPedido();

            return;

        }


        /* =============================================
           BUSCAR ITENS
        ============================================= */

        const {
            data: itens,
            error: erroItens
        } =
            await supabaseClient
                .from(
                    "itens_pedido"
                )
                .select(
                    "*"
                )
                .eq(
                    "pedido_id",
                    pedido.id
                )
                .order(
                    "id",
                    {
                        ascending: true
                    }
                );


        if (
            erroItens
        ) {

            console.error(
                "Erro ao buscar itens:",
                erroItens
            );


            mostrarErroPedido();

            return;

        }


        /* =============================================
           PREENCHER CABEÇALHO
        ============================================= */

        pedidoCodigo.textContent =
            `Código: ${pedido.codigo}`;


        pedidoStatus.textContent =
            formatarStatusPedido(
                pedido.status
            );


        /* =============================================
           PREENCHER ITENS
        ============================================= */

        pedidoLista.innerHTML =
            (itens || [])
                .map(
                    criarHtmlItemPedido
                )
                .join("");


        /* =============================================
           RESUMO
        ============================================= */

        pedidoQuantidade.textContent =
            pedido.quantidade_itens;


        pedidoTotal.textContent =
            formatarPrecoPedido(
                pedido.total
            );


        /* =============================================
           MOSTRAR CONTEÚDO
        ============================================= */

        pedidoCarregando.style.display =
            "none";


        pedidoErro.style.display =
            "none";


        pedidoConteudo.style.display =
            "block";

    }

    catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );


        mostrarErroPedido();

    }

}


/* =====================================================
   INICIAR
===================================================== */

carregarPedido();