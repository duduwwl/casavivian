import {
  gsap, reduz, $, $$, iniciarRolagem, iniciarSacola, iniciarMenu, iniciarNav, iniciarMagneticos,
  adicionar, sacola, brl, byId, PRODUTOS, travar, linkWhats,
} from './shared.js'
import { CATEGORIAS } from './data.js'

iniciarRolagem()
iniciarSacola()
iniciarMenu()
iniciarNav()

/* ============ Filtros ============ */
const params = new URLSearchParams(location.search)
const estado = {
  cat: CATEGORIAS.some((c) => c.id === params.get('cat')) ? params.get('cat') : 'todas',
  busca: '',
  ordem: 'destaque',
  max: 900,
  novos: false,
}

$('.chips').innerHTML = [{ id: 'todas', nome: 'Todas' }, ...CATEGORIAS]
  .map((c) => `<button role="radio" aria-checked="${c.id === estado.cat}" data-cat="${c.id}">${c.nome}<span>${c.id === 'todas' ? PRODUTOS.length : PRODUTOS.filter((p) => p.cat === c.id).length}</span></button>`)
  .join('')

const sem = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const filtrar = () => {
  let l = PRODUTOS.filter((p) =>
    (estado.cat === 'todas' || p.cat === estado.cat) &&
    p.preco <= estado.max &&
    (!estado.novos || p.novo) &&
    (!estado.busca || sem(`${p.nome} ${p.mat} ${p.desc}`).includes(sem(estado.busca)))
  )
  if (estado.ordem === 'menor') l = [...l].sort((a, b) => a.preco - b.preco)
  if (estado.ordem === 'maior') l = [...l].sort((a, b) => b.preco - a.preco)
  if (estado.ordem === 'nome') l = [...l].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  return l
}

const grade = $('[data-grade]')
function render(animar = true) {
  const l = filtrar()
  grade.innerHTML = l
    .map((p, i) => {
      const cat = CATEGORIAS.find((c) => c.id === p.cat).nome
      return `<li class="produto">
        <button class="produto__foto" data-ver="${p.id}" aria-label="Ver detalhes de ${p.nome}">
          <img src="${p.img}" alt="${p.nome}" loading="${i < 6 ? 'eager' : 'lazy'}" width="600" height="750">
          ${p.novo ? '<span class="produto__selo">Novidade</span>' : ''}
        </button>
        <div class="produto__info">
          <h2 class="produto__nome"><button data-ver="${p.id}">${p.nome}</button></h2>
          <p class="produto__preco">${brl(p.preco)} <span>/ ${p.unidade}</span></p>
          <p class="produto__parc">ou 3× de ${brl(p.preco / 3)} sem juros</p>
        </div>
        <button class="produto__add" data-add="${p.id}">Adicionar à sacola</button>
      </li>`
    })
    .join('')
  $('[data-vazio]').hidden = l.length > 0
  $('[data-contagem]').textContent = `${l.length} ${l.length === 1 ? 'peça' : 'peças'}${estado.cat !== 'todas' ? ' em ' + CATEGORIAS.find((c) => c.id === estado.cat).nome.toLowerCase() : ''}`
  if (animar && !reduz) gsap.from($$('.produto', grade), { y: 24, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05, clearProps: 'all' })
}

