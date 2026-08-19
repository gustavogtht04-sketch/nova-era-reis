/* =====================================================
   CONFIGURAÇÕES DO CARRINHO
===================================================== */

const CHAVE_CARRINHO =
    "novaEraReisCarrinho";

const NUMERO_WHATSAPP =
    "5521979767849";

const URL_SITE_PUBLICO =
    "https://nova-era-reis.netlify.app";


let carrinho =
    carregarCarrinho();


/* =====================================================
   ELEMENTOS DO CARRINHO
===================================================== */

const btnAbrirCarrinho =
    document.getElementById(
        "btnAbrirCarrinho"
    );


const btnFecharCarrinho =
    document.getElementById(
        "btnFecharCarrinho"
    );


const btnContinuarComprando =
    document.getElementById(
        "btnContinuarComprando"
    );


const fundoCarrinho =
    document.getElementById(
        "fundoCarrinho"
    );


const carrinhoLateral =
    document.getElementById(
        "carrinhoLateral"
    );


const contadorCarrinho =
    document.getElementById(
        "contadorCarrinho"
    );


const resumoCarrinho =
    document.getElementById(
        "resumoCarrinho"
    );


const itensCarrinho =
    document.getElementById(
        "itensCarrinho"
    );


const totalCarrinho =
    document.getElementById(
        "totalCarrinho"
    );


const btnFinalizarWhatsapp =
    document.getElementById(
        "btnFinalizarWhatsapp"
    );


/* =====================================================
   FORMATAR PREÇO
===================================================== */

