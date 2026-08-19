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
        camisetas: "Camisetas",
        polos: "Polos",
        bermudas: "Bermudas",
        calcas: "Calças",
        conjuntos: "Conjuntos"
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
                campoTamanhos.value.trim(),

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

    campoPreco.value =
        produto.preco ?? "";

    campoPrecoPromocional.value =
        produto.preco_promocional ?? "";

    campoDescricao.value =
        produto.descricao || "";

    campoTamanhos.value =
        produto.tamanhos || "";

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


    await carregarProdutos();

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
   INICIAR
===================================================== */

liberarPainel();