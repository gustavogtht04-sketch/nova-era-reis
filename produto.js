const parametros =
    new URLSearchParams(
        window.location.search
    );


const idProduto =
    Number(
        parametros.get("id")
    );


/* =====================================================
   ELEMENTOS DA PÁGINA
===================================================== */

const imagemProduto =
    document.getElementById(
        "imagemProduto"
    );


const miniaturasProduto =
    document.getElementById(
        "miniaturasProduto"
    );


const categoriaProduto =
    document.getElementById(
        "categoriaProduto"
    );


const nomeProduto =
    document.getElementById(
        "nomeProduto"
    );


const precoProduto =
    document.getElementById(
        "precoProduto"
    );


const tamanhosProduto =
    document.getElementById(
        "tamanhosProduto"
    );


const coresProduto =
    document.getElementById(
        "coresProduto"
    );


const blocoTamanhos =
    document.getElementById(
        "blocoTamanhos"
    );


const blocoCores =
    document.getElementById(
        "blocoCores"
    );


const descricaoProduto =
    document.getElementById(
        "descricaoProduto"
    );


const btnDiminuirQuantidade =
    document.getElementById(
        "btnDiminuirQuantidade"
    );


const btnAumentarQuantidade =
    document.getElementById(
        "btnAumentarQuantidade"
    );


const quantidadeSelecionada =
    document.getElementById(
        "quantidadeSelecionada"
    );


const btnAdicionarCarrinho =
    document.getElementById(
        "btnAdicionarCarrinho"
    );


const mensagemCarrinho =
    document.getElementById(
        "mensagemCarrinho"
    );


/* =====================================================
   VARIÁVEIS
===================================================== */

let tamanhoSelecionado = "";

let corSelecionada = "";

let quantidade = 1;

let produtoSelecionado = null;


/* =====================================================
   FORMATAR PREÇO
===================================================== */

