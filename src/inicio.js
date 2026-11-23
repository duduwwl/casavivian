import {
  gsap, ScrollTrigger, reduz, $, $$, iniciarRolagem, iniciarSacola, iniciarMenu, iniciarNav,
  iniciarEntradas, iniciarMagneticos, adicionar, linkWhats, brl, byId, PRODUTOS, sacola, avisar, abrirGaveta,
} from './shared.js'
import { CATEGORIAS } from './data.js'

iniciarRolagem()
iniciarSacola()
iniciarMenu()
iniciarNav()

/* ============ HERO: entrar no quadro ============ */
function hero() {
  const quadro = $('.quadro')
  const moldura = $('.quadro__moldura')
  if (reduz) {
    document.documentElement.classList.add('sem-movimento')
    return
  }
  // entrada
  gsap.from('.quadro', { opacity: 0, y: 30, duration: 1.6, ease: 'expo.out', delay: 0.1 })
  gsap.from('.hero__titulo', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', delay: 0.25 })
  gsap.from('.hero__texto > *', { y: 20, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.45 })
  gsap.from('.placa', { opacity: 0, x: -10, duration: 1, delay: 0.9 })

  const escala = () => {
    const r = moldura.getBoundingClientRect()
    const w = r.width / (gsap.getProperty(quadro, 'scale') || 1)
    const h = r.height / (gsap.getProperty(quadro, 'scale') || 1)
    return Math.max(innerWidth / w, innerHeight / h) * 1.06
  }
  const desloc = () => {
    // leva o centro do quadro ao centro da tela
    const r = quadro.getBoundingClientRect()
    const s = gsap.getProperty(quadro, 'y') || 0
    return innerHeight / 2 - (r.top - s + moldura.offsetHeight / 2)
  }

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.hero__trilha',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  })
  tl.to('.hero__conteudo', { opacity: 0, y: -40, duration: 0.25 }, 0)
    .to('.placa', { opacity: 0, duration: 0.12 }, 0)
    .to(quadro, { scale: escala, y: desloc, duration: 0.6, ease: 'power2.inOut' }, 0.02)
    .to('.quadro__moldura', { '--borda': '0px', duration: 0.4 }, 0.15)
    .to('.galeria', { opacity: 0.4, duration: 0.5 }, 0.1)
    .to('.hero__veu', { opacity: 1, duration: 0.2 }, 0.62)
    .fromTo('.hero__frase', { opacity: 0, y: 30, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.18 }, 0.66)
    .to('.hero__frase', { opacity: 1, duration: 0.16 })
}

/* ============ SALAS ============ */
const FOTO_SALA = {
  loucas: ['img/pratos-parede.webp', 'Pratos pintados à mão na parede branca'],
  tacas: ['img/tacas-ambar.webp', 'Taças de cristal âmbar sobre mesa posta'],
  vasos: ['img/vasos-listras-verdes.webp', 'Cachepôs listrados verdes e moringas de terracota'],
  iluminacao: ['img/loja-orquideas.webp', 'Abajur de porcelana azul ao lado de garrafas listradas'],
  texteis: ['img/poltrona.webp', 'Poltrona vermelha com almofada de crochê'],
  aromas: ['img/difusores.webp', 'Difusores em cesto de fibra natural'],
  presentes: ['img/caixas-presente.webp', 'Caixas kraft com fita bordô'],
  datas: ['img/pascoa-coelho.webp', 'Coelho de porcelana com flores amarelas'],
}

function salas() {
  const lista = $('.salas__lista')
  const fotos = $('.salas__fotos')
  const painel = $('.salas__painel')

  lista.innerHTML = CATEGORIAS.map(
    (c, i) => `<button role="tab" id="sala-${c.id}" aria-selected="${i === 0}" data-sala="${c.id}">
      <span class="sala__nome">${c.nome}</span>
      <span class="sala__qtd">${(n => n + (n === 1 ? ' peça' : ' peças'))(PRODUTOS.filter((p) => p.cat === c.id).length)}</span>
    </button>`
  ).join('')
  fotos.innerHTML = CATEGORIAS.map(
    (c, i) => `<img src="${FOTO_SALA[c.id][0]}" alt="${FOTO_SALA[c.id][1]}" data-foto="${c.id}" class="${i === 0 ? 'ativa' : ''}" loading="${i < 2 ? 'eager' : 'lazy'}">`
  ).join('')

  const mostrar = (id) => {
    const c = CATEGORIAS.find((x) => x.id === id)
    $$('[data-sala]', lista).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.sala === id)))
    $$('[data-foto]', fotos).forEach((im) => im.classList.toggle('ativa', im.dataset.foto === id))
    const itens = PRODUTOS.filter((p) => p.cat === id).slice(0, 3)
    painel.setAttribute('aria-labelledby', `sala-${id}`)
    painel.innerHTML = `
      <p class="salas__linha">${c.linha}</p>
      <ul class="mini">
        ${itens.map((p) => `<li>
          <img src="${p.img}" alt="" width="64" height="80" loading="lazy">
          <div><p class="mini__nome">${p.nome}</p><p class="mini__preco">${brl(p.preco)} <span>/ ${p.unidade}</span></p></div>
          <button class="mais" data-add="${p.id}" aria-label="Adicionar ${p.nome} à sacola">+</button>
        </li>`).join('')}
      </ul>
      <a class="link-seta" href="produtos.html?cat=${id}">Ver tudo em ${c.nome.toLowerCase()} <span aria-hidden="true">→</span></a>`
    if (!reduz) gsap.from($$('li, .salas__linha, .link-seta', painel), { y: 14, opacity: 0, duration: 0.6, ease: 'expo.out', stagger: 0.05 })
  }

  lista.addEventListener('click', (e) => {
    const b = e.target.closest('[data-sala]')
    if (b) mostrar(b.dataset.sala)
  })
  if (matchMedia('(hover: hover)').matches) {
    lista.addEventListener('pointerover', (e) => {
      const b = e.target.closest('[data-sala]')
      if (b && b.getAttribute('aria-selected') !== 'true') mostrar(b.dataset.sala)
    })
  }
  lista.addEventListener('keydown', (e) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return
    e.preventDefault()
    const bs = $$('[data-sala]', lista)
    const i = bs.indexOf(document.activeElement)
    const n = bs[(i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length]
    n.focus(); mostrar(n.dataset.sala)
  })
  painel.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]')
    if (b) adicionar(b.dataset.add, b)
  })
  mostrar(CATEGORIAS[0].id)
}

