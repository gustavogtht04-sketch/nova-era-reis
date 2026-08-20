/* =====================================================
   ELEMENTOS DA PÁGINA
===================================================== */

const produtosAdmin = document.getElementById("produtosAdmin");
const carregando = document.getElementById("carregando");
const btnNovoProduto = document.getElementById("btnNovoProduto");

const areaFormulario = document.getElementById("areaFormulario");
const formProduto = document.getElementById("formProduto");
const tituloFormulario = document.getElementById("tituloFormulario");

const produtoId = document.getElementById("produtoId");
const campoNome = document.getElementById("nome");
const campoCategoria = document.getElementById("categoria");

const campoPreco =
    document.getElementById("preco");

const campoPrecoPromocional =
    document.getElementById("precoPromocional");

const campoDescricao = document.getElementById("descricao");
const campoTamanhos = document.getElementById("tamanhos");

const ajudaTamanhos =
    document.getElementById("ajudaTamanhos");
const campoCores = document.getElementById("cores");
const campoDisponivel = document.getElementById("disponivel");

const btnFecharFormulario = document.getElementById("btnFecharFormulario");
const btnCancelar = document.getElementById("btnCancelar");
const btnSalvarProduto = document.getElementById("btnSalvarProduto");


/* =====================================================
   ELEMENTOS DAS FOTOS
===================================================== */

const campoFotos = document.getElementById("fotosProduto");

const quantidadeFotosSelecionadas =
    document.getElementById("quantidadeFotosSelecionadas");

const previewFotos =
    document.getElementById("previewFotos");

const areaFotosAtuais =
    document.getElementById("areaFotosAtuais");

const fotosAtuaisElemento =
    document.getElementById("fotosAtuais");

const mensagemFormulario =
    document.getElementById("mensagemFormulario");


/* =====================================================
   CONFIGURAÇÕES
===================================================== */

const BUCKET_PRODUTOS = "produtos";

let produtosCarregados = [];

let fotosNovasSelecionadas = [];

let imagensAtuais = [];

let imagensRemovidas = [];

let urlsTemporariasPreview = [];

let salvandoProduto = false;


/* =====================================================
   LOGIN
===================================================== */

const telaLogin = document.createElement("div");

telaLogin.className = "tela-login";

telaLogin.innerHTML = `

    <div class="caixa-login">

        <h2>Nova Era Reis</h2>

        <p>Painel Administrativo</p>

        <form id="formLogin">

            <label>E-mail</label>

            <input
                type="email"
                id="emailLogin"
                placeholder="Digite seu e-mail"
                required
            >

            <label>Senha</label>

            <input
                type="password"
                id="senhaLogin"
                placeholder="Digite sua senha"
                required
            >

            <button
                type="submit"
                class="btn-principal"
            >
                Entrar
            </button>

            <div
                id="erroLogin"
                class="erro-login"
            ></div>

        </form>

    </div>

`;

document.body.appendChild(telaLogin);

const formLogin =
    document.getElementById("formLogin");

const erroLogin =
    document.getElementById("erroLogin");


/* =====================================================
   BOTÃO SAIR
===================================================== */

const btnSair =
    document.createElement("button");

btnSair.textContent = "Sair";
btnSair.className = "btn-sair";
btnSair.style.display = "none";

const topoAcoes =
    document.querySelector(".topo-acoes");

if (topoAcoes) {

    topoAcoes.appendChild(btnSair);

} else {

    console.error(
        "Elemento .topo-acoes não encontrado."
    );

}


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

    if (
        produto.preco_promocional === null ||
        produto.preco_promocional === undefined ||
        produto.preco_promocional === ""
    ) {

        return false;

    }


    const precoOriginal =
        Number(produto.preco);

    const precoPromocional =
        Number(produto.preco_promocional);


    return (
        !Number.isNaN(precoPromocional) &&
        precoPromocional > 0 &&
        precoPromocional < precoOriginal
    );

}


/* =====================================================
   NOME DA CATEGORIA
===================================================== */

function obterNomeCategoria(categoria) {

    const categorias = {
        camiseta: "Camiseta",
        regata: "Regata",
        casaco: "Casaco",
        bermuda: "Bermuda"
    };

    return categorias[categoria] || categoria || "";

}


/* =====================================================
   MENSAGEM DO FORMULÁRIO
===================================================== */

function mostrarMensagem(mensagem, tipo = "") {

    if (!mensagemFormulario) {
        return;
    }

    mensagemFormulario.textContent = mensagem;

    mensagemFormulario.className =
        "mensagem-formulario";

    if (tipo) {
        mensagemFormulario.classList.add(tipo);
    }

}


function limparMensagem() {

    mostrarMensagem("");

}


/* =====================================================
   CARREGAR PRODUTOS
===================================================== */

async function carregarProdutos() {

    carregando.style.display = "block";

    carregando.textContent =
        "Carregando produtos...";

    produtosAdmin.innerHTML = "";


    const { data, error } =
        await supabaseClient
            .from("produtos")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Erro ao carregar produtos:",
            error
        );

        carregando.textContent =
            "Não foi possível carregar os produtos.";

        return;

    }


    produtosCarregados = data || [];

    carregando.style.display = "none";


    if (produtosCarregados.length === 0) {

        produtosAdmin.innerHTML = `

            <div class="lista-vazia">

                <h3>
                    Nenhum produto cadastrado
                </h3>

                <p>
                    Clique em “Novo produto”
                    para começar.
                </p>

            </div>

        `;

        return;

    }


    produtosCarregados.forEach(
        produto => criarProdutoNaLista(produto)
    );

}


/* =====================================================
   CRIAR PRODUTO NA LISTA
===================================================== */