$('.chips').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cat]')
  if (!b) return
  estado.cat = b.dataset.cat
  $$('[data-cat]').forEach((x) => x.setAttribute('aria-checked', String(x === b)))
  const u = new URL(location)
  estado.cat === 'todas' ? u.searchParams.delete('cat') : u.searchParams.set('cat', estado.cat)
  history.replaceState(null, '', u)
  render()
})
let tBusca
$('[data-busca]').addEventListener('input', (e) => {
  clearTimeout(tBusca)
  tBusca = setTimeout(() => { estado.busca = e.target.value.trim(); render() }, 160)
})
$('[data-ordem]').addEventListener('change', (e) => { estado.ordem = e.target.value; render() })
$('[data-preco]').addEventListener('input', (e) => {
  estado.max = +e.target.value
  $('[data-preco-rotulo]').textContent = brl(estado.max).replace(',00', '')
  render(false)
})
$('[data-novos]').addEventListener('change', (e) => { estado.novos = e.target.checked; render() })
$('[data-limpar]').addEventListener('click', () => {
  Object.assign(estado, { cat: 'todas', busca: '', ordem: 'destaque', max: 900, novos: false })
  $('[data-busca]').value = ''; $('[data-ordem]').value = 'destaque'; $('[data-preco]').value = 900; $('[data-novos]').checked = false
  $('[data-preco-rotulo]').textContent = 'R$ 900'
  $$('[data-cat]').forEach((x) => x.setAttribute('aria-checked', String(x.dataset.cat === 'todas')))
  render()
})

grade.addEventListener('click', (e) => {
  const a = e.target.closest('[data-add]')
  if (a) {
    adicionar(a.dataset.add, a)
    a.textContent = 'Na sacola ✓'
    setTimeout(() => (a.textContent = 'Adicionar à sacola'), 1600)
    return
  }
  const v = e.target.closest('[data-ver]')
  if (v) abrirVista(v.dataset.ver)
})

/* ============ Visualização rápida ============ */
const vista = $('[data-vista]')
function abrirVista(id) {
  const p = byId(id)
  const cat = CATEGORIAS.find((c) => c.id === p.cat).nome
  let q = 1
  $('.vista__corpo', vista).innerHTML = `
    <figure class="vista__foto"><img src="${p.img}" alt="${p.nome}"></figure>
    <div class="vista__info">
      <p class="produto__cat">${cat}</p>
      <h2 id="vista-nome" class="vista__nome">${p.nome}</h2>
      <p class="vista__preco">${brl(p.preco)} <span>/ ${p.unidade}</span></p>
      <p class="vista__desc">${p.desc}</p>
      <dl class="vista__ficha">
        <div><dt>Material</dt><dd>${p.mat}</dd></div>
        <div><dt>Medidas</dt><dd>${p.med}</dd></div>
        <div><dt>Retirada</dt><dd>Varginha ou Divinópolis, grátis</dd></div>
      </dl>
      <div class="vista__comprar">
        <div class="qtd qtd--grande" aria-label="Quantidade">
          <button type="button" data-vq="-1" aria-label="Diminuir">−</button><span data-vq-n>1</span><button type="button" data-vq="1" aria-label="Aumentar">+</button>
        </div>
        <button class="pilula pilula--cheia" data-vista-add>Adicionar à sacola</button>
      </div>
      <a class="link-seta" target="_blank" rel="noopener" href="${linkWhats(`Olá! Tenho interesse em: ${p.nome}. Ainda tem disponível?`)}">Perguntar sobre esta peça <span aria-hidden="true">→</span></a>
    </div>`
  vista.onclick = (e) => {
    if (e.target === vista || e.target.closest('[data-fechar-vista]')) return fecharVista()
    const b = e.target.closest('[data-vq]')
    if (b) { q = Math.max(1, q + +b.dataset.vq); $('[data-vq-n]', vista).textContent = q }
    if (e.target.closest('[data-vista-add]')) {
      sacola.add(id, q - 1)
      adicionar(id, e.target.closest('[data-vista-add]'))
      fecharVista()
    }
  }
  vista.showModal()
  travar(true)
  if (!reduz) gsap.from(vista, { y: 30, opacity: 0, duration: 0.6, ease: 'expo.out' })
}
const fecharVista = () => { vista.close(); travar(false) }
vista.addEventListener('cancel', () => travar(false))

/* ============ Checkout ============ */
const ck = $('[data-checkout-dialog]')
const form = $('.checkout__form', ck)
let passo = 1

