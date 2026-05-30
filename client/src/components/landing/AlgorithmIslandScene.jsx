/**
 * AlgorithmIslandScene
 *
 * A React Three Fiber scene featuring:
 * - Procedural floating island with DSA topic zones
 * - Glowing markers for each DSA topic
 * - Star field + aurora borealis background
 * - Slow rotation + mouse parallax
 * - Bloom postprocessing for glow
 * - Device tier adaptation
 *
 * Part of Phase 1 — Algorithm Island 3D Landing Page
 */

import { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Stars,
  Float,
  Sparkles,
  MeshDistortMaterial,
  Environment,
  AdaptiveDpr,
  AdaptiveEvents,
} from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

// ─── Constants ──────────────────────────────────────────────
const PRIMARY = new THREE.Color('#6366f1')
const ACCENT = new THREE.Color('#8b5cf6')
const ZONE_COLORS = {
  Arrays:       '#10b981', // Emerald
  LinkedList:   '#f59e0b', // Amber
  Stack:        '#f97316', // Orange
  Trees:        '#22d3ee', // Cyan
  Graphs:       '#a78bfa', // Purple
  DP:           '#ec4899', // Pink
}

const ZONE_POSITIONS = [
  { x: -0.5, z: -0.3 }, // Arrays
  { x:  0.6, z: -0.2 }, // LinkedList
  { x: -0.3, z:  0.5 }, // Stack
  { x:  0.4, z:  0.4 }, // Trees
  { x: -0.1, z: -0.5 }, // Graphs
  { x:  0.1, z:  0.0 }, // DP (center)
]

// ─── Procedural Island Mesh ─────────────────────────────────
function IslandMesh({ tier, reducedMotion }) {
  const meshRef = useRef()

  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(1.8, 2.2, 0.3, 48, 8)
    const pos = geo.attributes.position

    // Add terrain bumps
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      const dist = Math.sqrt(x * x + z * z)

      // Only deform top vertices (y > 0) and keep edges
      if (y > 0 && dist > 0.3) {
        const bump = Math.sin(x * 8) * Math.cos(z * 8) * 0.04 +
                     Math.sin(x * 12 + z * 10) * 0.02
        pos.setY(i, y + bump)
      }

      // Add slight random variation
      if (y > 0) {
        const noise = Math.sin(x * 15 + z * 13) * 0.03
        pos.setY(i, y + noise)
      }
    }

    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return
    // Gentle floating rotation
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.03) * 0.05
  })

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow>
      <MeshDistortMaterial
        color="#1a1a2e"
        metalness={0.3}
        roughness={0.7}
        distort={reducedMotion ? 0 : 0.05}
        speed={reducedMotion ? 0 : 0.5}
      />
    </mesh>
  )
}

// ─── Island Ring (glowing ring around the island) ────────────
function IslandRing({ reducedMotion }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current || reducedMotion) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.15
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.03
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
      <ringGeometry args={[2.0, 2.15, 64]} />
      <meshBasicMaterial color={PRIMARY} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ─── DSA Zone Marker ─────────────────────────────────────────
function ZoneMarker({ position, color, type, index, reducedMotion }) {
  const meshRef = useRef()
  const colorObj = useMemo(() => new THREE.Color(color), [color])

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return
    meshRef.current.rotation.y += 0.01
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.03
  })

  const getShape = () => {
    switch (type) {
      case 'Arrays':
        return <boxGeometry args={[0.08, 0.18, 0.08]} />
      case 'LinkedList':
        return <sphereGeometry args={[0.06, 8, 8]} />
      case 'Stack':
        return <cylinderGeometry args={[0.05, 0.08, 0.15, 8]} />
      case 'Trees':
        return <coneGeometry args={[0.08, 0.16, 6]} />
      case 'Graphs':
        return <octahedronGeometry args={[0.07]} />
      case 'DP':
        return <dodecahedronGeometry args={[0.06]} />
      default:
        return <boxGeometry args={[0.08, 0.08, 0.08]} />
    }
  }

  return (
    <group position={position}>
      {/* Glow halo */}
      <mesh position={[0, 0.02, 0]}>
        <circleGeometry args={[0.12, 16]} />
        <meshBasicMaterial color={colorObj} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Main shape */}
      <Float speed={reducedMotion ? 0 : 1.5} rotationIntensity={reducedMotion ? 0 : 0.5} floatIntensity={reducedMotion ? 0 : 0.3}>
        <mesh ref={meshRef} castShadow>
          {getShape()}
          <meshStandardMaterial
            color={colorObj}
            emissive={colorObj}
            emissiveIntensity={1.5}
            metalness={0.3}
            roughness={0.3}
          />
        </mesh>
      </Float>
    </group>
  )
}