function criarProdutoNaLista(produto) {

    const item =
        document.createElement("div");

    item.className = "produto-admin";


    let imagem = "";

    if (
        Array.isArray(produto.imagens) &&
        produto.imagens.length > 0
    ) {

        imagem = produto.imagens[0];

    }


    const status =
        produto.disponivel
            ? `
                <span class="status-disponivel">
                    Disponível
                </span>
              `
            : `
                <span class="status-indisponivel">
                    Indisponível
                </span>
              `;


    const precoExibido =
        produtoTemPromocao(produto)
            ? `
                <div class="preco-admin-promocao">

                    <span
                        style="
                            text-decoration: line-through;
                            color: #888888;
                            margin-right: 7px;
                        "
                    >
                        ${formatarPreco(produto.preco)}
                    </span>

                    <strong>
                        ${formatarPreco(produto.preco_promocional)}
                    </strong>

                </div>
              `
            : `
                <strong>
                    ${formatarPreco(produto.preco)}
                </strong>
              `;


    item.innerHTML = `

        <div>

            ${
                imagem
                    ? `
                        <img
                            src="${imagem}"
                            alt="${produto.nome}"
                        >
                      `
                    : `
                        <div class="sem-foto-admin">
                            Sem foto
                        </div>
                      `
            }

        </div>


        <div class="produto-admin-info">

            <h3>
                ${produto.nome}
            </h3>

            <p>
                ${obterNomeCategoria(produto.categoria)}
            </p>

            <p>
                ${precoExibido}
            </p>

            <p>
                ${status}
            </p>

        </div>


        <div class="produto-admin-acoes">

            <button
                class="btn-editar"
                data-id="${produto.id}"
            >
                Editar
            </button>


            <button
                class="btn-status"
                data-id="${produto.id}"
                data-disponivel="${produto.disponivel}"
            >
                ${
                    produto.disponivel
                        ? "Desativar"
                        : "Ativar"
                }
            </button>


            <button
                class="btn-excluir"
                data-id="${produto.id}"
            >
                Excluir
            </button>

        </div>

    `;


    produtosAdmin.appendChild(item);

}


/* =====================================================
   PREVIEW DAS FOTOS NOVAS
===================================================== */

function limparUrlsPreview() {

    urlsTemporariasPreview.forEach(url => {

        URL.revokeObjectURL(url);

    });

    urlsTemporariasPreview = [];

}


function renderizarFotosNovas() {

    limparUrlsPreview();

    previewFotos.innerHTML = "";


    if (fotosNovasSelecionadas.length === 0) {

        quantidadeFotosSelecionadas.textContent =
            "Nenhuma foto nova selecionada.";

        return;

    }


    quantidadeFotosSelecionadas.textContent =
        fotosNovasSelecionadas.length === 1
            ? "1 foto nova selecionada."
            : `${fotosNovasSelecionadas.length} fotos novas selecionadas.`;


    fotosNovasSelecionadas.forEach(
        (arquivo, indice) => {

            const url =
                URL.createObjectURL(arquivo);

            urlsTemporariasPreview.push(url);


            const item =
                document.createElement("div");

            item.className =
                "preview-foto-item";


            item.innerHTML = `

                <img
                    src="${url}"
                    alt="Prévia da foto"
                >

                <button
                    type="button"
                    class="btn-remover-foto btn-remover-foto-nova"
                    data-indice="${indice}"
                >
                    ×
                </button>

            `;


            previewFotos.appendChild(item);

        }
    );

}


/* =====================================================
   FOTOS ATUAIS DO PRODUTO
===================================================== */

function renderizarFotosAtuais() {

    fotosAtuaisElemento.innerHTML = "";


    if (imagensAtuais.length === 0) {

        areaFotosAtuais.classList.add(
            "oculto"
        );

        return;

    }


    areaFotosAtuais.classList.remove(
        "oculto"
    );


    imagensAtuais.forEach(
        (url, indice) => {

            const item =
                document.createElement("div");

            item.className =
                "preview-foto-item";


            item.innerHTML = `

                <img
                    src="${url}"
                    alt="Foto atual"
                >

                <button
                    type="button"
                    class="btn-remover-foto btn-remover-foto-atual"
                    data-indice="${indice}"
                >
                    ×
                </button>

            `;


            fotosAtuaisElemento.appendChild(item);

        }
    );

}


/* =====================================================
   SELECIONAR FOTOS
===================================================== */

campoFotos.addEventListener(
    "change",
    () => {

        const arquivos =
            Array.from(
                campoFotos.files || []
            );


        arquivos.forEach(arquivo => {

            if (
                !arquivo.type.startsWith("image/")
            ) {

                return;

            }


            const duplicado =
                fotosNovasSelecionadas.some(
                    foto =>
                        foto.name === arquivo.name &&
                        foto.size === arquivo.size &&
                        foto.lastModified === arquivo.lastModified
                );


            if (!duplicado) {

                fotosNovasSelecionadas.push(
                    arquivo
                );

            }

        });


        campoFotos.value = "";

        renderizarFotosNovas();

    }
);


/* =====================================================
   REMOVER FOTO NOVA
===================================================== */

previewFotos.addEventListener(
    "click",
    evento => {

        const botao =
            evento.target.closest(
                ".btn-remover-foto-nova"
            );


        if (!botao) {
            return;
        }


        const indice =
            Number(botao.dataset.indice);


        fotosNovasSelecionadas.splice(
            indice,
            1
        );


        renderizarFotosNovas();

    }
);


/* =====================================================
   REMOVER FOTO ATUAL
===================================================== */

fotosAtuaisElemento.addEventListener(
    "click",
    evento => {

        const botao =
            evento.target.closest(
                ".btn-remover-foto-atual"
            );


        if (!botao) {
            return;
        }


        const indice =
            Number(botao.dataset.indice);


        const url =
            imagensAtuais[indice];


        if (url) {

            imagensRemovidas.push(url);

        }


        imagensAtuais.splice(
            indice,
            1
        );


        renderizarFotosAtuais();

    }
);


/* =====================================================
   GERAR NOME ÚNICO PARA FOTO
===================================================== */

function gerarNomeArquivo(arquivo) {

    const extensao =
        arquivo.name
            .split(".")
            .pop()
            .toLowerCase();

    const identificador =
        `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 12)}`;

    return `${identificador}.${extensao}`;

}


/* =====================================================
   UPLOAD DAS FOTOS
===================================================== */