const frete = () => {
  const e = form.entrega.value
  if (e !== 'casa') return 0
  return sacola.total >= 800 ? 0 : 35
}
const desconto = () => (form.pag.value === 'pix' ? Math.round(sacola.total * 0.05 * 100) / 100 : 0)
const total = () => sacola.total + frete() - desconto()

function resumo() {
  $('[data-resumo-itens]', ck).innerHTML = sacola.itens
    .map(({ id, q }) => { const p = byId(id); return `<li><img src="${p.img}" alt="" width="48" height="60"><span>${q}× ${p.nome}</span><strong>${brl(p.preco * q)}</strong></li>` })
    .join('')
  $('[data-r-sub]', ck).textContent = brl(sacola.total)
  $('[data-r-frete]', ck).textContent = frete() === 0 ? 'Grátis' : brl(frete())
  $('[data-r-desc-linha]', ck).hidden = desconto() === 0
  $('[data-r-desc]', ck).textContent = '− ' + brl(desconto())
  $('[data-r-total]', ck).textContent = brl(total())
  $('[data-parcelas]', ck).innerHTML = [1, 2, 3, 4, 5, 6].map((n) => `<option value="${n}">${n}× de ${brl(total() / n)} sem juros</option>`).join('')
}

function irPara(n) {
  if (n > passo && !validar(passo)) return
  passo = n
  $$('[data-passo]', ck).forEach((f) => (f.hidden = +f.dataset.passo !== n))
  $$('[data-passo-ind]', ck).forEach((li) => {
    li.classList.toggle('atual', +li.dataset.passoInd === n)
    li.classList.toggle('feito', +li.dataset.passoInd < n)
  })
  const f = $(`[data-passo="${n}"]`, ck)
  if (!reduz) gsap.from(f, { x: 20, opacity: 0, duration: 0.5, ease: 'expo.out' })
  $('input, button', f)?.focus()
}

function validar(n) {
  const f = $(`[data-passo="${n}"]`, ck)
  let ok = true
  const reqs = $$('input[required]', f)
  if (n === 2 && form.entrega.value === 'casa') reqs.push(form.cep, form.rua, form.num, form.cidade)
  if (n === 3 && form.pag.value === 'cartao') reqs.push(form.cc, form.ccnome, form.ccval, form.cvv)
  reqs.forEach((i) => {
    let v = i.value.trim().length > 0
    if (i.type === 'email') v = /\S+@\S+\.\S+/.test(i.value)
    if (i.name === 'tel') v = i.value.replace(/\D/g, '').length >= 10
    if (i.name === 'cep') v = i.value.replace(/\D/g, '').length === 8
    if (i.name === 'cc') v = i.value.replace(/\D/g, '').length >= 15
    i.closest('.campo')?.classList.toggle('erro', !v)
    i.setAttribute('aria-invalid', String(!v))
    if (!v && ok) { i.focus(); ok = false }
  })
  return ok
}

function abrirCheckout() {
  if (sacola.qtd === 0) {
    document.querySelector('[data-abrir-sacola]')?.click()
    return
  }
  passo = 1
  form.reset()
  $('[data-confirmado]', ck).hidden = true
  $('.passos', ck).hidden = false
  $$('[data-passo]', ck).forEach((f) => (f.hidden = f.dataset.passo !== '1'))
  $$('[data-passo-ind]', ck).forEach((li) => { li.classList.toggle('atual', li.dataset.passoInd === '1'); li.classList.remove('feito') })
  $('.endereco', ck).hidden = true
  $('.pag-cartao', ck).hidden = true
  $('.pag-pix', ck).hidden = false
  resumo()
  ck.showModal()
  travar(true)
  if (!reduz) gsap.from('.checkout__casca', { y: 40, opacity: 0, duration: 0.7, ease: 'expo.out' })
}
const fecharCheckout = () => { ck.close(); travar(false); if (location.hash === '#checkout') history.replaceState(null, '', location.pathname + location.search) }

