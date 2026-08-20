const campoPesquisa =
        document.getElementById("campoPesquisa");

    const botoesCategoria =
        document.querySelectorAll(".categoria");

    const gradeProdutos =
        document.getElementById("gradeProdutos");

    const quantidadeProdutos =
        document.getElementById("quantidadeProdutos");

    const semResultados =
        document.getElementById("semResultados");

    const tituloProdutos =
        document.querySelector(
            ".secao-produtos .titulo-secao h2"
        );


    /* =====================================================
       FILTROS
    ===================================================== */

    const filtroTamanhoContainer =
        document.getElementById("filtroTamanhoContainer");

    const btnFiltroTamanho =
        document.getElementById("btnFiltroTamanho");

    const textoFiltroTamanho =
        document.getElementById("textoFiltroTamanho");

    const menuFiltroTamanho =
        document.getElementById("menuFiltroTamanho");

    const filtroCor =
        document.getElementById("filtroCor");

    const btnLimparFiltros =
        document.getElementById("btnLimparFiltros");


    let categoriaSelecionada =
        "todos";

    let tamanhoSelecionado =
        "todos";

    let corSelecionada =
        "todas";


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
       NORMALIZAR TEXTO
    ===================================================== */

    function normalizarTexto(texto) {

        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();

    }


    /* =====================================================
       VERIFICAR SE PRODUTO ESTÁ EM PROMOÇÃO
    ===================================================== */

    function produtoTemPromocao(produto) {

        const precoOriginal =
            Number(produto.preco);

        const precoPromocional =
            Number(produto.precoPromocional);


        return (
            produto.precoPromocional !== null &&
            produto.precoPromocional !== undefined &&
            produto.precoPromocional !== "" &&
            !Number.isNaN(precoPromocional) &&
            precoPromocional > 0 &&
            precoPromocional < precoOriginal
        );

    }


    /* =====================================================
       MONTAR PREÇO DO CARD
    ===================================================== */

    function montarPrecoProduto(produto) {

        if (produtoTemPromocao(produto)) {

            return `

                <div class="precos-produto">

                    <span class="preco-original">
                        ${formatarPreco(produto.preco)}
                    </span>

                    <span class="preco-promocional">
                        ${formatarPreco(produto.precoPromocional)}
                    </span>

                </div>

            `;

        }


        return `

            <div class="precos-produto">

                <span class="preco-normal">
                    ${formatarPreco(produto.preco)}
                </span>

            </div>

        `;

    }


    /* =====================================================
       CRIAR CARD DO PRODUTO
    ===================================================== */

    function criarCardProduto(produto) {

        const artigo =
            document.createElement("article");


        artigo.classList.add(
            "produto"
        );


        const imagemPrincipal =
            Array.isArray(produto.imagens) &&
            produto.imagens.length > 0
                ? produto.imagens[0]
                : "";


        artigo.innerHTML = `

            <div class="produto-imagem">

                ${
                    imagemPrincipal
                        ? `
                            <img
                                src="${imagemPrincipal}"
                                alt="${produto.nome}"
                                loading="lazy"
                            >
                          `
                        : ""
                }

            </div>


            <div class="produto-informacoes">

                <span class="produto-categoria">
                    ${produto.nomeCategoria}
                </span>


                <h3>
                    ${produto.nome}
                </h3>


                ${montarPrecoProduto(produto)}


                <button
                    type="button"
                    class="ver-produto"
                    data-id="${produto.id}"
                >
                    Ver produto
                </button>

            </div>

        `;


        gradeProdutos.appendChild(
            artigo
        );

    }


    /* =====================================================
       ATUALIZAR QUANTIDADE
    ===================================================== */

    function atualizarQuantidade(
        quantidade
    ) {

        quantidadeProdutos.textContent =
            quantidade === 1
                ? "1 produto"
                : `${quantidade} produtos`;


        semResultados.style.display =
            quantidade === 0
                ? "block"
                : "none";

    }


    /* =====================================================
       RENDERIZAR PRODUTOS
    ===================================================== */

    function renderizarProdutos(
        listaProdutos
    ) {

        gradeProdutos.innerHTML =
            "";


        listaProdutos.forEach(
            produto => {

                criarCardProduto(
                    produto
                );

            }
        );


        atualizarQuantidade(
            listaProdutos.length
        );

    }


    /* =====================================================
       FILTRO DE TAMANHO POR CATEGORIA
    ===================================================== */

    function carregarFiltrosTamanho() {

        if (
            !menuFiltroTamanho ||
            !btnFiltroTamanho ||
            !textoFiltroTamanho
        ) {
            return;
        }


        const tamanhosLetras = [
            "P",
            "M",
            "G",
            "GG",
            "G1",
            "G2"
        ];


        const listaTamanhosNumericos = [
            "40",
            "42",
            "44",
            "46",
            "48",
            "50"
        ];


        menuFiltroTamanho.innerHTML = "";


        function criarBotaoTamanho(
            tamanho
        ) {

            const botao =
                document.createElement(
                    "button"
                );


            botao.type =
                "button";


            botao.className =
                "opcao-tamanho";


            botao.dataset.tamanho =
                tamanho;


            botao.textContent =
                tamanho;


            if (
                tamanhoSelecionado === tamanho
            ) {

                botao.classList.add(
                    "ativo"
                );

            }


            botao.addEventListener(
                "click",
                () => {

                    tamanhoSelecionado =
                        tamanho;


                    textoFiltroTamanho.textContent =
                        `Tamanho: ${tamanho}`;


                    menuFiltroTamanho.hidden =
                        true;


                    btnFiltroTamanho.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    filtrarProdutos();

                }
            );


            return botao;

        }


        function criarGrupoTamanhos(
            titulo,
            subtitulo,
            tamanhos
        ) {

            if (
                !Array.isArray(tamanhos) ||
                tamanhos.length === 0
            ) {
                return;
            }


            const grupo =
                document.createElement(
                    "div"
                );


            grupo.className =
                "grupo-opcoes-tamanho";


            const cabecalho =
                document.createElement(
                    "div"
                );


            cabecalho.className =
                "cabecalho-opcoes-tamanho";


            cabecalho.innerHTML = `

                <strong>
                    ${titulo}
                </strong>

                ${
                    subtitulo
                        ? `
                            <span>
                                ${subtitulo}
                            </span>
                          `
                        : ""
                }

            `;


            const opcoes =
                document.createElement(
                    "div"
                );


            opcoes.className =
                "lista-opcoes-tamanho";


            tamanhos.forEach(
                tamanho => {

                    opcoes.appendChild(
                        criarBotaoTamanho(
                            tamanho
                        )
                    );

                }
            );


            grupo.appendChild(
                cabecalho
            );


            grupo.appendChild(
                opcoes
            );


            menuFiltroTamanho.appendChild(
                grupo
            );

        }


        const botaoTodos =
            document.createElement(
                "button"
            );


        botaoTodos.type =
            "button";


        botaoTodos.className =
            "opcao-tamanho-todos";


        botaoTodos.textContent =
            "Todos os tamanhos";


        if (
            tamanhoSelecionado === "todos"
        ) {

            botaoTodos.classList.add(
                "ativo"
            );

        }


        botaoTodos.addEventListener(
            "click",
            () => {

                tamanhoSelecionado =
                    "todos";


                textoFiltroTamanho.textContent =
                    "Todos os tamanhos";


                menuFiltroTamanho.hidden =
                    true;


                btnFiltroTamanho.setAttribute(
                    "aria-expanded",
                    "false"
                );


                filtrarProdutos();

            }
        );


        menuFiltroTamanho.appendChild(
            botaoTodos
        );


        if (
            categoriaSelecionada === "todos"
        ) {

            criarGrupoTamanhos(
                "Tamanhos",
                "Camisetas, regatas e casacos",
                tamanhosLetras
            );


            criarGrupoTamanhos(
                "Numeração",
                "Bermudas",
                listaTamanhosNumericos
            );

        }


        else if (
            categoriaSelecionada === "bermuda"
        ) {

            criarGrupoTamanhos(
                "Numeração",
                "Bermudas",
                listaTamanhosNumericos
            );

        }


        else {

            criarGrupoTamanhos(
                "Tamanhos",
                "",
                tamanhosLetras
            );

        }


        tamanhoSelecionado =
            "todos";


        textoFiltroTamanho.textContent =
            "Todos os tamanhos";


        menuFiltroTamanho.hidden =
            true;


        btnFiltroTamanho.setAttribute(
            "aria-expanded",
            "false"
        );

    }

    /* =====================================================
       CARREGAR CORES
    ===================================================== */

    function carregarFiltrosCor() {

        if (!filtroCor) {
            return;
        }


        const cores =
            new Set();


        produtos.forEach(
            produto => {

                if (
                    Array.isArray(
                        produto.cores
                    )
                ) {

                    produto.cores.forEach(
                        cor => {

                            if (cor) {

                                cores.add(
                                    cor.trim()
                                );

                            }

                        }
                    );

                }

            }
        );


        const listaCores =
            Array.from(cores)
                .sort(
                    (a, b) =>
                        a.localeCompare(
                            b,
                            "pt-BR"
                        )
                );


        filtroCor.innerHTML = `

            <option value="todas">
                Todas as cores
            </option>

        `;


        listaCores.forEach(
            cor => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    cor;


                option.textContent =
                    cor;


                filtroCor.appendChild(
                    option
                );

            }
        );

    }


    /* =====================================================
       CARREGAR FILTROS
    ===================================================== */

    function carregarFiltros() {

        carregarFiltrosTamanho();

        carregarFiltrosCor();

    }


    /* =====================================================
       FILTRAR PRODUTOS
    ===================================================== */

    function filtrarProdutos() {

        const textoPesquisa =
            normalizarTexto(
                campoPesquisa.value
            );


        const produtosFiltrados =
            produtos.filter(
                produto => {


                    /* =====================================
                       PESQUISA
                    ===================================== */

                    const nomeProduto =
                        normalizarTexto(
                            produto.nome
                        );


                    const categoriaProduto =
                        normalizarTexto(
                            produto.nomeCategoria
                        );


                    const correspondePesquisa =
                        textoPesquisa === ""
                        ||
                        nomeProduto.includes(
                            textoPesquisa
                        )
                        ||
                        categoriaProduto.includes(
                            textoPesquisa
                        );


                    /* =====================================
                       CATEGORIA
                    ===================================== */

                    const correspondeCategoria =
                        categoriaSelecionada ===
                            "todos"
                        ||
                        produto.categoria ===
                            categoriaSelecionada;


                    /* =====================================
                       TAMANHO
                    ===================================== */

                    const correspondeTamanho =
                        tamanhoSelecionado ===
                            "todos"
                        ||
                        (
                            Array.isArray(
                                produto.tamanhos
                            )
                            &&
                            produto.tamanhos.some(
                                tamanho =>
                                    normalizarTexto(
                                        tamanho
                                    )
                                    ===
                                    normalizarTexto(
                                        tamanhoSelecionado
                                    )
                            )
                        );


                    /* =====================================
                       COR
                    ===================================== */

                    const correspondeCor =
                        corSelecionada ===
                            "todas"
                        ||
                        (
                            Array.isArray(
                                produto.cores
                            )
                            &&
                            produto.cores.some(
                                cor =>
                                    normalizarTexto(
                                        cor
                                    )
                                    ===
                                    normalizarTexto(
                                        corSelecionada
                                    )
                            )
                        );


                    return (
                        correspondePesquisa
                        &&
                        correspondeCategoria
                        &&
                        correspondeTamanho
                        &&
                        correspondeCor
                    );

                }
            );


        renderizarProdutos(
            produtosFiltrados
        );


        atualizarMensagemSemResultados(
            produtosFiltrados.length
        );

    }


    /* =====================================================
       MENSAGEM QUANDO NÃO ENCONTRAR PRODUTOS
    ===================================================== */

    function atualizarMensagemSemResultados(
        quantidade
    ) {

        if (
            quantidade > 0 ||
            !semResultados
        ) {

            return;

        }


        let titulo =
            "Nenhum produto encontrado";

        let mensagem =
            "Tente selecionar outros filtros.";


        /* TAMANHO + COR */

        if (
            tamanhoSelecionado !== "todos" &&
            corSelecionada !== "todas"
        ) {

            titulo =
                "Nenhum produto disponível";

            mensagem =
                `Não encontramos produtos no tamanho ${tamanhoSelecionado} e na cor ${corSelecionada}.`;

        }


        /* SOMENTE TAMANHO */

        else if (
            tamanhoSelecionado !== "todos"
        ) {

            titulo =
                "Nenhum produto disponível nesse tamanho";

            mensagem =
                `No momento não temos produtos disponíveis no tamanho ${tamanhoSelecionado}.`;

        }


        /* SOMENTE COR */

        else if (
            corSelecionada !== "todas"
        ) {

            titulo =
                "Nenhum produto disponível nessa cor";

            mensagem =
                `No momento não temos produtos disponíveis na cor ${corSelecionada}.`;

        }


        semResultados.innerHTML = `

            <h3>
                ${titulo}
            </h3>

            <p>
                ${mensagem}
            </p>

        `;

    }


    /* =====================================================
       PESQUISA
    ===================================================== */

    campoPesquisa.addEventListener(
        "input",
        filtrarProdutos
    );


    /* =====================================================
       CATEGORIAS
    ===================================================== */

    botoesCategoria.forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {


                    botoesCategoria.forEach(
                        item => {

                            item.classList.remove(
                                "ativa"
                            );

                        }
                    );


                    botao.classList.add(
                        "ativa"
                    );


                    categoriaSelecionada =
                        botao.dataset.categoria;


                    carregarFiltrosTamanho();


                    filtrarProdutos();

                }
            );

        }
    );


    /* =====================================================
       FILTRO DE TAMANHO
    ===================================================== */

    if (
        btnFiltroTamanho &&
        menuFiltroTamanho
    ) {

        btnFiltroTamanho.addEventListener(
            "click",
            evento => {

                evento.stopPropagation();


                const estaAberto =
                    !menuFiltroTamanho.hidden;


                menuFiltroTamanho.hidden =
                    estaAberto;


                btnFiltroTamanho.setAttribute(
                    "aria-expanded",
                    String(!estaAberto)
                );

            }
        );


        menuFiltroTamanho.addEventListener(
            "click",
            evento => {

                evento.stopPropagation();

            }
        );


        document.addEventListener(
            "click",
            () => {

                menuFiltroTamanho.hidden =
                    true;


                btnFiltroTamanho.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    }

    /* =====================================================
       FILTRO DE COR
    ===================================================== */

    if (filtroCor) {

        filtroCor.addEventListener(
            "change",
            () => {

                corSelecionada =
                    filtroCor.value;


                filtrarProdutos();

            }
        );

    }


    /* =====================================================
       LIMPAR FILTROS
    ===================================================== */

    if (btnLimparFiltros) {

        btnLimparFiltros.addEventListener(
            "click",
            () => {


                /* PESQUISA */

                campoPesquisa.value =
                    "";


                /* TAMANHO */

                tamanhoSelecionado =
                    "todos";


                if (textoFiltroTamanho) {

                    textoFiltroTamanho.textContent =
                        "Todos os tamanhos";

                }


                if (menuFiltroTamanho) {

                    menuFiltroTamanho.hidden =
                        true;

                }


                if (btnFiltroTamanho) {

                    btnFiltroTamanho.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }


                /* COR */

                corSelecionada =
                    "todas";


                if (filtroCor) {

                    filtroCor.value =
                        "todas";

                }


                /* CATEGORIA */

                categoriaSelecionada =
                    "todos";


                botoesCategoria.forEach(
                    botao => {

                        botao.classList.remove(
                            "ativa"
                        );


                        if (
                            botao.dataset
                                .categoria ===
                                "todos"
                        ) {

                            botao.classList.add(
                                "ativa"
                            );

                        }

                    }
                );


                /* RECARREGAR TAMANHOS */

                carregarFiltrosTamanho();


                /* MOSTRAR TODOS */

                filtrarProdutos();

            }
        );

    }


    /* =====================================================
       ABRIR PRODUTO
    ===================================================== */

    gradeProdutos.addEventListener(
        "click",
        evento => {

            const botao =
                evento.target.closest(
                    ".ver-produto"
                );


            if (!botao) {

                return;

            }


            const idProduto =
                botao.dataset.id;


            window.location.href =
                `produto.html?id=${idProduto}`;

        }
    );


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    async function iniciarCatalogo() {

        tituloProdutos.textContent =
            "Produtos disponíveis";


        quantidadeProdutos.textContent =
            "Carregando...";


        /*
           Aguarda os produtos
           carregarem do Supabase.
        */

        await produtosProntos;


        /*
           Monta os filtros.
        */

        carregarFiltros();


        /*
           Exibe todos os produtos.
        */

        renderizarProdutos(
            produtos
        );

    }


    /* =====================================================
       INICIAR
    ===================================================== */

    iniciarCatalogo();