/* ============ MESA POSTA ============ */
const SLOTS = {
  louca: ['prato-toile', 'pratos-pintados'],
  centro: ['potiches-azuis', 'vaso-vermelho', 'cachepo-ambar', 'coelho-porcelana'],
  toque: ['tacas-ambar', 'kit-aromas', 'garrafas-listradas'],
}
function mesa() {
  const escolha = { louca: SLOTS.louca[0], centro: SLOTS.centro[0], toque: SLOTS.toque[0] }
  Object.entries(SLOTS).forEach(([slot, ids]) => {
    $(`[data-slot="${slot}"]`).innerHTML = ids
      .map((id, i) => {
        const p = byId(id)
        return `<label class="opcao">
          <input type="radio" name="${slot}" value="${id}" ${i === 0 ? 'checked' : ''}>
          <img src="${p.img}" alt="" width="56" height="56" loading="lazy">
          <span>${p.nome}<small>${brl(p.preco)}</small></span>
        </label>`
      })
      .join('')
  })

  const render = (slotMudou) => {
    let total = 0
    Object.entries(escolha).forEach(([slot, id]) => {
      const p = byId(id)
      total += p.preco
      const fig = $(`[data-pos="${slot}"]`)
      const img = $('img', fig)
      if (img.getAttribute('src') !== p.img) {
        img.src = p.img
        img.alt = p.nome
        $('figcaption', fig).textContent = p.nome
        if (slot === slotMudou && !reduz) gsap.fromTo(fig, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.out' })
      }
    })
    $('[data-total]').textContent = brl(total)
    const nomes = Object.values(escolha).map((id) => byId(id).nome).join(', ')
    $('[data-consultoria]').href = linkWhats(`Olá, Casa Vivian! Montei uma mesa pelo site: ${nomes}. Quero ajuda para completar.`)
  }
  $('.mesa__escolhas').addEventListener('change', (e) => {
    escolha[e.target.name] = e.target.value
    render(e.target.name)
  })
  $('[data-levar]').addEventListener('click', (e) => {
    const ids = Object.values(escolha)
    ids.slice(0, -1).forEach((id) => sacola.add(id))
    adicionar(ids[ids.length - 1], e.currentTarget)
    avisar('<strong>Sua mesa</strong> foi para a sacola: três peças. <button data-abrir-sacola-aviso>Ver sacola</button>')
    $('[data-abrir-sacola-aviso]')?.addEventListener('click', abrirGaveta)
  })
  render()
}

/* ============ ENCONTROS: trilho horizontal ============ */
function encontros() {
  const rolo = $('.encontros__rolo')
  const mm = gsap.matchMedia()
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const dist = () => Math.max(0, rolo.scrollWidth - innerWidth + 48)
    $('.encontros__trilha').style.height = `calc(100svh + ${dist()}px)`
    const tw = gsap.to(rolo, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.encontros__trilha', start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true,
        onRefreshInit: () => { $('.encontros__trilha').style.height = `calc(100svh + ${dist()}px)` },
      },
    })
    $$('.obra__img img', rolo).forEach((im) =>
      gsap.fromTo(im, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: im, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } })
    )
    return () => { $('.encontros__trilha').style.height = '' }
  })
}