async function enviarFotos() {

    const urls = [];

    const caminhosEnviados = [];


    for (
        const arquivo
        of fotosNovasSelecionadas
    ) {

        const nomeArquivo =
            gerarNomeArquivo(arquivo);


        const caminho =
            `catalogo/${nomeArquivo}`;


        const { data, error } =
            await supabaseClient
                .storage
                .from(BUCKET_PRODUTOS)
                .upload(
                    caminho,
                    arquivo,
                    {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: arquivo.type
                    }
                );


        if (error) {

            console.error(
                "Erro no upload:",
                error
            );

            throw error;

        }


        caminhosEnviados.push(
            data.path
        );


        const { data: dadosUrl } =
            supabaseClient
                .storage
                .from(BUCKET_PRODUTOS)
                .getPublicUrl(data.path);


        urls.push(
            dadosUrl.publicUrl
        );

    }


    return {
        urls,
        caminhosEnviados
    };

}


/* =====================================================
   PEGAR CAMINHO DA FOTO NO STORAGE
===================================================== */

function obterCaminhoStorage(url) {

    try {

        const marcador =
            `/storage/v1/object/public/${BUCKET_PRODUTOS}/`;


        const urlObjeto =
            new URL(url);


        const posicao =
            urlObjeto.pathname.indexOf(
                marcador
            );


        if (posicao === -1) {

            return null;

        }


        return decodeURIComponent(
            urlObjeto.pathname.substring(
                posicao + marcador.length
            )
        );

    }

    catch {

        return null;

    }

}


/* =====================================================
   EXCLUIR FOTOS REMOVIDAS
===================================================== */

async function excluirFotosDoStorage(
    listaUrls
) {

    const caminhos =
        listaUrls
            .map(obterCaminhoStorage)
            .filter(Boolean);


    if (caminhos.length === 0) {

        return;

    }


    const { error } =
        await supabaseClient
            .storage
            .from(BUCKET_PRODUTOS)
            .remove(caminhos);


    if (error) {

        console.warn(
            "Não foi possível excluir algumas fotos:",
            error
        );

    }

}


/* =====================================================
   LIMPAR FOTOS
===================================================== */

function limparEstadoFotos() {

    limparUrlsPreview();

    fotosNovasSelecionadas = [];

    imagensAtuais = [];

    imagensRemovidas = [];

    previewFotos.innerHTML = "";

    fotosAtuaisElemento.innerHTML = "";

    areaFotosAtuais.classList.add(
        "oculto"
    );

    quantidadeFotosSelecionadas.textContent =
        "Nenhuma foto nova selecionada.";

    campoFotos.value = "";

}


/* =====================================================
   ABRIR NOVO PRODUTO
===================================================== */

function abrirFormularioNovoProduto() {

    formProduto.reset();

    produtoId.value = "";

    campoPrecoPromocional.value = "";

    tituloFormulario.textContent =
        "Novo produto";

    campoDisponivel.checked = true;

    atualizarCampoTamanhos();

    limparEstadoFotos();

    limparMensagem();

    areaFormulario.classList.remove(
        "oculto"
    );

    campoNome.focus();

}


/* =====================================================
   FECHAR FORMULÁRIO
===================================================== */

function fecharFormulario() {

    if (salvandoProduto) {
        return;
    }

    areaFormulario.classList.add(
        "oculto"
    );

    formProduto.reset();

    produtoId.value = "";

    campoPrecoPromocional.value = "";

    limparEstadoFotos();

    limparMensagem();

}


/* =====================================================
   BOTÕES DO FORMULÁRIO
===================================================== */

btnNovoProduto.addEventListener(
    "click",
    abrirFormularioNovoProduto
);

btnFecharFormulario.addEventListener(
    "click",
    fecharFormulario
);

btnCancelar.addEventListener(
    "click",
    fecharFormulario
);


/* =====================================================
   TAMANHOS CONFORME A CATEGORIA
===================================================== */

function atualizarCampoTamanhos() {

    if (
        !campoCategoria ||
        !campoTamanhos
    ) {
        return;
    }


    const categoria =
        campoCategoria.value;


    /* =============================================
       BERMUDA = TAMANHOS NUMÉRICOS
    ============================================= */

    if (
        categoria === "bermuda"
    ) {

        campoTamanhos.placeholder =
            "Ex.: 40, 42, 44, 46, 48, 50";

        if (ajudaTamanhos) {

            ajudaTamanhos.textContent =
                "Para bermudas, use: 40, 42, 44, 46, 48 ou 50. Separe por vírgula.";

        }

        return;

    }


    /* =============================================
       DEMAIS CATEGORIAS = TAMANHOS POR LETRA
    ============================================= */

    campoTamanhos.placeholder =
        "Ex.: P, M, G, GG, G1, G2";

    if (ajudaTamanhos) {

        ajudaTamanhos.textContent =
            "Use: P, M, G, GG, G1 ou G2. Separe por vírgula.";

    }

}


/* =====================================================
   AO TROCAR A CATEGORIA
===================================================== */

campoCategoria.addEventListener(
    "change",
    () => {

        /* Limpa o tamanho anterior para evitar
           misturar letras com numeração */
        campoTamanhos.value = "";

        atualizarCampoTamanhos();

    }
);


/* =====================================================
   FORMATAR TAMANHOS DIGITADOS
===================================================== */

campoTamanhos.addEventListener(
    "input",
    () => {

        const categoria =
            campoCategoria.value;


        /* BERMUDA:
           permite somente números, vírgulas e espaços */
        if (
            categoria === "bermuda"
        ) {

            campoTamanhos.value =
                campoTamanhos.value.replace(
                    /[^0-9,\s]/g,
                    ""
                );

            return;

        }


        /* DEMAIS CATEGORIAS:
           mantém os tamanhos em maiúsculo */
        campoTamanhos.value =
            campoTamanhos.value.toUpperCase();

    }
);


/* =====================================================
   SALVAR PRODUTO
===================================================== */

