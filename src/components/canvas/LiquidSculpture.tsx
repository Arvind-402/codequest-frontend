import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LiquidSculptureProps {
  className?: string;
  intensity?: number;
  interactive?: boolean;
}

export const LiquidSculpture: React.FC<LiquidSculptureProps> = ({
  className = '',
  intensity = 1.0,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setHasWebGL(false);
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animationFrameId: number;

    try {
      scene = new THREE.Scene();

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 7.2);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);

      // --- GLSL Simplex Noise Shaders ---
      const vertexShader = `
        uniform float uTime;
        uniform float uSpeed;
        uniform float uNoiseDensity;
        uniform float uNoiseStrength;
        uniform vec2 uMouse;

        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        varying float vNoise;

        // Simplex 3D noise
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

        float snoise(vec3 v){
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);

          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);

          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

          i = mod(i, 289.0);
          vec4 p = permute(permute(permute(
                     i.z + vec4(0.0, i1.z, i2.z, 1.0))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0));

          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);

          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);

          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);

          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));

          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);

          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;

          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          float t = uTime * uSpeed;
          
          vec3 noisePos = position * uNoiseDensity + vec3(t * 0.35, t * 0.28, t * 0.42);
          float n1 = snoise(noisePos);
          float n2 = snoise(noisePos * 2.1 + vec3(t * 0.15)) * 0.5;
          float noise = (n1 + n2) * uNoiseStrength;

          float mouseDist = length(position.xy - uMouse * 2.0);
          float mousePush = smoothstep(2.5, 0.0, mouseDist) * 0.25;

          vec3 displaced = position + normal * (noise + mousePush);

          float eps = 0.015;
          vec3 tx = position + vec3(eps, 0.0, 0.0);
          vec3 ty = position + vec3(0.0, eps, 0.0);
          float nx = (snoise(tx * uNoiseDensity + vec3(t * 0.35)) + snoise(tx * 2.1 * uNoiseDensity) * 0.5) * uNoiseStrength;
          float ny = (snoise(ty * uNoiseDensity + vec3(t * 0.35)) + snoise(ty * 2.1 * uNoiseDensity) * 0.5) * uNoiseStrength;
          vec3 displacedTx = tx + normal * nx;
          vec3 displacedTy = ty + normal * ny;
          
          vec3 tangentX = displacedTx - displaced;
          vec3 tangentY = displacedTy - displaced;
          vec3 computedNormal = normalize(cross(tangentX, tangentY));

          vNormal = normalize(normalMatrix * computedNormal);
          vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
          vWorldPosition = worldPos.xyz;
          vec4 mvPosition = viewMatrix * worldPos;
          vViewPosition = -mvPosition.xyz;
          vNoise = noise;

          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const fragmentShader = `
        uniform float uTime;
        uniform vec3 uColorAmber;
        uniform vec3 uColorFrost;
        uniform vec3 uColorCream;
        uniform vec3 uColorAsh;

        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        varying float vNoise;

        void main() {
          vec3 V = normalize(vViewPosition);
          vec3 N = normalize(vNormal);

          float NdotV = max(dot(N, V), 0.0);
          float fresnel = pow(1.0 - NdotV, 3.0);
          float deepFresnel = pow(1.0 - NdotV, 1.8);

          // Frozen Mist Lighting Model
          // 1. Burnished Amber Rim (#DD700B) on upper crest
          vec3 dirAmber = normalize(vec3(-0.85, 0.8, 0.35));
          float rimAmber = pow(max(dot(N, dirAmber), 0.0), 2.2) * deepFresnel;
          vec3 amberGlow = uColorAmber * rimAmber * 2.9;

          // 2. Pale Frost Mist Rim (#D9DADF) on lower-right
          vec3 dirFrost = normalize(vec3(0.9, -0.75, 0.4));
          float rimFrost = pow(max(dot(N, dirFrost), 0.0), 1.9) * deepFresnel;
          vec3 frostGlow = uColorFrost * rimFrost * 2.4;

          // 3. Warm Cream Alabaster Sheen (#FCF8D8) on high angle
          vec3 dirCream = normalize(vec3(0.5, 0.85, -0.3));
          float rimCream = pow(max(dot(N, dirCream), 0.0), 2.6) * deepFresnel;
          vec3 creamGlow = uColorCream * rimCream * 2.1;

          // 4. Frosted Ash edge (#ADACA7)
          vec3 dirAsh = normalize(vec3(-0.3, -0.9, 0.6));
          float rimAsh = pow(max(dot(N, dirAsh), 0.0), 3.2) * fresnel;
          vec3 ashGlow = uColorAsh * rimAsh * 1.6;

          // Specular highlights
          vec3 H1 = normalize(dirAmber + V);
          float spec1 = pow(max(dot(N, H1), 0.0), 64.0);

          vec3 H2 = normalize(dirFrost + V);
          float spec2 = pow(max(dot(N, H2), 0.0), 40.0);

          // Base mineral graphite liquid body
          vec3 baseSlate = vec3(0.02, 0.022, 0.024);
          
          // Internal translucent frosted core
          float internalScatter = (1.0 - NdotV) * 0.12;
          vec3 scatterColor = mix(uColorCream, uColorFrost, 0.5) * internalScatter;

          // Composite
          vec3 finalColor = baseSlate 
                          + scatterColor 
                          + amberGlow 
                          + frostGlow 
                          + creamGlow 
                          + ashGlow 
                          + (spec1 * vec3(1.0, 0.95, 0.8) * 1.8)
                          + (spec2 * vec3(0.85, 0.9, 1.0) * 1.3);

          float alpha = clamp(0.72 + fresnel * 0.28, 0.0, 1.0);
          gl_FragColor = vec4(finalColor, alpha);
        }
      `;

      // Geometry: High resolution Icosahedron for smooth fluid tessellation
      const geometryMain = new THREE.IcosahedronGeometry(2.35, 64);
      const uniformsMain = {
        uTime: { value: 0 },
        uSpeed: { value: 0.38 },
        uNoiseDensity: { value: 0.75 },
        uNoiseStrength: { value: 0.45 * intensity },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorAmber: { value: new THREE.Color('#DD700B') }, // Frozen Mist - Burnished Amber
        uColorFrost: { value: new THREE.Color('#D9DADF') }, // Frozen Mist - Pale Frost
        uColorCream: { value: new THREE.Color('#FCF8D8') }, // Frozen Mist - Warm Cream
        uColorAsh: { value: new THREE.Color('#ADACA7') },   // Frozen Mist - Frosted Ash
      };

      const materialMain = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: uniformsMain,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: true,
      });

      const meshMain = new THREE.Mesh(geometryMain, materialMain);
      meshMain.position.set(0.65, 0.15, 0.0);
      scene.add(meshMain);

      // --- Satellite Droplet ---
      const geometrySatellite = new THREE.IcosahedronGeometry(1.2, 48);
      const uniformsSat = {
        uTime: { value: 1.5 },
        uSpeed: { value: 0.45 },
        uNoiseDensity: { value: 0.95 },
        uNoiseStrength: { value: 0.35 * intensity },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorAmber: { value: new THREE.Color('#DD700B') },
        uColorFrost: { value: new THREE.Color('#D9DADF') },
        uColorCream: { value: new THREE.Color('#FCF8D8') },
        uColorAsh: { value: new THREE.Color('#7C7D75') },
      };

      const materialSat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: uniformsSat,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: true,
      });

      const meshSat = new THREE.Mesh(geometrySatellite, materialSat);
      meshSat.position.set(-2.8, -1.2, -0.6);
      scene.add(meshSat);

      // --- Subtle Ambient floating frost particles ---
      const particlesCount = 70;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 14;
        posArray[i + 1] = (Math.random() - 0.5) * 10;
        posArray[i + 2] = (Math.random() - 0.5) * 8;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.04,
        color: new THREE.Color('#D9DADF'),
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // --- Pointer Tracking & Smooth Parallax ---
      const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

      const handlePointerMove = (e: MouseEvent) => {
        if (!interactive) return;
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouse.targetX = x;
        mouse.targetY = y;
      };

      window.addEventListener('mousemove', handlePointerMove, { passive: true });

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };

      window.addEventListener('resize', handleResize);

      // --- Animation Loop ---
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        mouse.x += (mouse.targetX - mouse.x) * 0.04;
        mouse.y += (mouse.targetY - mouse.y) * 0.04;

        uniformsMain.uTime.value = elapsedTime;
        uniformsMain.uMouse.value.set(mouse.x, mouse.y);

        uniformsSat.uTime.value = elapsedTime + 2.0;
        uniformsSat.uMouse.value.set(mouse.x, mouse.y);

        meshMain.rotation.x = Math.sin(elapsedTime * 0.15) * 0.2 + mouse.y * 0.3;
        meshMain.rotation.y = elapsedTime * 0.12 + mouse.x * 0.35;
        meshMain.position.y = 0.15 + Math.sin(elapsedTime * 0.4) * 0.18;

        meshSat.rotation.x = elapsedTime * 0.18;
        meshSat.rotation.y = -elapsedTime * 0.15;
        meshSat.position.x = -2.8 + Math.cos(elapsedTime * 0.3) * 0.4 + mouse.x * 0.25;
        meshSat.position.y = -1.2 + Math.sin(elapsedTime * 0.35) * 0.3 + mouse.y * 0.2;

        particles.rotation.y = elapsedTime * 0.015;

        if (camera) {
          camera.position.x = mouse.x * 0.45;
          camera.position.y = mouse.y * 0.35;
          camera.lookAt(0, 0, 0);
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
        geometryMain.dispose();
        materialMain.dispose();
        geometrySatellite.dispose();
        materialSat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to CSS glow sculpture:', err);
      setHasWebGL(false);
    }
  }, [intensity, interactive]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {!hasWebGL && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#DD700B]/20 via-[#D9DADF]/20 to-[#FCF8D8]/20 blur-3xl animate-pulse" />
            <div className="absolute inset-4 rounded-full border border-[#DD700B]/30 bg-[#0e0f11]/80 backdrop-blur-2xl shadow-[0_0_80px_rgba(221,112,11,0.25)] flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-[#D9DADF]/30 bg-gradient-to-br from-[#7C7D75]/40 via-[#0e0f11] to-[#DD700B]/30 blur-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