function formatarPreco(valor) {

    return Number(valor).toLocaleString(
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

function produtoTemPromocao(produto) {

    if (!produto) {
        return false;
    }


    const precoOriginal =
        Number(
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

        precoPromocional <
            precoOriginal

    );

}


/* =====================================================
   OBTER PREÇO QUE SERÁ COBRADO
===================================================== */

function obterPrecoFinal(produto) {

    if (
        produtoTemPromocao(
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
   RENDERIZAR PREÇO
===================================================== */

function renderizarPreco() {

    if (
        !produtoSelecionado ||
        !precoProduto
    ) {

        return;

    }


    /*
       PRODUTO EM PROMOÇÃO
    */

    if (
        produtoTemPromocao(
            produtoSelecionado
        )
    ) {

        precoProduto.innerHTML = `

            <span class="preco-detalhe-promocao">

                <span class="preco-detalhe-original">

                    ${formatarPreco(
                        produtoSelecionado.preco
                    )}

                </span>


                <span class="preco-detalhe-promocional">

                    ${formatarPreco(
                        produtoSelecionado.precoPromocional
                    )}

                </span>

            </span>

        `;

        return;

    }


    /*
       PRODUTO SEM PROMOÇÃO
    */

    precoProduto.innerHTML = `

        <span class="preco-detalhe-promocional">

            ${formatarPreco(
                produtoSelecionado.preco
            )}

        </span>

    `;

}


/* =====================================================
   PRODUTO NÃO ENCONTRADO
===================================================== */

function mostrarProdutoNaoEncontrado() {

    const detalheProduto =
        document.querySelector(
            ".detalhe-produto"
        );


    if (!detalheProduto) {

        return;

    }


    detalheProduto.innerHTML = `

        <div
            class="sem-resultados"
            style="display:block;"
        >

            <h3>
                Produto não encontrado
            </h3>

            <p>
                O produto selecionado
                não está disponível.
            </p>

        </div>

    `;

}


/* =====================================================
   GALERIA DE FOTOS
===================================================== */

function renderizarGaleria() {

    miniaturasProduto.innerHTML =
        "";


    if (

        !Array.isArray(
            produtoSelecionado.imagens
        )

        ||

        produtoSelecionado.imagens
            .length === 0

    ) {

        imagemProduto.removeAttribute(
            "src"
        );


        imagemProduto.alt =
            produtoSelecionado.nome;


        return;

    }


    /* FOTO PRINCIPAL */

    imagemProduto.src =
        produtoSelecionado.imagens[0];


    imagemProduto.alt =
        produtoSelecionado.nome;


    /* MINIATURAS */

    produtoSelecionado.imagens.forEach(
        (imagem, indice) => {

            const botaoMiniatura =
                document.createElement(
                    "button"
                );


            botaoMiniatura.type =
                "button";


            botaoMiniatura.classList.add(
                "miniatura"
            );


            if (
                indice === 0
            ) {

                botaoMiniatura.classList.add(
                    "ativa"
                );

            }


            botaoMiniatura.innerHTML = `

                <img
                    src="${imagem}"
                    alt="${produtoSelecionado.nome}"
                >

            `;


            botaoMiniatura.addEventListener(
                "click",
                () => {


                    /* MUDA FOTO PRINCIPAL */

                    imagemProduto.src =
                        imagem;


                    /* REMOVE SELEÇÃO */

                    document
                        .querySelectorAll(
                            ".miniatura"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "ativa"
                                );

                            }
                        );


                    /* MARCA MINIATURA */

                    botaoMiniatura.classList.add(
                        "ativa"
                    );

                }
            );


            miniaturasProduto.appendChild(
                botaoMiniatura
            );

        }
    );

}


/* =====================================================
   TAMANHOS
===================================================== */

function renderizarTamanhos() {

    tamanhosProduto.innerHTML =
        "";


    tamanhoSelecionado =
        "";


    if (

        !Array.isArray(
            produtoSelecionado.tamanhos
        )

        ||

        produtoSelecionado.tamanhos
            .length === 0

    ) {

        blocoTamanhos.style.display =
            "none";


        return;

    }


    blocoTamanhos.style.display =
        "block";


    produtoSelecionado.tamanhos.forEach(
        tamanho => {

            const botao =
                document.createElement(
                    "button"
                );


            botao.type =
                "button";


            botao.textContent =
                tamanho;


            botao.addEventListener(
                "click",
                () => {


                    tamanhosProduto
                        .querySelectorAll(
                            "button"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "selecionado"
                                );

                            }
                        );


                    botao.classList.add(
                        "selecionado"
                    );


                    tamanhoSelecionado =
                        tamanho;

                }
            );


            tamanhosProduto.appendChild(
                botao
            );

        }
    );

}


/* =====================================================
   CORES
===================================================== */

function renderizarCores() {

    coresProduto.innerHTML =
        "";


    corSelecionada =
        "";


    if (

        !Array.isArray(
            produtoSelecionado.cores
        )

        ||

        produtoSelecionado.cores
            .length === 0

    ) {

        blocoCores.style.display =
            "none";


        return;

    }


    blocoCores.style.display =
        "block";


    produtoSelecionado.cores.forEach(
        cor => {

            const botao =
                document.createElement(
                    "button"
                );


            botao.type =
                "button";


            botao.textContent =
                cor;


            botao.addEventListener(
                "click",
                () => {


                    coresProduto
                        .querySelectorAll(
                            "button"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "selecionado"
                                );

                            }
                        );


                    botao.classList.add(
                        "selecionado"
                    );


                    corSelecionada =
                        cor;

                }
            );


            coresProduto.appendChild(
                botao
            );

        }
    );

}


/* =====================================================
   QUANTIDADE
===================================================== */

function atualizarQuantidade() {

    quantidadeSelecionada.textContent =
        quantidade;

}


/* DIMINUIR */

btnDiminuirQuantidade.addEventListener(
    "click",
    () => {

        if (
            quantidade > 1
        ) {

            quantidade--;


            atualizarQuantidade();

        }

    }
);


/* AUMENTAR */

btnAumentarQuantidade.addEventListener(
    "click",
    () => {

        quantidade++;


        atualizarQuantidade();

    }
);


/* =====================================================
   MOSTRAR MENSAGEM
===================================================== */

let temporizadorMensagem =
    null;


function mostrarMensagemCarrinho() {

    if (!mensagemCarrinho) {

        return;

    }


    mensagemCarrinho.classList.add(
        "visivel"
    );


    if (
        temporizadorMensagem
    ) {

        clearTimeout(
            temporizadorMensagem
        );

    }


    temporizadorMensagem =
        setTimeout(
            () => {

                mensagemCarrinho
                    .classList
                    .remove(
                        "visivel"
                    );

            },
            2500
        );

}