/* ============ VISITE ============ */
const LOJAS = {
  varginha: { cidade: 'Varginha, MG', tel: '(35) 91002-6352', telHref: 'tel:+5535910026352', whats: '5535910026352', q: 'Casa Vivian Varginha MG' },
  divinopolis: { cidade: 'Divinópolis, MG · CEP 35500-443', tel: '(37) 99129-2900', telHref: 'tel:+5537991292900', whats: '5537991292900', q: 'Casa Vivian Divinópolis MG 35500-443' },
}
function visite() {
  $$('[data-loja]').forEach((b) =>
    b.addEventListener('click', () => {
      const l = LOJAS[b.dataset.loja]
      $$('[data-loja]').forEach((x) => x.setAttribute('aria-selected', String(x === b)))
      $('[data-campo="cidade"]').textContent = l.cidade
      const tel = $('[data-campo="tel"]'); tel.textContent = l.tel; tel.href = l.telHref
      $('[data-campo="whats"]').href = `https://wa.me/${l.whats}`
      $('[data-campo="rota"]').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.q)}`
      $('[data-campo="mapa"]').src = `https://www.google.com/maps?q=${encodeURIComponent(l.q)}&output=embed`
      if (!reduz) gsap.from('.loja-dados dl > div', { y: 10, opacity: 0, stagger: 0.05, duration: 0.5, ease: 'expo.out' })
    })
  )
}

/* ============ Paralaxe leve e faixa ============ */
function detalhes() {
  if (reduz) return
  $$('[data-paralaxe]').forEach((im) =>
    gsap.fromTo(im, { yPercent: -6, scale: 1.12 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
  )
  const trilho = $('.faixa__trilho')
  const t = gsap.to(trilho, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 })
  ScrollTrigger.create({ onUpdate: (s) => t.timeScale(1 + Math.min(4, Math.abs(s.getVelocity()) / 400)) })
  gsap.from('.rodape__marca', { yPercent: 30, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.rodape', start: 'top 85%' } })
}

hero()
salas()
mesa()
encontros()
visite()
iniciarEntradas()
iniciarMagneticos()
detalhes()
window.addEventListener('load', () => ScrollTrigger.refresh())
