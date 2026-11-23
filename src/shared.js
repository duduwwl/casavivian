import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { PRODUTOS, byId, brl, WHATS } from './data.js'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

export const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const $ = (s, el = document) => el.querySelector(s)
export const $$ = (s, el = document) => [...el.querySelectorAll(s)]

/* ---------- Rolagem suave ---------- */
export let lenis = null
export function iniciarRolagem() {
  if (reduz) return
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const alvo = a.getAttribute('href')
      if (alvo.length < 2 || !document.querySelector(alvo)) return
      e.preventDefault()
      fecharMenu()
      lenis.scrollTo(alvo, { offset: -64, duration: 1.4 })
    })
  )
}
export const travar = (sim) => {
  document.documentElement.classList.toggle('travado', sim)
  if (lenis) sim ? lenis.stop() : lenis.start()
}

/* ---------- Sacola (localStorage) ---------- */
const CHAVE = 'casavivian:sacola'
const ler = () => {
  try { return JSON.parse(localStorage.getItem(CHAVE)) || [] } catch { return [] }
}
let itens = ler().filter((i) => byId(i.id))
const ouvintes = new Set()
const salvar = () => {
  try { localStorage.setItem(CHAVE, JSON.stringify(itens)) } catch {}
  ouvintes.forEach((f) => f(itens))
}
export const sacola = {
  get itens() { return itens },
  get qtd() { return itens.reduce((s, i) => s + i.q, 0) },
  get total() { return itens.reduce((s, i) => s + byId(i.id).preco * i.q, 0) },
  add(id, q = 1) {
    const it = itens.find((i) => i.id === id)
    it ? (it.q += q) : itens.push({ id, q })
    salvar()
  },
  set(id, q) {
    itens = q <= 0 ? itens.filter((i) => i.id !== id) : itens.map((i) => (i.id === id ? { ...i, q } : i))
    salvar()
  },
  limpar() { itens = []; salvar() },
  ouvir(f) { ouvintes.add(f); f(itens) },
}

/* ---------- Gaveta da sacola ---------- */
const HTML_GAVETA = `
<div class="gaveta" id="gaveta" aria-hidden="true">
  <div class="gaveta__fundo" data-fechar></div>
  <aside class="gaveta__painel" role="dialog" aria-modal="true" aria-labelledby="gaveta-titulo">
    <header class="gaveta__topo">
      <h2 id="gaveta-titulo">Sua sacola</h2>
      <button class="icone-btn" data-fechar aria-label="Fechar sacola">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>
      </button>
    </header>
    <ul class="gaveta__lista"></ul>
    <div class="gaveta__vazia">
      <p>A sacola ainda está vazia.</p>
      <a class="pilula pilula--clara" href="produtos.html">Ver a loja</a>
    </div>
    <footer class="gaveta__pe">
      <div class="gaveta__total"><span>Subtotal</span><strong></strong></div>
      <p class="gaveta__nota">Retirada grátis em Varginha ou Divinópolis. Frete calculado no checkout.</p>
      <a class="pilula pilula--cheia pilula--larga" href="produtos.html#checkout" data-checkout>Finalizar compra</a>
    </footer>
  </aside>
</div>`

let ultimoFoco = null
export function abrirGaveta() {
  const g = $('#gaveta')
  ultimoFoco = document.activeElement
  g.classList.add('aberta')
  g.setAttribute('aria-hidden', 'false')
  travar(true)
  setTimeout(() => $('.gaveta__painel button', g)?.focus(), 50)
}
export function fecharGaveta() {
  const g = $('#gaveta')
  if (!g?.classList.contains('aberta')) return
  g.classList.remove('aberta')
  g.setAttribute('aria-hidden', 'true')
  travar(false)
  ultimoFoco?.focus?.()
}