// ─── Aurora Borealis ────────────────────────────────────────
function Aurora({ reducedMotion }) {
  const meshRef = useRef()

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(12, 4, 32, 16)
    const pos = geo.attributes.position

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      pos.setZ(i, Math.sin(x * 0.8) * 0.3 + Math.sin(x * 0.3 + y * 0.5) * 0.2)
    }

    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return
    const pos = meshRef.current.geometry.attributes.position
    const time = state.clock.elapsedTime
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = Math.sin(x * 0.8 + time * 0.15) * 0.3 +
               Math.sin(x * 0.3 + y * 0.5 + time * 0.1) * 0.2
      pos.setZ(i, z)
    }
    pos.needsUpdate = true
    meshRef.current.position.y = Math.sin(time * 0.1) * 0.2
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, 2, -3]}
      rotation={[0.3, 0, 0.1]}
    >
      <meshBasicMaterial
        color={ACCENT}
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Floating Particles ─────────────────────────────────────
function IslandParticles({ count = 200 }) {
  return (
    <Sparkles
      count={count}
      scale={[4, 1, 4]}
      size={0.02}
      speed={0.3}
      noise={0.5}
      color={PRIMARY}
      opacity={0.4}
    />
  )
}

// ─── Mouse Parallax Controller ──────────────────────────────
function ParallaxController({ children, reducedMotion }) {
  const groupRef = useRef()
  const mouseTarget = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (reducedMotion) return

    const handleMouse = (e) => {
      mouseTarget.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 0.06,
        y: (e.clientY / window.innerHeight - 0.5) * 0.04,
      }
    }

    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [reducedMotion])

  useFrame(() => {
    if (!groupRef.current || reducedMotion) return
    // Smooth interpolation
    currentPos.current.x += (mouseTarget.current.x - currentPos.current.x) * 0.05
    currentPos.current.y += (mouseTarget.current.y - currentPos.current.y) * 0.05

    groupRef.current.rotation.x = currentPos.current.y * 0.5
    groupRef.current.rotation.z = -currentPos.current.x * 0.5
    groupRef.current.position.x = currentPos.current.x * 0.3
    groupRef.current.position.y = currentPos.current.y * 0.3
  })

  return <group ref={groupRef}>{children}</group>
}

// ─── Scene Content ──────────────────────────────────────────
function SceneContent({ tier, reducedMotion }) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0.8, 3.2)
    camera.lookAt(0, 0, 0)
  }, [camera])

  const particlesCount = reducedMotion ? 0 : (tier === 'low' ? 0 : tier === 'mid' ? 100 : 400)
  const enableBloom = !reducedMotion && tier !== 'low'
  const enableChromaticAberration = !reducedMotion && tier === 'high'

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
      <pointLight position={[-3, 4, 2]} intensity={0.5} color={PRIMARY} />
      <pointLight position={[3, 2, -3]} intensity={0.3} color={ACCENT} />

      {/* Background stars */}
      <Stars
        radius={30}
        depth={50}
        count={tier === 'mid' ? 1000 : 2000}
        factor={4}
        saturation={0.5}
        fade
        speed={reducedMotion ? 0 : 0.5}
      />

      {/* Aurora */}
      {tier === 'high' && <Aurora reducedMotion={reducedMotion} />}

      {/* Parallax island group */}
      <ParallaxController reducedMotion={reducedMotion}>
        {/* Island */}
        <group position={[0, -0.2, 0]}>
          {/* Base glow under island */}
          <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.3, 32]} />
            <meshBasicMaterial color={PRIMARY} transparent opacity={0.06} />
          </mesh>

          {/* Main island */}
          <IslandMesh tier={tier} reducedMotion={reducedMotion} />

          {/* Glowing ring */}
          <IslandRing reducedMotion={reducedMotion} />

          {/* DSA Zone markers */}
          {ZONE_POSITIONS.map((pos, i) => {
            const types = Object.keys(ZONE_COLORS)
            const type = types[i]
            return (
              <ZoneMarker
                key={type}
                position={[pos.x, 0.08, pos.z]}
                color={ZONE_COLORS[type]}
                type={type}
                index={i}
                reducedMotion={reducedMotion}
              />
            )
          })}

          {/* Floating particles around island */}
          {particlesCount > 0 && <IslandParticles count={particlesCount} />}
        </group>
      </ParallaxController>

      {/* Postprocessing */}
      {enableBloom && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            intensity={0.8}
            blendFunction={BlendFunction.SCREEN}
          />
          {enableChromaticAberration && (
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.002, 0.0005]}
            />
          )}
        </EffectComposer>
      )}
    </>
  )
}

// ─── Main Scene Component ───────────────────────────────────
export default function AlgorithmIslandScene({ tier = 'mid', reducedMotion = false }) {
  const dpr = useMemo(() => {
    if (tier === 'low') return 0.75
    if (tier === 'mid') return 1
    return Math.min(2, window.devicePixelRatio || 1.5)
  }, [tier])

  return (
    <Canvas
      camera={{ position: [0, 0.8, 3.2], fov: 45, near: 0.1, far: 50 }}
      dpr={dpr}
      gl={{
        antialias: tier !== 'low',
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      shadows={tier === 'high'}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <Suspense fallback={null}>
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <SceneContent tier={tier} reducedMotion={reducedMotion} />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  )
}
