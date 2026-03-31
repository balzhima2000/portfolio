(function () {

  const cursorRoot = document.createElement("div")
  cursorRoot.id = "harmonic-cursor-root"

  const initialHue = Math.random() * 360

  cursorRoot.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: hsl(${initialHue}, 90%, 55%);
    pointer-events: none;
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
  `

  const mid = document.createElement("div")
  mid.style.cssText = `
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: hsl(${(initialHue + 40) % 360}, 85%, 60%);
    filter: blur(0.8px);
    display: flex;
    align-items: center;
    justify-content: center;
  `

  const inner = document.createElement("div")
  inner.style.cssText = `
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: hsl(${(initialHue + 90) % 360}, 80%, 65%);
    filter: blur(0.3px);
  `

  mid.appendChild(inner)
  cursorRoot.appendChild(mid)
  document.body.appendChild(cursorRoot)

  const isTouch = () => window.matchMedia('(hover: none)').matches

  let lastHue = initialHue
  let cycles = 0
  let isHovering = false
  let isCycling = false
  let rotation = 0
  let suppressCursor = false

  const setColors = (h1, h2, h3) => {
    cursorRoot.style.background = `hsl(${h1}, 90%, 55%)`
    mid.style.background = `hsl(${h2}, 85%, 60%)`
    inner.style.background = `hsl(${h3}, 80%, 65%)`
  }

  const stopCycleImmediate = () => {
    isHovering = false
    isCycling = false
    cancelAnimationFrame(cycles)
    rotation = 0
    cursorRoot.style.transform = `translate(${cursorRoot._x}px, ${cursorRoot._y}px) rotate(0deg)`
  }

  const startCycle = () => {
    isHovering = true
    if (isCycling) return
    isCycling = true
    const cycle = () => {
      if (!isHovering) { isCycling = false; return }
      lastHue = (lastHue + 2.5) % 360
      rotation = (rotation + 3) % 360
      setColors(lastHue, (lastHue + 40) % 360, (lastHue + 90) % 360)
      cursorRoot.style.transform = `translate(${cursorRoot._x}px, ${cursorRoot._y}px) rotate(${rotation}deg)`
      cycles = requestAnimationFrame(cycle)
    }
    cycles = requestAnimationFrame(cycle)
  }

  const stopCycle = (e) => {
    const related = e.relatedTarget
    const current = e.currentTarget
    if (current.contains(related)) return
    stopCycleImmediate()
  }

  const onMove = (e) => {
    if (isTouch()) return
    if (suppressCursor) {
      cursorRoot.style.display = 'none'
      return
    }
    cursorRoot._x = e.clientX + 4
    cursorRoot._y = e.clientY + 16
    cursorRoot.style.display = 'flex'
    cursorRoot.style.transform = `translate(${cursorRoot._x}px, ${cursorRoot._y}px) rotate(${rotation}deg)`
  }

  const onClick = () => {
    if (isTouch()) return
    stopCycleImmediate()
    let hue
    do { hue = Math.random() * 360 } while (Math.abs(hue - lastHue) < 60)
    lastHue = hue
    setColors(
      hue,
      (hue + 30 + Math.random() * 40) % 360,
      (hue + 70 + Math.random() * 50) % 360,
    )
  }

  const attached = new Set()
  const attachListeners = () => {
    const els = document.querySelectorAll('a:not(.under-construction), button, span[style*="cursor"], [role="button"], .archive-img, .archive-item video')
    els.forEach((el) => {
      if (attached.has(el)) return
      el.addEventListener("mouseenter", startCycle)
      el.addEventListener("mouseleave", stopCycle)
      attached.add(el)
    })
  }

  const attachUnderConstructionListeners = () => {
    const blockedCards = document.querySelectorAll('.work-card.under-construction')
    blockedCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        suppressCursor = true
        stopCycleImmediate()
        cursorRoot.style.display = 'none'
      })

      card.addEventListener("mouseleave", () => {
        suppressCursor = false
      })
    })
  }

  attachListeners()
  attachUnderConstructionListeners()
  const t = setTimeout(attachListeners, 1000)

  window.addEventListener("mousemove", onMove)
  window.addEventListener("click", onClick)

  window.addEventListener("beforeunload", () => {
    window.removeEventListener("mousemove", onMove)
    window.removeEventListener("click", onClick)
    cancelAnimationFrame(cycles)
    clearTimeout(t)
  })
})()
