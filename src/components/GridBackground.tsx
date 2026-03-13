import { useEffect, useRef } from 'react'

interface Spark {
  x: number
  y: number
  alpha: number
  decay: number
}

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const SPACING = 38
    const DOT_R = 1.2
    const SPARK_R = 2.2
    const SPARK_INTERVAL = reduced ? Infinity : 320   // ms between random sparks
    const SPARK_DECAY = 0.022
    const LINE_DIST = SPACING * 1.6

    let cols = 0
    let rows = 0
    let sparks: Spark[] = []
    let lastSpark = 0
    let raf = 0

    function resize() {
      canvas!.width = canvas!.offsetWidth * devicePixelRatio
      canvas!.height = canvas!.offsetHeight * devicePixelRatio
      ctx!.scale(devicePixelRatio, devicePixelRatio)
      cols = Math.ceil(canvas!.offsetWidth / SPACING) + 2
      rows = Math.ceil(canvas!.offsetHeight / SPACING) + 2
    }

    function addSpark() {
      const gx = Math.floor(Math.random() * cols)
      const gy = Math.floor(Math.random() * rows)
      sparks.push({
        x: gx * SPACING - SPACING / 2,
        y: gy * SPACING - SPACING / 2,
        alpha: 1,
        decay: SPARK_DECAY + Math.random() * 0.012,
      })
      // occasionally add a second nearby spark for a "handoff" effect
      if (Math.random() < 0.35) {
        const offsets = [[-1,0],[1,0],[0,-1],[0,1]]
        const [ox, oy] = offsets[Math.floor(Math.random() * offsets.length)]
        sparks.push({
          x: (gx + ox) * SPACING - SPACING / 2,
          y: (gy + oy) * SPACING - SPACING / 2,
          alpha: 0.7,
          decay: SPARK_DECAY + Math.random() * 0.018,
        })
      }
    }

    function draw(t: number) {
      const W = canvas!.offsetWidth
      const H = canvas!.offsetHeight
      ctx!.clearRect(0, 0, W, H)

      // ── spawn sparks ──────────────────────────────────────────────────────
      if (t - lastSpark > SPARK_INTERVAL) {
        addSpark()
        lastSpark = t
      }

      // ── age sparks ────────────────────────────────────────────────────────
      sparks = sparks.filter((s) => s.alpha > 0.01)
      for (const s of sparks) s.alpha -= s.decay

      // build a quick lookup for spark alphas at grid positions
      const sparkMap = new Map<string, number>()
      for (const s of sparks) {
        const key = `${Math.round(s.x / SPACING)},${Math.round(s.y / SPACING)}`
        const prev = sparkMap.get(key) ?? 0
        if (s.alpha > prev) sparkMap.set(key, s.alpha)
      }

      // ── draw connection lines between bright spark neighbors ──────────────
      ctx!.lineWidth = 0.6
      for (const s of sparks) {
        if (s.alpha < 0.25) continue
        for (const s2 of sparks) {
          if (s2 === s) continue
          const dx = s.x - s2.x
          const dy = s.y - s2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINE_DIST) {
            const lineAlpha = Math.min(s.alpha, s2.alpha) * (1 - dist / LINE_DIST) * 0.55
            ctx!.strokeStyle = `rgba(247,147,26,${lineAlpha})`
            ctx!.beginPath()
            ctx!.moveTo(s.x, s.y)
            ctx!.lineTo(s2.x, s2.y)
            ctx!.stroke()
          }
        }
      }

      // ── draw dots ─────────────────────────────────────────────────────────
      const cx = W / 2
      const cy = H / 2
      const maxDist = Math.sqrt(cx * cx + cy * cy)

      for (let gx = 0; gx < cols; gx++) {
        for (let gy = 0; gy < rows; gy++) {
          const x = gx * SPACING - SPACING / 2
          const y = gy * SPACING - SPACING / 2

          // edge fade
          const dx = x - cx
          const dy = y - cy
          const edgeFade = 1 - Math.pow(Math.sqrt(dx * dx + dy * dy) / maxDist, 1.6)
          if (edgeFade <= 0) continue

          // slow wave
          const wave = reduced
            ? 0
            : (Math.sin(gx * 0.38 + t * 0.0008) + Math.sin(gy * 0.42 + t * 0.0006)) * 0.5

          // spark influence
          const key = `${gx},${gy}`
          const sparkAlpha = sparkMap.get(key) ?? 0

          if (sparkAlpha > 0.01) {
            // glowing orange dot
            const glow = ctx!.createRadialGradient(x, y, 0, x, y, SPARK_R * 4)
            glow.addColorStop(0, `rgba(247,147,26,${sparkAlpha * edgeFade * 0.9})`)
            glow.addColorStop(1, `rgba(247,147,26,0)`)
            ctx!.fillStyle = glow
            ctx!.beginPath()
            ctx!.arc(x, y, SPARK_R * 4, 0, Math.PI * 2)
            ctx!.fill()

            ctx!.fillStyle = `rgba(255,200,100,${sparkAlpha * edgeFade})`
            ctx!.beginPath()
            ctx!.arc(x, y, SPARK_R, 0, Math.PI * 2)
            ctx!.fill()
          } else {
            // base dot with subtle wave brightness
            const brightness = 0.08 + wave * 0.04
            ctx!.fillStyle = `rgba(255,255,255,${brightness * edgeFade})`
            ctx!.beginPath()
            ctx!.arc(x, y, DOT_R, 0, Math.PI * 2)
            ctx!.fill()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