export function iniciarSacola() {
  document.body.insertAdjacentHTML('beforeend', HTML_GAVETA)
  const g = $('#gaveta')
  g.addEventListener('click', (e) => {
    if (e.target.closest('[data-fechar]')) fecharGaveta()
    const b = e.target.closest('[data-q]')
    if (b) sacola.set(b.dataset.id, +b.dataset.q)
    const c = e.target.closest('[data-checkout]')
    if (c && location.pathname.includes('produtos')) {
      e.preventDefault()
      fecharGaveta()
      window.dispatchEvent(new Event('abrir-checkout'))
    }
  })
  document.addEventListener('keydown', (e) => e.key === 'Escape' && fecharGaveta())
  $$('[data-abrir-sacola]').forEach((b) => b.addEventListener('click', abrirGaveta))

  sacola.ouvir((lista) => {
    $$('[data-contador]').forEach((el) => {
      el.textContent = sacola.qtd
      el.hidden = sacola.qtd === 0
    })
    $('.gaveta__lista', g).innerHTML = lista
      .map(({ id, q }) => {
        const p = byId(id)
        return `<li class="linha-sacola">
          <img src="${p.img}" alt="" width="72" height="90" loading="lazy">
          <div>
            <p class="linha-sacola__nome">${p.nome}</p>
            <p class="linha-sacola__preco">${brl(p.preco)} <span>/ ${p.unidade}</span></p>
            <div class="qtd" aria-label="Quantidade de ${p.nome}">
              <button data-id="${id}" data-q="${q - 1}" aria-label="Diminuir">−</button>
              <span>${q}</span>
              <button data-id="${id}" data-q="${q + 1}" aria-label="Aumentar">+</button>
            </div>
          </div>
          <button class="linha-sacola__tirar" data-id="${id}" data-q="0">Remover</button>
        </li>`
      })
      .join('')
    g.classList.toggle('vazia', lista.length === 0)
    $('.gaveta__total strong', g).textContent = brl(sacola.total)
  })
}

/* ---------- Aviso (toast) ---------- */
export function avisar(texto) {
  let t = $('.aviso')
  if (!t) {
    t = document.createElement('div')
    t.className = 'aviso'
    t.setAttribute('role', 'status')
    document.body.appendChild(t)
  }
  t.innerHTML = texto
  t.classList.add('visivel')
  clearTimeout(t._t)
  t._t = setTimeout(() => t.classList.remove('visivel'), 2600)
}

export function adicionar(id, botao) {
  sacola.add(id)
  const p = byId(id)
  avisar(`<strong>${p.nome}</strong> foi para a sacola. <button data-abrir-sacola-aviso>Ver sacola</button>`)
  $('[data-abrir-sacola-aviso]')?.addEventListener('click', abrirGaveta)
  if (botao && !reduz) {
    gsap.fromTo(botao, { scale: 0.92 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' })
    $$('[data-contador]').forEach((c) => gsap.fromTo(c, { scale: 1.6 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }))
  }
}

/* ---------- Menu do celular ---------- */
export function fecharMenu() {
  const m = $('#menu')
  if (!m?.classList.contains('aberto')) return
  m.classList.remove('aberto')
  $('.nav__menu')?.setAttribute('aria-expanded', 'false')
  travar(false)
}
export function iniciarMenu() {
  const b = $('.nav__menu')
  const m = $('#menu')
  if (!b || !m) return
  b.addEventListener('click', () => {
    const abre = !m.classList.contains('aberto')
    m.classList.toggle('aberto', abre)
    b.setAttribute('aria-expanded', String(abre))
    travar(abre)
  })
  $$('a', m).forEach((a) => a.addEventListener('click', fecharMenu))
  document.addEventListener('keydown', (e) => e.key === 'Escape' && fecharMenu())
}

/* ---------- Nav que reage à rolagem ---------- */
export function iniciarNav() {
  const nav = $('.nav')
  let ultimo = 0
  const f = () => {
    const y = window.scrollY
    nav.classList.toggle('nav--solida', y > 40)
    nav.classList.toggle('nav--escondida', y > 400 && y > ultimo + 4 && !$('#menu')?.classList.contains('aberto'))
    if (y < ultimo - 4) nav.classList.remove('nav--escondida')
    ultimo = y
  }
  window.addEventListener('scroll', f, { passive: true })
  f()
}

/* ---------- Entradas ---------- */
export function iniciarEntradas(raiz = document) {
  const grupos = $$('[data-entra]', raiz)
  if (reduz) return
  grupos.forEach((g) => {
    const filhos = g.dataset.entra === 'filhos' ? [...g.children] : [g]
    gsap.set(filhos, { y: 28, opacity: 0 })
    ScrollTrigger.create({
      trigger: g,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(filhos, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.08 }),
    })
  })
  // títulos: linha a linha, subindo de dentro de uma máscara
  $$('[data-titulo]', raiz).forEach((t) => {
    const linhas = t.querySelectorAll('.l > span')
    if (!linhas.length) return
    gsap.set(linhas, { yPercent: 105 })
    ScrollTrigger.create({
      trigger: t,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(linhas, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09 }),
    })
  })
}

/* ---------- Botões magnéticos (só com mouse) ---------- */
export function iniciarMagneticos() {
  if (reduz || !matchMedia('(hover: hover)').matches) return
  $$('[data-magnetico]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - r.left - r.width / 2) * 0.25)
      yTo((e.clientY - r.top - r.height / 2) * 0.3)
    })
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0) })
  })
}

export const linkWhats = (texto, numero = WHATS) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`

export { PRODUTOS, brl, byId }