formProduto.addEventListener(
    "submit",
    async evento => {

        evento.preventDefault();


        if (salvandoProduto) {

            return;

        }


        limparMensagem();


        const id =
            produtoId.value;


        const valorPrecoPromocional =
            campoPrecoPromocional.value.trim();


        /* =========================================
           VALIDAR TAMANHOS CONFORME A CATEGORIA
        ========================================= */

        const tamanhosDigitados =
            campoTamanhos.value
                .split(",")
                .map(
                    tamanho =>
                        tamanho.trim()
                )
                .filter(Boolean);


        const tamanhosPermitidosLetras = [
            "P",
            "M",
            "G",
            "GG",
            "G1",
            "G2"
        ];


        const tamanhosPermitidosBermuda = [
            "40",
            "42",
            "44",
            "46",
            "48",
            "50"
        ];


        if (
            campoCategoria.value === "bermuda"
        ) {

            const possuiTamanhoInvalido =
                tamanhosDigitados.some(
                    tamanho =>
                        !tamanhosPermitidosBermuda.includes(
                            tamanho
                        )
                );


            if (
                possuiTamanhoInvalido
            ) {

                mostrarMensagem(
                    "Para bermudas, use somente: 40, 42, 44, 46, 48 ou 50.",
                    "erro"
                );

                return;

            }

        }


        else {

            const possuiTamanhoInvalido =
                tamanhosDigitados.some(
                    tamanho =>
                        !tamanhosPermitidosLetras.includes(
                            tamanho.toUpperCase()
                        )
                );


            if (
                possuiTamanhoInvalido
            ) {

                mostrarMensagem(
                    "Use somente os tamanhos: P, M, G, GG, G1 ou G2.",
                    "erro"
                );

                return;

            }

        }


        const dadosProduto = {

            nome:
                campoNome.value.trim(),

            categoria:
                campoCategoria.value
                    .trim()
                    .toLowerCase(),

            preco:
                Number(
                    String(campoPreco.value)
                        .replace(",", ".")
                ),

            preco_promocional:
                valorPrecoPromocional !== ""
                    ? Number(
                        String(valorPrecoPromocional)
                            .replace(",", ".")
                    )
                    : null,

            descricao:
                campoDescricao.value.trim(),

            tamanhos:
                campoTamanhos.value
                    .trim()
                    .toUpperCase(),

            cores:
                campoCores.value.trim(),

            disponivel:
                campoDisponivel.checked

        };


        /* =========================================
           VALIDAR CAMPOS OBRIGATÓRIOS
        ========================================= */

        if (
            !dadosProduto.nome ||
            !dadosProduto.categoria ||
            Number.isNaN(dadosProduto.preco)
        ) {

            mostrarMensagem(
                "Preencha nome, categoria e preço corretamente.",
                "erro"
            );

            return;

        }


        /* =========================================
           VALIDAR PREÇO ORIGINAL
        ========================================= */

        if (
            dadosProduto.preco <= 0
        ) {

            mostrarMensagem(
                "O preço do produto deve ser maior que zero.",
                "erro"
            );

            return;

        }


        /* =========================================
           VALIDAR PREÇO PROMOCIONAL
        ========================================= */

        if (
            dadosProduto.preco_promocional !== null &&
            (
                Number.isNaN(
                    dadosProduto.preco_promocional
                ) ||
                dadosProduto.preco_promocional <= 0
            )
        ) {

            mostrarMensagem(
                "Informe um preço promocional válido ou deixe o campo vazio.",
                "erro"
            );

            return;

        }


        /*
           Se existir promoção,
           o valor promocional precisa
           ser menor que o preço original.
        */

        if (
            dadosProduto.preco_promocional !== null &&
            dadosProduto.preco_promocional >=
                dadosProduto.preco
        ) {

            mostrarMensagem(
                "O preço promocional deve ser menor que o preço original.",
                "erro"
            );

            return;

        }


        /* =========================================
           VALIDAR FOTOS
        ========================================= */

        const totalFotos =
            imagensAtuais.length +
            fotosNovasSelecionadas.length;


        if (totalFotos === 0) {

            mostrarMensagem(
                "Selecione pelo menos uma foto do produto.",
                "erro"
            );

            return;

        }


        salvandoProduto = true;

        btnSalvarProduto.disabled = true;

        btnSalvarProduto.textContent =
            fotosNovasSelecionadas.length > 0
                ? "Enviando fotos..."
                : "Salvando...";


        try {

            /* =========================================
               UPLOAD DAS FOTOS NOVAS
            ========================================= */

            const resultadoUpload =
                await enviarFotos();


            dadosProduto.imagens = [
                ...imagensAtuais,
                ...resultadoUpload.urls
            ];


            let resultado;


            /* =========================================
               EDITAR PRODUTO
            ========================================= */

            if (id) {

                resultado =
                    await supabaseClient
                        .from("produtos")
                        .update(
                            dadosProduto
                        )
                        .eq(
                            "id",
                            Number(id)
                        );

            }


            /* =========================================
               NOVO PRODUTO
            ========================================= */

            else {

                resultado =
                    await supabaseClient
                        .from("produtos")
                        .insert([
                            dadosProduto
                        ]);

            }


            /* =========================================
               ERRO NO BANCO
            ========================================= */

            if (resultado.error) {

                /*
                   Se o banco falhar depois do upload,
                   removemos as imagens recém-enviadas.
                */

                if (
                    resultadoUpload
                        .caminhosEnviados
                        .length > 0
                ) {

                    await supabaseClient
                        .storage
                        .from(BUCKET_PRODUTOS)
                        .remove(
                            resultadoUpload
                                .caminhosEnviados
                        );

                }


                throw resultado.error;

            }


            /* =========================================
               REMOVER FOTOS ANTIGAS
            ========================================= */

            if (
                imagensRemovidas.length > 0
            ) {

                await excluirFotosDoStorage(
                    imagensRemovidas
                );

            }


            salvandoProduto = false;

            btnSalvarProduto.disabled = false;

            btnSalvarProduto.textContent =
                "Salvar produto";


            fecharFormulario();


            await carregarProdutos();


            alert(
                id
                    ? "Produto atualizado com sucesso!"
                    : "Produto cadastrado com sucesso!"
            );

        }

        catch (erro) {

            console.error(
                "Erro ao salvar produto:",
                erro
            );


            salvandoProduto = false;

            btnSalvarProduto.disabled = false;

            btnSalvarProduto.textContent =
                "Salvar produto";


            mostrarMensagem(
                "Não foi possível salvar o produto. Verifique o Console para identificar o erro.",
                "erro"
            );

        }

    }
);


/* =====================================================
   EDITAR PRODUTO
===================================================== */

