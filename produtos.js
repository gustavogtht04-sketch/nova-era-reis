let produtos = [];


/* =====================================================
   NOMES DAS CATEGORIAS
===================================================== */

function obterNomeCategoria(categoria) {

    const categorias = {
        camiseta: "Camiseta",
        regata: "Regata",
        casaco: "Casaco",
        bermuda: "Bermuda"
    };

    return categorias[categoria] || categoria;

}


/* =====================================================
   CARREGAR PRODUTOS DO SUPABASE
===================================================== */

const produtosProntos = async function () {

    try {

        const { data, error } =
            await supabaseClient
                .from("produtos")
                .select("*")
                .eq("disponivel", true)
                .order("created_at", {
                    ascending: false
                });


        if (error) {

            console.error(
                "Erro ao carregar produtos:",
                error
            );

            throw error;

        }


        produtos = data.map(
            (produto) => {

                let tamanhos = [];

                if (produto.tamanhos) {

                    tamanhos =
                        produto.tamanhos
                            .split(",")
                            .map(
                                (tamanho) =>
                                    tamanho.trim()
                            )
                            .filter(Boolean);

                }


                let cores = [];

                if (produto.cores) {

                    cores =
                        produto.cores
                            .split(",")
                            .map(
                                (cor) =>
                                    cor.trim()
                            )
                            .filter(Boolean);

                }


                let imagens = [];

                if (Array.isArray(produto.imagens)) {

                    imagens =
                        produto.imagens;

                }


                const preco =
                    Number(
                        produto.preco
                    );


                let precoPromocional =
                    null;


                if (
                    produto.preco_promocional !== null &&
                    produto.preco_promocional !== undefined &&
                    produto.preco_promocional !== ""
                ) {

                    const valorPromocional =
                        Number(
                            produto.preco_promocional
                        );


                    if (
                        !Number.isNaN(
                            valorPromocional
                        ) &&
                        valorPromocional > 0 &&
                        valorPromocional < preco
                    ) {

                        precoPromocional =
                            valorPromocional;

                    }

                }


                return {

                    id:
                        produto.id,

                    nome:
                        produto.nome,

                    categoria:
                        produto.categoria,

                    nomeCategoria:
                        obterNomeCategoria(
                            produto.categoria
                        ),

                    preco:
                        preco,

                    precoPromocional:
                        precoPromocional,

                    imagens:
                        imagens,

                    tamanhos:
                        tamanhos,

                    cores:
                        cores,

                    descricao:
                        produto.descricao || "",

                    disponivel:
                        produto.disponivel

                };

            }
        );


        console.log(
            `${produtos.length} produto(s) carregado(s) do Supabase.`
        );


        return produtos;

    }

    catch (erro) {

        console.error(
            "Não foi possível carregar o catálogo.",
            erro
        );

        produtos = [];

        return produtos;

    }

}();