window.addEventListener('abrir-checkout', abrirCheckout)
ck.addEventListener('cancel', () => travar(false))
ck.addEventListener('click', (e) => {
  if (e.target === ck || e.target.closest('[data-fechar-checkout]')) return fecharCheckout()
  const ir = e.target.closest('[data-ir]')
  if (ir) irPara(+ir.dataset.ir)
  if (e.target.closest('[data-copiar-pix]')) {
    navigator.clipboard?.writeText('00020126360014BR.GOV.BCB.PIX0114CASAVIVIANDEMO5204000053039865802BR5911CASA VIVIAN6008VARGINHA62070503***6304DEMO').catch(() => {})
    e.target.closest('[data-copiar-pix]').textContent = 'Código copiado ✓'
  }
})
form.addEventListener('change', (e) => {
  if (e.target.name === 'entrega') $('.endereco', ck).hidden = e.target.value !== 'casa'
  if (e.target.name === 'pag') {
    $('.pag-cartao', ck).hidden = e.target.value !== 'cartao'
    $('.pag-pix', ck).hidden = e.target.value !== 'pix'
  }
  resumo()
})
form.addEventListener('submit', (e) => {
  e.preventDefault()
  if (!validar(3)) return
  const n = 'CV-' + String(Date.now()).slice(-5)
  const entregaTxt = { varginha: 'retirada em Varginha', divinopolis: 'retirada em Divinópolis', casa: 'entrega em casa' }[form.entrega.value]
  const itensTxt = sacola.itens.map(({ id, q }) => `${q}× ${byId(id).nome}`).join(', ')
  const totalTxt = brl(total())
  $$('[data-passo]', ck).forEach((f) => (f.hidden = true))
  $('.passos', ck).hidden = true
  $('[data-numero]', ck).textContent = `Pedido ${n}`
  $('[data-confirmado-texto]', ck).textContent = `Obrigada, ${form.nome.value.split(' ')[0]}! Recebemos ${itensTxt}, com ${entregaTxt}. Total de ${totalTxt}. A equipe confirma tudo pelo WhatsApp.`
  $('[data-confirmado-whats]', ck).href = linkWhats(`Olá! Fiz o pedido ${n} pelo site: ${itensTxt}. ${entregaTxt}, total ${totalTxt}.`)
  $('[data-confirmado]', ck).hidden = false
  if (!reduz) gsap.from('[data-confirmado] > *', { y: 20, opacity: 0, stagger: 0.07, duration: 0.7, ease: 'expo.out' })
  sacola.limpar()
})

/* máscaras simples */
const MASC = {
  tel: (v) => v.replace(/\D/g, '').slice(0, 11).replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2'),
  cep: (v) => v.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2'),
  cartao: (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '),
  validade: (v) => v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2'),
}
$$('[data-mascara]', ck).forEach((i) => i.addEventListener('input', () => { i.value = MASC[i.dataset.mascara](i.value) }))

/* QR de demonstração (padrão determinístico, não é um Pix real) */
;(function qr() {
  const svg = $('.pix__qr')
  let s = 7, r = ''
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const olho = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`
  for (let y = 0; y < 29; y++) for (let x = 0; x < 29; x++) {
    const canto = (x < 8 && y < 8) || (x > 20 && y < 8) || (x < 8 && y > 20)
    if (!canto && rnd() > 0.52) r += `<rect x="${x}" y="${y}" width="1" height="1"/>`
  }
  svg.innerHTML = `<rect width="29" height="29" fill="#fff"/><g fill="#1a0d10">${r}${olho(0, 0)}${olho(22, 0)}${olho(0, 22)}</g>`
})()

render(false)
iniciarMagneticos()
if (!reduz) {
  gsap.from('.loja__titulo', { yPercent: 30, opacity: 0, duration: 1.3, ease: 'expo.out' })
  gsap.from('.loja__sub, .loja__foto', { y: 20, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, delay: 0.15 })
  gsap.from('.produto', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.3, clearProps: 'all' })
}
if (location.hash === '#checkout') setTimeout(abrirCheckout, 300)