function editarProduto(id) {

    const produto =
        produtosCarregados.find(
            item =>
                item.id === Number(id)
        );


    if (!produto) {

        alert(
            "Produto não encontrado."
        );

        return;

    }


    formProduto.reset();

    limparEstadoFotos();

    limparMensagem();


    produtoId.value =
        produto.id;

    campoNome.value =
        produto.nome || "";

    campoCategoria.value =
        produto.categoria || "";

    atualizarCampoTamanhos();

    campoPreco.value =
        produto.preco ?? "";

    campoPrecoPromocional.value =
        produto.preco_promocional ?? "";

    campoDescricao.value =
        produto.descricao || "";

    campoTamanhos.value =
        String(
            produto.tamanhos || ""
        ).toUpperCase();

    campoCores.value =
        produto.cores || "";

    campoDisponivel.checked =
        produto.disponivel === true;


    imagensAtuais =
        Array.isArray(produto.imagens)
            ? [...produto.imagens]
            : [];


    renderizarFotosAtuais();

    renderizarFotosNovas();


    tituloFormulario.textContent =
        "Editar produto";


    areaFormulario.classList.remove(
        "oculto"
    );

}


/* =====================================================
   ATIVAR / DESATIVAR
===================================================== */

async function alterarDisponibilidade(
    id,
    disponibilidadeAtual
) {

    const novoStatus =
        !disponibilidadeAtual;


    const confirmou =
        window.confirm(
            novoStatus
                ? "Deseja reativar este produto?"
                : "Deseja desativar este produto?"
        );


    if (!confirmou) {

        return;

    }


    const { error } =
        await supabaseClient
            .from("produtos")
            .update({
                disponivel:
                    novoStatus
            })
            .eq(
                "id",
                Number(id)
            );


    if (error) {

        console.error(error);

        alert(
            "Não foi possível alterar o produto."
        );

        return;

    }


    await carregarProdutos();

}


/* =====================================================
   EXCLUIR PRODUTO
===================================================== */

async function excluirProduto(id) {

    const produto =
        produtosCarregados.find(
            item =>
                item.id === Number(id)
        );


    if (!produto) {

        alert(
            "Produto não encontrado."
        );

        return;

    }


    const confirmou =
        window.confirm(
            `Tem certeza que deseja excluir "${produto.nome}"?\n\nEssa ação não poderá ser desfeita.`
        );


    if (!confirmou) {

        return;

    }


    /*
       Primeiro excluímos
       o registro do banco.
    */

    const { error } =
        await supabaseClient
            .from("produtos")
            .delete()
            .eq(
                "id",
                Number(id)
            );


    if (error) {

        console.error(
            "Erro ao excluir produto:",
            error
        );

        alert(
            "Não foi possível excluir o produto."
        );

        return;

    }


    /*
       Depois apagamos
       as fotos do Storage.
    */

    if (
        Array.isArray(produto.imagens) &&
        produto.imagens.length > 0
    ) {

        await excluirFotosDoStorage(
            produto.imagens
        );

    }


    await carregarProdutos();


    alert(
        "Produto excluído com sucesso!"
    );

}


/* =====================================================
   CLIQUES NOS PRODUTOS
===================================================== */

produtosAdmin.addEventListener(
    "click",
    async evento => {

        /* EDITAR */

        const botaoEditar =
            evento.target.closest(
                ".btn-editar"
            );


        if (botaoEditar) {

            editarProduto(
                botaoEditar.dataset.id
            );

            return;

        }


        /* ATIVAR / DESATIVAR */

        const botaoStatus =
            evento.target.closest(
                ".btn-status"
            );


        if (botaoStatus) {

            await alterarDisponibilidade(
                botaoStatus.dataset.id,
                botaoStatus.dataset.disponivel ===
                    "true"
            );

            return;

        }


        /* EXCLUIR */

        const botaoExcluir =
            evento.target.closest(
                ".btn-excluir"
            );


        if (botaoExcluir) {

            await excluirProduto(
                botaoExcluir.dataset.id
            );

        }

    }
);


/* =====================================================
   LOGIN
===================================================== */

formLogin.addEventListener(
    "submit",
    async evento => {

        evento.preventDefault();


        const email =
            document
                .getElementById("emailLogin")
                .value
                .trim();

        const senha =
            document
                .getElementById("senhaLogin")
                .value;


        erroLogin.textContent = "";


        const { error } =
            await supabaseClient
                .auth
                .signInWithPassword({
                    email,
                    password: senha
                });


        if (error) {

            console.error(error);

            erroLogin.textContent =
                "E-mail ou senha incorretos.";

            return;

        }


        await liberarPainel();

    }
);


/* =====================================================
   LIBERAR PAINEL
===================================================== */

async function liberarPainel() {

    const { data, error } =
        await supabaseClient
            .auth
            .getUser();


    if (
        error ||
        !data.user
    ) {

        telaLogin.style.display =
            "flex";

        btnSair.style.display =
            "none";

        return;

    }


    telaLogin.style.display =
        "none";

    btnSair.style.display =
        "block";


    await Promise.all([
        carregarProdutos(),
        carregarPedidos()
    ]);

}


/* =====================================================
   SAIR
===================================================== */

btnSair.addEventListener(
    "click",
    async () => {

        await supabaseClient
            .auth
            .signOut();


        produtosAdmin.innerHTML =
            "";

        if (pedidosAdmin) {
            pedidosAdmin.innerHTML = "";
        }


        telaLogin.style.display =
            "flex";

        btnSair.style.display =
            "none";


        fecharFormulario();

    }
);


/* =====================================================
   FECHAR AO CLICAR FORA
===================================================== */

areaFormulario.addEventListener(
    "click",
    evento => {

        if (
            evento.target ===
            areaFormulario
        ) {

            fecharFormulario();

        }

    }
);




/* =====================================================
   PEDIDOS - ELEMENTOS
===================================================== */

const abaProdutos =
    document.getElementById("abaProdutos");

const abaPedidos =
    document.getElementById("abaPedidos");

const painelProdutos =
    document.getElementById("painelProdutos");

const painelPedidos =
    document.getElementById("painelPedidos");

const contadorPedidosNovos =
    document.getElementById("contadorPedidosNovos");

const btnAtualizarPedidos =
    document.getElementById("btnAtualizarPedidos");

const filtroStatusPedido =
    document.getElementById("filtroStatusPedido");