function formatarPrecoCarrinho(
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
   VERIFICAR PROMOÇÃO
===================================================== */

function produtoTemPromocaoCarrinho(
    produto
) {

    if (!produto) {

        return false;

    }


    /*
       O produto pode chegar de duas formas:

       1. preco = preço original
          precoPromocional = promoção

       2. preco = preço final
          precoOriginal = preço original
          precoPromocional = promoção
    */


    const precoOriginal =
        Number(
            produto.precoOriginal ??
            produto.preco
        );


    const precoPromocional =
        Number(
            produto.precoPromocional
        );


    return (

        produto.precoPromocional !== null &&

        produto.precoPromocional !== undefined &&

        produto.precoPromocional !== "" &&

        !Number.isNaN(
            precoPromocional
        ) &&

        precoPromocional > 0 &&

        !Number.isNaN(
            precoOriginal
        ) &&

        precoPromocional <
            precoOriginal

    );

}


/* =====================================================
   OBTER PREÇO FINAL DO PRODUTO
===================================================== */

function obterPrecoFinalCarrinho(
    produto
) {

    if (!produto) {

        return 0;

    }


    if (
        produtoTemPromocaoCarrinho(
            produto
        )
    ) {

        return Number(
            produto.precoPromocional
        );

    }


    return Number(
        produto.preco
    );

}


/* =====================================================
   OBTER PREÇO ORIGINAL
===================================================== */

function obterPrecoOriginalCarrinho(
    produto
) {

    if (!produto) {

        return 0;

    }


    return Number(
        produto.precoOriginal ??
        produto.preco
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
            JSON.parse(
                dados
            );


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

    try {

        localStorage.setItem(
            CHAVE_CARRINHO,
            JSON.stringify(
                carrinho
            )
        );

    }

    catch (erro) {

        console.error(
            "Erro ao salvar carrinho:",
            erro
        );

    }

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
        Number(
            quantidade
        );


    if (

        !Number.isFinite(
            quantidade
        )

        ||

        quantidade < 1

    ) {

        quantidade = 1;

    }


    /* =================================================
       DEFINIR PREÇOS
    ================================================= */

    const precoFinal =
        obterPrecoFinalCarrinho(
            produto
        );


    const precoOriginal =
        obterPrecoOriginalCarrinho(
            produto
        );


    const precoPromocional =
        produtoTemPromocaoCarrinho(
            produto
        )
            ? Number(
                produto.precoPromocional
            )
            : null;


    if (

        !Number.isFinite(
            precoFinal
        )

        ||

        precoFinal <= 0

    ) {

        console.error(
            "Produto com preço inválido:",
            produto
        );


        return false;

    }


    /* =================================================
       CHAVE DO ITEM
    ================================================= */

    const chave =
        gerarChaveItem(
            produto.id,
            tamanho,
            cor
        );


    const itemExistente =
        carrinho.find(
            item =>
                item.chave ===
                chave
        );


    /* =================================================
       ITEM JÁ EXISTE
    ================================================= */

    if (itemExistente) {

        itemExistente.quantidade +=
            quantidade;


        /*
           Atualiza também os preços.

           Isso é importante caso
           uma promoção tenha sido
           cadastrada depois.
        */

        itemExistente.preco =
            precoFinal;


        itemExistente.precoOriginal =
            precoOriginal;


        itemExistente.precoPromocional =
            precoPromocional;

    }


    /* =================================================
       NOVO ITEM
    ================================================= */

    else {

        carrinho.push({

            chave:
                chave,


            produtoId:
                produto.id,


            nome:
                produto.nome,


            /*
               PREÇO USADO NOS CÁLCULOS
            */

            preco:
                precoFinal,


            /*
               INFORMAÇÕES DA PROMOÇÃO
            */

            precoOriginal:
                precoOriginal,


            precoPromocional:
                precoPromocional,


            imagem:

                Array.isArray(
                    produto.imagens
                )

                &&

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

function removerItemCarrinho(
    chave
) {

    carrinho =
        carrinho.filter(
            item =>
                item.chave !==
                chave
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
                item.chave ===
                chave
        );


    if (!item) {

        return;

    }


    item.quantidade +=
        alteracao;


    if (
        item.quantidade <= 0
    ) {

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
        (
            total,
            item
        ) => {

            return total +
                Number(
                    item.quantidade
                );

        },
        0
    );

}


/* =====================================================
   TOTAL EM DINHEIRO
===================================================== */

function calcularTotalCarrinho() {

    return carrinho.reduce(
        (
            total,
            item
        ) => {

            const preco =
                Number(
                    item.preco
                );


            const quantidade =
                Number(
                    item.quantidade
                );


            return total +
                (
                    preco *
                    quantidade
                );

        },
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


    carrinhoLateral
        .classList
        .add(
            "aberto"
        );


    fundoCarrinho
        ?.classList
        .add(
            "aberto"
        );


    document
        .body
        .classList
        .add(
            "carrinho-aberto"
        );

}


/* =====================================================
   FECHAR CARRINHO
===================================================== */

function fecharCarrinho() {

    carrinhoLateral
        ?.classList
        .remove(
            "aberto"
        );


    fundoCarrinho
        ?.classList
        .remove(
            "aberto"
        );


    document
        .body
        .classList
        .remove(
            "carrinho-aberto"
        );

}


/* =====================================================
   VERIFICAR SE ITEM TEM PROMOÇÃO
===================================================== */

function itemCarrinhoTemPromocao(
    item
) {

    const original =
        Number(
            item.precoOriginal
        );


    const promocional =
        Number(
            item.precoPromocional
        );


    return (

        item.precoPromocional !== null &&

        item.precoPromocional !== undefined &&

        item.precoPromocional !== "" &&

        !Number.isNaN(
            promocional
        ) &&

        !Number.isNaN(
            original
        ) &&

        promocional > 0 &&

        promocional <
            original

    );

}


/* =====================================================
   HTML DO PREÇO NO CARRINHO
===================================================== */

function criarHtmlPrecoCarrinho(
    item
) {

    if (
        itemCarrinhoTemPromocao(
            item
        )
    ) {

        return `

            <div
                class="item-carrinho-preco"
            >

                <span
                    style="
                        color:#888888;
                        text-decoration:line-through;
                        font-size:12px;
                        font-weight:400;
                        margin-right:6px;
                    "
                >

                    ${formatarPrecoCarrinho(
                        item.precoOriginal
                    )}

                </span>


                <strong>

                    ${formatarPrecoCarrinho(
                        item.preco
                    )}

                </strong>

            </div>

        `;

    }


    return `

        <p class="item-carrinho-preco">

            ${formatarPrecoCarrinho(
                item.preco
            )}

        </p>

    `;

}


/* =====================================================
   RENDERIZAR ITEM
===================================================== */

function criarHtmlItemCarrinho(
    item
) {

    let variacoes =
        [];


    if (
        item.tamanho
    ) {

        variacoes.push(
            `Tamanho: ${item.tamanho}`
        );

    }


    if (
        item.cor
    ) {

        variacoes.push(
            `Cor: ${item.cor}`
        );

    }


    const variacaoTexto =
        variacoes.join(
            " • "
        );


    return `

        <div
            class="item-carrinho"
            data-chave="${item.chave}"
        >


            <div
                class="item-carrinho-imagem"
            >

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


            <div
                class="item-carrinho-info"
            >


                <h3>
                    ${item.nome}
                </h3>


                ${
                    variacaoTexto

                        ? `

                            <p
                                class="item-carrinho-variacao"
                            >
                                ${variacaoTexto}
                            </p>

                          `

                        : ""
                }


                ${criarHtmlPrecoCarrinho(
                    item
                )}


                <div
                    class="item-carrinho-acoes"
                >


                    <div
                        class="controle-quantidade"
                    >


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


    /* =================================================
       CONTADOR
    ================================================= */

    if (
        contadorCarrinho
    ) {

        contadorCarrinho.textContent =
            quantidade;

    }


    /* =================================================
       RESUMO
    ================================================= */

    if (
        resumoCarrinho
    ) {

        resumoCarrinho.textContent =

            quantidade === 0

                ? "Nenhum item adicionado"

                : quantidade === 1

                    ? "1 item no carrinho"

                    : `${quantidade} itens no carrinho`;

    }


    /* =================================================
       TOTAL
    ================================================= */

    if (
        totalCarrinho
    ) {

        totalCarrinho.textContent =
            formatarPrecoCarrinho(
                total
            );

    }


    /* =================================================
       BOTÃO FINALIZAR
    ================================================= */

    if (
        btnFinalizarWhatsapp
    ) {

        btnFinalizarWhatsapp.disabled =
            quantidade === 0;

    }


    /* =================================================
       ITENS
    ================================================= */

    if (
        !itensCarrinho
    ) {

        return;

    }


    if (
        carrinho.length === 0
    ) {

        itensCarrinho.innerHTML = `

            <div
                class="carrinho-vazio"
            >

                <span
                    class="carrinho-vazio-icone"
                >
                    🛒
                </span>


                <h3>
                    Seu carrinho está vazio
                </h3>


                <p>
                    Escolha seus produtos
                    e adicione ao carrinho.
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

function gerarCodigoPedido() {

    const agora =
        new Date();


    const ano =
        String(
            agora.getFullYear()
        );


    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            agora.getDate()
        ).padStart(
            2,
            "0"
        );


    const hora =
        String(
            agora.getHours()
        ).padStart(
            2,
            "0"
        );


    const minuto =
        String(
            agora.getMinutes()
        ).padStart(
            2,
            "0"
        );


    const segundo =
        String(
            agora.getSeconds()
        ).padStart(
            2,
            "0"
        );


    const aleatorio =
        Math.floor(
            100 +
            Math.random() * 900
        );


    return (
        `NER-${ano}${mes}${dia}-` +
        `${hora}${minuto}${segundo}-` +
        `${aleatorio}`
    );

}


/* =====================================================
   SALVAR PEDIDO NO SUPABASE
===================================================== */

async function salvarPedidoNoSupabase() {

    if (
        carrinho.length === 0
    ) {

        throw new Error(
            "O carrinho está vazio."
        );

    }


    const codigo =
        gerarCodigoPedido();


    const total =
        calcularTotalCarrinho();


    const quantidadeItens =
        calcularQuantidadeCarrinho();


    /* ================================================
       1. CRIAR PEDIDO
    ================================================ */

    const {
        data: pedidoCriado,
        error: erroPedido
    } =
        await supabaseClient
            .from(
                "pedidos"
            )
            .insert([
                {
                    codigo:
                        codigo,

                    total:
                        total,

                    quantidade_itens:
                        quantidadeItens,

                    status:
                        "novo"
                }
            ])
            .select(
                "id, codigo, total, quantidade_itens, status, created_at"
            )
            .single();


    if (
        erroPedido
    ) {

        console.error(
            "Erro ao criar pedido:",
            erroPedido
        );


        throw new Error(
            "Não foi possível criar o pedido."
        );

    }


    /* ================================================
       2. PREPARAR ITENS DO PEDIDO
    ================================================ */

    const itens =
        carrinho.map(
            item => {

                const quantidade =
                    Number(
                        item.quantidade
                    );


                const precoFinal =
                    Number(
                        item.preco
                    );


                const precoOriginal =
                    Number(
                        item.precoOriginal ??
                        item.preco
                    );


                return {

                    pedido_id:
                        pedidoCriado.id,

                    produto_id:
                        Number(
                            item.produtoId
                        ),

                    nome:
                        item.nome,

                    tamanho:
                        item.tamanho || null,

                    cor:
                        item.cor || null,

                    quantidade:
                        quantidade,

                    preco_original:
                        precoOriginal,

                    preco_final:
                        precoFinal,

                    subtotal:
                        precoFinal *
                        quantidade,

                    imagem:
                        item.imagem || null

                };

            }
        );


    /* ================================================
       3. SALVAR ITENS
    ================================================ */

    const {
        error: erroItens
    } =
        await supabaseClient
            .from(
                "itens_pedido"
            )
            .insert(
                itens
            );


    if (
        erroItens
    ) {

        console.error(
            "Erro ao salvar itens do pedido:",
            erroItens
        );


        throw new Error(
            "O pedido foi criado, mas não foi possível salvar os itens."
        );

    }


    return pedidoCriado;

}


/* =====================================================
   CRIAR LINK PÚBLICO DO PEDIDO
===================================================== */

function criarLinkPedido(
    codigo
) {

    return (
        `${URL_SITE_PUBLICO}/pedido.html` +
        `?codigo=${encodeURIComponent(
            codigo
        )}`
    );

}


/* =====================================================
   MONTAR MENSAGEM DO WHATSAPP
===================================================== */

function montarMensagemWhatsappPedido(
    pedido
) {

    const linkPedido =
        criarLinkPedido(
            pedido.codigo
        );


    const linhas =
        [];


    linhas.push(
        "Olá! Quero fazer este pedido na Nova Era Reis."
    );


    linhas.push(
        ""
    );


    linhas.push(
        `Pedido: ${pedido.codigo}`
    );


    linhas.push(
        `Quantidade de itens: ${pedido.quantidade_itens}`
    );


    linhas.push(
        `Total: ${formatarPrecoCarrinho(
            pedido.total
        )}`
    );


    linhas.push(
        ""
    );


    linhas.push(
        "🛍️ Visualizar pedido completo:"
    );


    linhas.push(
        linkPedido
    );


    linhas.push(
        ""
    );


    linhas.push(
        "No link estão as fotos, tamanhos, cores, quantidades e valores de todos os itens."
    );


    linhas.push(
        ""
    );


    linhas.push(
        "Gostaria de confirmar a disponibilidade e combinar o pagamento/entrega."
    );


    return linhas.join(
        "\n"
    );

}


/* =====================================================
   FINALIZAR PELO WHATSAPP
===================================================== */

let finalizandoPedido =
    false;


async function finalizarPedidoWhatsapp() {

    if (
        carrinho.length === 0 ||
        finalizandoPedido
    ) {

        return;

    }


    finalizandoPedido =
        true;


    const textoOriginalBotao =
        btnFinalizarWhatsapp
            ?.textContent;


    if (
        btnFinalizarWhatsapp
    ) {

        btnFinalizarWhatsapp.disabled =
            true;


        btnFinalizarWhatsapp.textContent =
            "Gerando pedido...";

    }


    try {

        /* ============================================
           SALVAR PEDIDO
        ============================================ */

        const pedido =
            await salvarPedidoNoSupabase();


        /* ============================================
           MONTAR WHATSAPP
        ============================================ */

        const mensagem =
            montarMensagemWhatsappPedido(
                pedido
            );


        const linkWhatsapp =
            `https://wa.me/${NUMERO_WHATSAPP}` +
            `?text=${encodeURIComponent(
                mensagem
            )}`;


        window.open(
            linkWhatsapp,
            "_blank"
        );


        /*
           Não limpamos o carrinho automaticamente.

           Assim, se o cliente fechar o WhatsApp
           sem enviar a mensagem, ele ainda consegue
           voltar ao carrinho e conferir o pedido.
        */

    }

    catch (erro) {

        console.error(
            "Erro ao finalizar pedido:",
            erro
        );


        alert(
            "Não foi possível gerar o pedido agora. Tente novamente."
        );

    }

    finally {

        finalizandoPedido =
            false;


        if (
            btnFinalizarWhatsapp
        ) {

            btnFinalizarWhatsapp.disabled =
                carrinho.length === 0;


            btnFinalizarWhatsapp.textContent =
                textoOriginalBotao ||
                "Finalizar pelo WhatsApp";

        }

    }

}


/* =====================================================
   CLIQUES NOS ITENS DO CARRINHO
===================================================== */

if (
    itensCarrinho
) {

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


            /* DIMINUIR */

            if (
                diminuir
            ) {

                alterarQuantidadeCarrinho(
                    diminuir.dataset.chave,
                    -1
                );


                return;

            }


            /* AUMENTAR */

            if (
                aumentar
            ) {

                alterarQuantidadeCarrinho(
                    aumentar.dataset.chave,
                    1
                );


                return;

            }


            /* REMOVER */

            if (
                remover
            ) {

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

btnAbrirCarrinho
    ?.addEventListener(
        "click",
        abrirCarrinho
    );


btnFecharCarrinho
    ?.addEventListener(
        "click",
        fecharCarrinho
    );


btnContinuarComprando
    ?.addEventListener(
        "click",
        fecharCarrinho
    );


fundoCarrinho
    ?.addEventListener(
        "click",
        fecharCarrinho
    );


btnFinalizarWhatsapp
    ?.addEventListener(
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
            evento.key ===
            "Escape"
        ) {

            fecharCarrinho();

        }

    }
);


/* =====================================================
   SINCRONIZAR PREÇOS COM O CATÁLOGO
===================================================== */

async function sincronizarPrecosCarrinho() {

    /*
       Essa função corrige automaticamente
       itens que já estavam salvos no
       localStorage antes da promoção.
    */


    try {

        /*
           produtosProntos vem do produtos.js
        */

        if (
            typeof produtosProntos !==
            "undefined"
        ) {

            await produtosProntos;

        }


        if (

            typeof produtos ===
                "undefined"

            ||

            !Array.isArray(
                produtos
            )

        ) {

            atualizarCarrinho();


            return;

        }


        let houveAlteracao =
            false;


        carrinho.forEach(
            item => {


                const produtoAtual =
                    produtos.find(
                        produto =>
                            Number(
                                produto.id
                            )
                            ===
                            Number(
                                item.produtoId
                            )
                    );


                if (
                    !produtoAtual
                ) {

                    return;

                }


                const precoFinal =
                    obterPrecoFinalCarrinho(
                        produtoAtual
                    );


                const precoOriginal =
                    obterPrecoOriginalCarrinho(
                        produtoAtual
                    );


                const precoPromocional =
                    produtoTemPromocaoCarrinho(
                        produtoAtual
                    )
                        ? Number(
                            produtoAtual
                                .precoPromocional
                        )
                        : null;


                if (
                    Number(
                        item.preco
                    )
                    !==
                    precoFinal
                ) {

                    item.preco =
                        precoFinal;


                    houveAlteracao =
                        true;

                }


                if (
                    Number(
                        item.precoOriginal
                    )
                    !==
                    precoOriginal
                ) {

                    item.precoOriginal =
                        precoOriginal;


                    houveAlteracao =
                        true;

                }


                if (
                    item.precoPromocional
                    !==
                    precoPromocional
                ) {

                    item.precoPromocional =
                        precoPromocional;


                    houveAlteracao =
                        true;

                }

            }
        );


        if (
            houveAlteracao
        ) {

            salvarCarrinho();

        }


        atualizarCarrinho();

    }

    catch (erro) {

        console.error(
            "Erro ao sincronizar preços do carrinho:",
            erro
        );


        atualizarCarrinho();

    }

}


/* =====================================================
   DISPONIBILIZAR FUNÇÕES PARA OUTRAS PÁGINAS
===================================================== */

window.NovaEraCarrinho = {

    adicionar:
        adicionarAoCarrinho,


    abrir:
        abrirCarrinho,


    fechar:
        fecharCarrinho,


    atualizar:
        atualizarCarrinho,


    obterItens:
        () => [
            ...carrinho
        ]

};


/* =====================================================
   INICIAR
===================================================== */

atualizarCarrinho();


sincronizarPrecosCarrinho();