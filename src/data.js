// Catálogo demonstrativo da Casa Vivian.
// Fotos: Instagram @casavivian. Nomes, preços e medidas são de demonstração: confirmar com a loja.

export const WHATS = '5537991292900'
export const WHATS_VARGINHA = '5535910026352'

export const CATEGORIAS = [
  { id: 'loucas', nome: 'Louças', linha: 'Pratos que viram assunto à mesa.' },
  { id: 'tacas', nome: 'Taças', linha: 'Cristal lapidado, cor de fim de tarde.' },
  { id: 'vasos', nome: 'Vasos e jarras', linha: 'Vidro, cerâmica e terracota feitos à mão.' },
  { id: 'iluminacao', nome: 'Iluminação', linha: 'Abajures que dão o tom da sala.' },
  { id: 'texteis', nome: 'Mantas e almofadas', linha: 'Tricô e crochê para o sofá e a poltrona.' },
  { id: 'aromas', nome: 'Aromas', linha: 'Para a casa ter cheiro de casa.' },
  { id: 'presentes', nome: 'Presentes', linha: 'Caixa kraft e a fita bordô da casa.' },
  { id: 'datas', nome: 'Datas especiais', linha: 'Páscoa, Natal e as mesas de cada uma.' },
]

export const PRODUTOS = [
  { id: 'tacas-ambar', nome: 'Taças âmbar lapidadas', cat: 'tacas', preco: 289, unidade: 'par',
    img: 'img/p/tacas-ambar.webp', mat: 'Cristal lapidado à mão', med: 'Água 22 cm · Champanhe 24 cm',
    desc: 'Lapidação vertical em cristal âmbar. Uma para a água, outra para o espumante: a mesa ganha luz de vela mesmo de dia.', novo: true },
  { id: 'prato-toile', nome: 'Prato raso Toile Terracota', cat: 'loucas', preco: 129, unidade: 'unidade',
    img: 'img/p/prato-toile.webp', mat: 'Porcelana estampada', med: 'Ø 27 cm',
    desc: 'Estampa toile de jouy em terracota, cenas de campo desenhadas a traço. Combina com talher dourado e guardanapo de linho cru.' },
  { id: 'pratos-pintados', nome: 'Pratos pintados à mão', cat: 'loucas', preco: 145, unidade: 'unidade',
    img: 'img/p/pratos-pintados.webp', mat: 'Cerâmica pintada à mão', med: 'Ø 21 a 30 cm',
    desc: 'Coral, concha e estrela-do-mar com borda de folhas. Feitos para a mesa e para a parede: cada um sai diferente do outro.' },
  { id: 'vaso-vermelho', nome: 'Vaso de vidro rubi texturizado', cat: 'vasos', preco: 349, unidade: 'unidade',
    img: 'img/p/vaso-vermelho.webp', mat: 'Vidro soprado com camada de cristal', med: '18 × 20 cm',
    desc: 'O vermelho fica preso dentro do vidro transparente, com textura de gelo por fora. Sozinho num aparador, já é a peça da sala.', novo: true },
  { id: 'potiches-azuis', nome: 'Potiches azul arabesco', cat: 'vasos', preco: 590, unidade: 'par',
    img: 'img/p/potiches-azuis.webp', mat: 'Porcelana esmaltada', med: '26 cm e 20 cm',
    desc: 'O par azul e branco que atravessa estilos: vai do clássico ao praiano. A tampa menor solta vira detalhe na mesa.' },
  { id: 'cachepos-azuis', nome: 'Cachepôs listrados cobalto', cat: 'vasos', preco: 219, unidade: 'unidade',
    img: 'img/p/cachepos-azuis.webp', mat: 'Cerâmica pintada à mão', med: '16 a 24 cm',
    desc: 'Listras azul cobalto feitas a pincel, cada uma com a sua espessura. Para orquídeas, talheres ou nada além dele mesmo.' },
  { id: 'vaso-gota', nome: 'Vaso gota em terracota', cat: 'vasos', preco: 260, unidade: 'unidade',
    img: 'img/p/vaso-gota.webp', mat: 'Terracota natural', med: '38 cm',
    desc: 'Forma de gota, boca estreita e superfície de barro cru. Pede um galho seco ou fica vazio, como escultura.' },
  { id: 'garrafas-listradas', nome: 'Garrafas listradas azul e branco', cat: 'vasos', preco: 179, unidade: 'unidade',
    img: 'img/p/garrafas-listradas.webp', mat: 'Cerâmica pintada à mão', med: '42 cm e 36 cm',
    desc: 'Garrafas altas com listras verticais, para uma haste só. Em dupla, de alturas diferentes, ficam melhores.' },
  { id: 'cachepo-ambar', nome: 'Cachepô âmbar com gotas', cat: 'vasos', preco: 310, unidade: 'unidade',
    img: 'img/p/cachepo-ambar.webp', mat: 'Vidro artístico com folha dourada', med: '14 × 15 cm',
    desc: 'Gotas de vidro escorrendo pela borda e folha dourada presa no fundo. Vela, flor curta ou porta-objetos.' },
  { id: 'vaso-murano', nome: 'Vaso fumê de gotas', cat: 'vasos', preco: 890, unidade: 'unidade',
    img: 'img/p/vaso-murano.webp', mat: 'Vidro artístico fumê', med: '34 cm',
    desc: 'O irmão maior do cachepô âmbar, em fumê quase preto. Recebe lírios e flores de haste longa.' },
  { id: 'cachepos-verdes', nome: 'Cachepôs listrados verde-bandeira', cat: 'vasos', preco: 198, unidade: 'unidade',
    img: 'img/p/cachepos-verdes.webp', mat: 'Cerâmica pintada à mão', med: '14 a 28 cm',
    desc: 'Verde-bandeira sobre branco, com moringas de terracota ao lado. Fica bonito em conjunto de três alturas.' },
  { id: 'abajur-azul', nome: 'Abajur porcelana azul floral', cat: 'iluminacao', preco: 680, unidade: 'unidade',
    img: 'img/p/abajur-azul.webp', mat: 'Base em porcelana pintada · cúpula plissada', med: '58 cm',
    desc: 'Base pintada à mão em azul e branco, cúpula de tecido plissado. Para mesa de cabeceira ou aparador.' },
  { id: 'abajur-palha', nome: 'Abajur floral com cúpula de palha', cat: 'iluminacao', preco: 720, unidade: 'unidade',
    img: 'img/p/abajur-palha.webp', mat: 'Cerâmica floral verde · palha natural', med: '64 cm',
    desc: 'Folhagem verde pintada na base e cúpula de palha trançada, que espalha a luz em desenho pela parede.' },
  { id: 'almofada-croche', nome: 'Almofada de crochê off-white', cat: 'texteis', preco: 189, unidade: 'unidade',
    img: 'img/p/almofada-croche.webp', mat: 'Crochê em algodão · enchimento incluso', med: '45 × 45 cm',
    desc: 'Flor central em crochê alto-relevo. A textura que falta na poltrona de veludo.' },
  { id: 'kit-aromas', nome: 'Kit aromas com cesto artesanal', cat: 'aromas', preco: 239, unidade: 'kit',
    img: 'img/p/kit-aromas.webp', mat: 'Home spray, difusor e cesto de fibra natural', med: 'Cesto Ø 22 cm',
    desc: 'Home spray e difusor com o cordão bordô da casa, servidos num cesto de fibra com pompom. Presente pronto.', novo: true },
  { id: 'vale-presente', nome: 'Vale-presente Casa Vivian', cat: 'presentes', preco: 200, unidade: 'vale',
    img: 'img/p/vale-presente.webp', mat: 'Cartão + caixa kraft com fita bordô', med: 'Válido por 6 meses',
    desc: 'Para quem você ainda não sabe o que escolher: a pessoa vem à loja e escolhe com a gente. Vai na caixa kraft, com a fita da casa.' },
  { id: 'coelho-porcelana', nome: 'Coelho de porcelana com carrinho', cat: 'datas', preco: 159, unidade: 'unidade',
    img: 'img/p/coelho-porcelana.webp', mat: 'Porcelana esmaltada', med: '24 cm',
    desc: 'O coelho de laço azul empurrando o carrinho de flores. Volta para a mesa toda Páscoa.' },
]

export const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const byId = (id) => PRODUTOS.find((p) => p.id === id)