const filtroMesAnoPedido =
    document.getElementById("filtroMesAnoPedido");

const btnLimparFiltrosPedidos =
    document.getElementById("btnLimparFiltrosPedidos");

const carregandoPedidos =
    document.getElementById("carregandoPedidos");

const pedidosAdmin =
    document.getElementById("pedidosAdmin");

const resumoPedidosNovos =
    document.getElementById("resumoPedidosNovos");

const resumoPedidosConcluidos =
    document.getElementById("resumoPedidosConcluidos");

const resumoPedidosNaoConcluidos =
    document.getElementById("resumoPedidosNaoConcluidos");

const resumoValorConcluido =
    document.getElementById("resumoValorConcluido");

const areaDetalhesPedido =
    document.getElementById("areaDetalhesPedido");

const tituloDetalhesPedido =
    document.getElementById("tituloDetalhesPedido");

const conteudoDetalhesPedido =
    document.getElementById("conteudoDetalhesPedido");

const btnFecharDetalhesPedido =
    document.getElementById("btnFecharDetalhesPedido");


let pedidosCarregados = [];


/* =====================================================
   PEDIDOS - FORMATAÇÕES
===================================================== */

function formatarDataPedidoAdmin(valor) {

    if (!valor) {
        return "";
    }

    const data =
        new Date(valor);

    if (
        Number.isNaN(
            data.getTime()
        )
    ) {
        return "";
    }

    return data.toLocaleString(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );

}


function nomeStatusPedidoAdmin(status) {

    const nomes = {
        novo: "Novo",
        concluido: "Concluído",
        nao_concluido: "Não concluído"
    };

    return nomes[status] ||
        status ||
        "Novo";

}


function classeStatusPedidoAdmin(status) {

    if (status === "concluido") {
        return "pedido-status-concluido";
    }

    if (status === "nao_concluido") {
        return "pedido-status-nao-concluido";
    }

    return "pedido-status-novo";

}


/* =====================================================
   ABAS DO PAINEL
===================================================== */

function abrirAbaAdmin(aba) {

    const mostrarPedidos =
        aba === "pedidos";

    painelProdutos
        ?.classList
        .toggle(
            "oculto",
            mostrarPedidos
        );

    painelPedidos
        ?.classList
        .toggle(
            "oculto",
            !mostrarPedidos
        );

    abaProdutos
        ?.classList
        .toggle(
            "ativa",
            !mostrarPedidos
        );

    abaPedidos
        ?.classList
        .toggle(
            "ativa",
            mostrarPedidos
        );

}


abaProdutos?.addEventListener(
    "click",
    () => {
        abrirAbaAdmin("produtos");
    }
);


abaPedidos?.addEventListener(
    "click",
    () => {
        abrirAbaAdmin("pedidos");
        renderizarPedidosAdmin();
    }
);


/* =====================================================
   CARREGAR PEDIDOS
===================================================== */

async function carregarPedidos() {

    if (!pedidosAdmin) {
        return;
    }

    carregandoPedidos.style.display =
        "block";

    carregandoPedidos.textContent =
        "Carregando pedidos...";

    const {
        data,
        error
    } =
        await supabaseClient
            .from("pedidos")
            .select(
                "id, codigo, total, quantidade_itens, status, created_at"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "Erro ao carregar pedidos:",
            error
        );

        carregandoPedidos.textContent =
            "Não foi possível carregar os pedidos.";

        return;
    }

    pedidosCarregados =
        data || [];

    carregandoPedidos.style.display =
        "none";

    atualizarResumoPedidos();

    renderizarPedidosAdmin();

}


/* =====================================================
   FILTRO DE MÊS / ANO
===================================================== */