/* =====================================================
   VALIDAR SELEÇÕES
===================================================== */

function validarSelecoes() {

    const possuiTamanhos =

        Array.isArray(
            produtoSelecionado.tamanhos
        )

        &&

        produtoSelecionado.tamanhos
            .length > 0;


    const possuiCores =

        Array.isArray(
            produtoSelecionado.cores
        )

        &&

        produtoSelecionado.cores
            .length > 0;


    /* TAMANHO */

    if (
        possuiTamanhos &&
        !tamanhoSelecionado
    ) {

        alert(
            "Por favor, selecione um tamanho."
        );


        return false;

    }


    /* COR */

    if (
        possuiCores &&
        !corSelecionada
    ) {

        alert(
            "Por favor, selecione uma cor."
        );


        return false;

    }


    return true;

}


/* =====================================================
   ADICIONAR AO CARRINHO
===================================================== */

function adicionarProdutoAoCarrinho() {

    if (
        !produtoSelecionado
    ) {

        return;

    }


    if (
        !validarSelecoes()
    ) {

        return;

    }


    if (

        !window.NovaEraCarrinho

        ||

        typeof window
            .NovaEraCarrinho
            .adicionar !==
            "function"

    ) {

        console.error(
            "O sistema de carrinho não foi carregado."
        );


        alert(
            "Não foi possível adicionar o produto ao carrinho."
        );


        return;

    }


    /* =================================================
       PREÇO FINAL
    ================================================= */

    const precoFinal =
        obterPrecoFinal(
            produtoSelecionado
        );


    /*
       Criamos uma cópia do produto
       especificamente para o carrinho.

       O campo "preco" passa a ter
       o valor que realmente será cobrado.

       Também mantemos o preço original
       para futuras melhorias.
    */

    const produtoParaCarrinho = {

        ...produtoSelecionado,

        precoOriginal:
            Number(
                produtoSelecionado.preco
            ),

        preco:
            precoFinal,

        precoPromocional:
            produtoTemPromocao(
                produtoSelecionado
            )
                ? Number(
                    produtoSelecionado
                        .precoPromocional
                )
                : null

    };


    const adicionado =
        window.NovaEraCarrinho
            .adicionar({

                produto:
                    produtoParaCarrinho,

                tamanho:
                    tamanhoSelecionado,

                cor:
                    corSelecionada,

                quantidade:
                    quantidade

            });


    if (
        !adicionado
    ) {

        return;

    }


    mostrarMensagemCarrinho();


    /*
       ABRIR O CARRINHO
       APÓS ADICIONAR
    */

    window
        .NovaEraCarrinho
        .abrir();

}


/* =====================================================
   BOTÃO ADICIONAR
===================================================== */

btnAdicionarCarrinho.addEventListener(
    "click",
    adicionarProdutoAoCarrinho
);


/* =====================================================
   CARREGAR PRODUTO
===================================================== */

async function iniciarPaginaProduto() {

    /*
       Aguarda os produtos
       carregarem do Supabase.
    */

    await produtosProntos;


    /* LOCALIZA PRODUTO */

    produtoSelecionado =
        produtos.find(
            produto =>
                produto.id ===
                idProduto
        );


    if (
        !produtoSelecionado
    ) {

        mostrarProdutoNaoEncontrado();


        return;

    }


    /* =================================================
       CATEGORIA
    ================================================= */

    categoriaProduto.textContent =
        produtoSelecionado
            .nomeCategoria;


    /* =================================================
       NOME
    ================================================= */

    nomeProduto.textContent =
        produtoSelecionado
            .nome;


    /* =================================================
       PREÇO
    ================================================= */

    renderizarPreco();


    /* =================================================
       DESCRIÇÃO
    ================================================= */

    descricaoProduto.textContent =

        produtoSelecionado
            .descricao

        ||

        "Sem descrição disponível.";


    /* =================================================
       GALERIA
    ================================================= */

    renderizarGaleria();


    /* =================================================
       TAMANHOS
    ================================================= */

    renderizarTamanhos();


    /* =================================================
       CORES
    ================================================= */

    renderizarCores();


    /* =================================================
       QUANTIDADE
    ================================================= */

    quantidade =
        1;


    atualizarQuantidade();

}


/* =====================================================
   INICIAR
===================================================== */

iniciarPaginaProduto();