function pedidoPertenceAoMesAno(
    pedido,
    mesAno
) {

    if (!mesAno) {
        return true;
    }

    if (!pedido?.created_at) {
        return false;
    }

    const data =
        new Date(
            pedido.created_at
        );

    if (
        Number.isNaN(
            data.getTime()
        )
    ) {
        return false;
    }

    const ano =
        data.getFullYear();

    const mes =
        String(
            data.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    return `${ano}-${mes}` === mesAno;

}


function obterPedidosDoPeriodo() {

    const mesAno =
        filtroMesAnoPedido?.value ||
        "";

    return pedidosCarregados.filter(
        pedido =>
            pedidoPertenceAoMesAno(
                pedido,
                mesAno
            )
    );

}


/* =====================================================
   RESUMO DOS PEDIDOS
===================================================== */

function atualizarResumoPedidos() {

    const pedidosDoPeriodo =
        obterPedidosDoPeriodo();

    const novos =
        pedidosDoPeriodo.filter(
            pedido =>
                (pedido.status || "novo") ===
                "novo"
        );

    const concluidos =
        pedidosDoPeriodo.filter(
            pedido =>
                pedido.status ===
                "concluido"
        );

    const naoConcluidos =
        pedidosDoPeriodo.filter(
            pedido =>
                pedido.status ===
                "nao_concluido"
        );

    const valorConcluido =
        concluidos.reduce(
            (
                total,
                pedido
            ) =>
                total +
                Number(
                    pedido.total || 0
                ),
            0
        );

    if (resumoPedidosNovos) {
        resumoPedidosNovos.textContent =
            novos.length;
    }

    if (resumoPedidosConcluidos) {
        resumoPedidosConcluidos.textContent =
            concluidos.length;
    }

    if (resumoPedidosNaoConcluidos) {
        resumoPedidosNaoConcluidos.textContent =
            naoConcluidos.length;
    }

    if (resumoValorConcluido) {
        resumoValorConcluido.textContent =
            formatarPreco(
                valorConcluido
            );
    }

    if (contadorPedidosNovos) {

        const novosGerais =
            pedidosCarregados.filter(
                pedido =>
                    (pedido.status || "novo") ===
                    "novo"
            );

        contadorPedidosNovos.textContent =
            novosGerais.length;

        contadorPedidosNovos.classList.toggle(
            "oculto",
            novosGerais.length === 0
        );
    }

}


/* =====================================================
   FILTRAR / RENDERIZAR PEDIDOS
===================================================== */

function renderizarPedidosAdmin() {

    if (!pedidosAdmin) {
        return;
    }

    const filtro =
        filtroStatusPedido?.value ||
        "todos";

    const pedidosDoPeriodo =
        obterPedidosDoPeriodo();

    const lista =
        filtro === "todos"
            ? pedidosDoPeriodo
            : pedidosDoPeriodo.filter(
                pedido =>
                    (pedido.status || "novo") ===
                    filtro
            );

    if (lista.length === 0) {

        pedidosAdmin.innerHTML = `

            <div class="pedidos-vazio">

                <h3>
                    Nenhum pedido encontrado
                </h3>

                <p>
                    Não há pedidos para o filtro selecionado.
                </p>

            </div>

        `;

        return;
    }

    pedidosAdmin.innerHTML =
        lista
            .map(
                criarHtmlPedidoAdmin
            )
            .join("");

}


function criarHtmlPedidoAdmin(pedido) {

    const status =
        pedido.status ||
        "novo";

    const statusNome =
        nomeStatusPedidoAdmin(
            status
        );

    const statusClasse =
        classeStatusPedidoAdmin(
            status
        );

    return `

        <article
            class="pedido-admin-card"
            data-id="${pedido.id}"
        >

            <div class="pedido-admin-principal">

                <div class="pedido-admin-identificacao">

                    <span class="pedido-admin-codigo">
                        ${pedido.codigo}
                    </span>

                    <span
                        class="pedido-admin-status ${statusClasse}"
                    >
                        ${statusNome}
                    </span>

                </div>

                <p class="pedido-admin-data">
                    ${formatarDataPedidoAdmin(
                        pedido.created_at
                    )}
                </p>

            </div>


            <div class="pedido-admin-metricas">

                <div>
                    <span>Itens</span>
                    <strong>
                        ${pedido.quantidade_itens || 0}
                    </strong>
                </div>

                <div>
                    <span>Total</span>
                    <strong>
                        ${formatarPreco(
                            pedido.total || 0
                        )}
                    </strong>
                </div>

            </div>


            <div class="pedido-admin-acoes">

                <button
                    type="button"
                    class="btn-pedido-detalhes"
                    data-id="${pedido.id}"
                >
                    Ver detalhes
                </button>

                <button
                    type="button"
                    class="btn-pedido-excluir"
                    data-id="${pedido.id}"
                >
                    Excluir
                </button>

                ${
                    status !== "concluido"
                        ? `
                            <button
                                type="button"
                                class="btn-pedido-concluir"
                                data-id="${pedido.id}"
                            >
                                Concluir
                            </button>
                          `
                        : ""
                }

                ${
                    status !== "nao_concluido"
                        ? `
                            <button
                                type="button"
                                class="btn-pedido-nao-concluir"
                                data-id="${pedido.id}"
                            >
                                Não concluiu
                            </button>
                          `
                        : ""
                }

                ${
                    status !== "novo"
                        ? `
                            <button
                                type="button"
                                class="btn-pedido-reabrir"
                                data-id="${pedido.id}"
                            >
                                Reabrir
                            </button>
                          `
                        : ""
                }

            </div>

        </article>

    `;

}


/* =====================================================
   ALTERAR STATUS DO PEDIDO
===================================================== */

async function alterarStatusPedido(
    id,
    novoStatus
) {

    const pedido =
        pedidosCarregados.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (!pedido) {
        return;
    }

    const mensagens = {
        concluido:
            "Marcar este pedido como concluído?",
        nao_concluido:
            "Marcar este pedido como não concluído?",
        novo:
            "Reabrir este pedido e voltar o status para Novo?"
    };

    const confirmou =
        window.confirm(
            mensagens[novoStatus] ||
            "Alterar o status deste pedido?"
        );

    if (!confirmou) {
        return;
    }

    const {
        error
    } =
        await supabaseClient
            .from("pedidos")
            .update({
                status:
                    novoStatus
            })
            .eq(
                "id",
                Number(id)
            );

    if (error) {

        console.error(
            "Erro ao alterar status do pedido:",
            error
        );

        alert(
            "Não foi possível atualizar o pedido."
        );

        return;
    }

    pedido.status =
        novoStatus;

    atualizarResumoPedidos();

    renderizarPedidosAdmin();

}


/* =====================================================
   EXCLUIR PEDIDO
===================================================== */

async function excluirPedidoAdmin(
    id
) {

    const pedido =
        pedidosCarregados.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (!pedido) {
        return;
    }

    const confirmou =
        window.confirm(
            `Tem certeza que deseja excluir o pedido ${pedido.codigo}?\n\nEssa ação não poderá ser desfeita.`
        );

    if (!confirmou) {
        return;
    }

    /*
       Primeiro removemos os itens ligados ao pedido.
       Depois removemos o pedido principal.
    */

    const { error: erroItens } =
        await supabaseClient
            .from("itens_pedido")
            .delete()
            .eq(
                "pedido_id",
                Number(id)
            );

    if (erroItens) {

        console.error(
            "Erro ao excluir itens do pedido:",
            erroItens
        );

        alert(
            "Não foi possível excluir os itens deste pedido."
        );

        return;
    }

    const { error: erroPedido } =
        await supabaseClient
            .from("pedidos")
            .delete()
            .eq(
                "id",
                Number(id)
            );

    if (erroPedido) {

        console.error(
            "Erro ao excluir pedido:",
            erroPedido
        );

        alert(
            "Os itens foram removidos, mas não foi possível excluir o pedido. Tente novamente."
        );

        await carregarPedidos();

        return;
    }

    pedidosCarregados =
        pedidosCarregados.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );

    atualizarResumoPedidos();

    renderizarPedidosAdmin();

    alert(
        "Pedido excluído com sucesso!"
    );

}


/* =====================================================
   DETALHES DO PEDIDO
===================================================== */

async function abrirDetalhesPedido(
    id
) {

    const pedido =
        pedidosCarregados.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (
        !pedido ||
        !areaDetalhesPedido ||
        !conteudoDetalhesPedido
    ) {
        return;
    }

    tituloDetalhesPedido.textContent =
        pedido.codigo;

    conteudoDetalhesPedido.innerHTML =
        `
            <div class="pedido-detalhe-carregando">
                Carregando itens...
            </div>
        `;

    areaDetalhesPedido.classList.remove(
        "oculto"
    );

    const {
        data: itens,
        error
    } =
        await supabaseClient
            .from("itens_pedido")
            .select("*")
            .eq(
                "pedido_id",
                Number(id)
            )
            .order(
                "id",
                {
                    ascending: true
                }
            );

    if (error) {

        console.error(
            "Erro ao carregar itens do pedido:",
            error
        );

        conteudoDetalhesPedido.innerHTML =
            `
                <div class="pedido-detalhe-erro">
                    Não foi possível carregar os itens.
                </div>
            `;

        return;
    }

    const htmlItens =
        (itens || [])
            .map(
                item => {

                    const precoOriginal =
                        Number(
                            item.preco_original || 0
                        );

                    const precoFinal =
                        Number(
                            item.preco_final || 0
                        );

                    const promocao =
                        precoOriginal >
                        precoFinal;

                    return `

                        <article class="pedido-detalhe-item">

                            <div class="pedido-detalhe-imagem">

                                ${
                                    item.imagem
                                        ? `
                                            <img
                                                src="${item.imagem}"
                                                alt="${item.nome}"
                                            >
                                          `
                                        : `
                                            <span>Sem foto</span>
                                          `
                                }

                            </div>

                            <div class="pedido-detalhe-info">

                                <h3>
                                    ${item.nome}
                                </h3>

                                ${
                                    item.tamanho
                                        ? `
                                            <p>
                                                Tamanho: ${item.tamanho}
                                            </p>
                                          `
                                        : ""
                                }

                                ${
                                    item.cor
                                        ? `
                                            <p>
                                                Cor: ${item.cor}
                                            </p>
                                          `
                                        : ""
                                }

                                <p>
                                    Quantidade:
                                    <strong>
                                        ${item.quantidade}
                                    </strong>
                                </p>

                                <div class="pedido-detalhe-preco">

                                    ${
                                        promocao
                                            ? `
                                                <span class="pedido-detalhe-original">
                                                    ${formatarPreco(
                                                        precoOriginal
                                                    )}
                                                </span>
                                              `
                                            : ""
                                    }

                                    <strong>
                                        ${formatarPreco(
                                            precoFinal
                                        )}
                                    </strong>

                                </div>

                                <p class="pedido-detalhe-subtotal">
                                    Subtotal:
                                    <strong>
                                        ${formatarPreco(
                                            item.subtotal || 0
                                        )}
                                    </strong>
                                </p>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");

    const linkPublico =
        `pedido.html?codigo=${encodeURIComponent(
            pedido.codigo
        )}`;

    conteudoDetalhesPedido.innerHTML = `

        <div class="pedido-detalhe-resumo">

            <div>
                <span>Status</span>
                <strong>
                    ${nomeStatusPedidoAdmin(
                        pedido.status
                    )}
                </strong>
            </div>

            <div>
                <span>Data</span>
                <strong>
                    ${formatarDataPedidoAdmin(
                        pedido.created_at
                    )}
                </strong>
            </div>

            <div>
                <span>Total</span>
                <strong>
                    ${formatarPreco(
                        pedido.total || 0
                    )}
                </strong>
            </div>

        </div>


        <div class="pedido-detalhe-lista">

            ${htmlItens}

        </div>


        <div class="pedido-detalhe-rodape">

            <a
                href="${linkPublico}"
                target="_blank"
                class="btn-ver-pedido-publico"
            >
                Abrir página do pedido
            </a>

        </div>

    `;

}


function fecharDetalhesPedido() {

    areaDetalhesPedido
        ?.classList
        .add(
            "oculto"
        );

    if (conteudoDetalhesPedido) {
        conteudoDetalhesPedido.innerHTML = "";
    }

}


/* =====================================================
   EVENTOS DOS PEDIDOS
===================================================== */

filtroStatusPedido?.addEventListener(
    "change",
    renderizarPedidosAdmin
);


filtroMesAnoPedido?.addEventListener(
    "change",
    () => {
        atualizarResumoPedidos();
        renderizarPedidosAdmin();
    }
);


btnLimparFiltrosPedidos?.addEventListener(
    "click",
    () => {

        if (filtroStatusPedido) {
            filtroStatusPedido.value =
                "todos";
        }

        if (filtroMesAnoPedido) {
            filtroMesAnoPedido.value =
                "";
        }

        atualizarResumoPedidos();
        renderizarPedidosAdmin();
    }
);


btnAtualizarPedidos?.addEventListener(
    "click",
    carregarPedidos
);


pedidosAdmin?.addEventListener(
    "click",
    async evento => {

        const botaoDetalhes =
            evento.target.closest(
                ".btn-pedido-detalhes"
            );

        if (botaoDetalhes) {

            await abrirDetalhesPedido(
                botaoDetalhes.dataset.id
            );

            return;
        }


        const botaoExcluirPedido =
            evento.target.closest(
                ".btn-pedido-excluir"
            );

        if (botaoExcluirPedido) {

            await excluirPedidoAdmin(
                botaoExcluirPedido.dataset.id
            );

            return;
        }


        const botaoConcluir =
            evento.target.closest(
                ".btn-pedido-concluir"
            );

        if (botaoConcluir) {

            await alterarStatusPedido(
                botaoConcluir.dataset.id,
                "concluido"
            );

            return;
        }


        const botaoNaoConcluir =
            evento.target.closest(
                ".btn-pedido-nao-concluir"
            );

        if (botaoNaoConcluir) {

            await alterarStatusPedido(
                botaoNaoConcluir.dataset.id,
                "nao_concluido"
            );

            return;
        }


        const botaoReabrir =
            evento.target.closest(
                ".btn-pedido-reabrir"
            );

        if (botaoReabrir) {

            await alterarStatusPedido(
                botaoReabrir.dataset.id,
                "novo"
            );
        }

    }
);


btnFecharDetalhesPedido?.addEventListener(
    "click",
    fecharDetalhesPedido
);


areaDetalhesPedido?.addEventListener(
    "click",
    evento => {

        if (
            evento.target ===
            areaDetalhesPedido
        ) {
            fecharDetalhesPedido();
        }

    }
);


/* =====================================================
   INICIAR
===================================================== */

liberarPainel();