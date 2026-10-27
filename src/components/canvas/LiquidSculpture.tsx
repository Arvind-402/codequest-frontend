import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LiquidSculptureProps {
  className?: string;
  intensity?: number;
  interactive?: boolean;
}

/**
 * Signature 3D Centerpiece for CodeQuest: "The Algorithmic Monolith"
 * 
 * Architecture:
 * 1. Inner Liquid-Obsidian Kernel (Multi-octave simplex noise morphing with metallic sheen)
 * 2. Outer Translucent Crystalline Ribbon Cage (Refractive glass with cyan/teal chromatic dispersion)
 * 3. Gyroscopic Orbital Precision Rings (Precision algorithmic execution loops with tick markers)
 * 4. Atmospheric Memory Constellation (Deep floating crystalline particles)
 * 5. Smooth mouse interpolation, scroll-depth perspective, 60fps performance optimization
 */
export const LiquidSculpture: React.FC<LiquidSculptureProps> = ({
  className = '',
  intensity = 1.0,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animationFrameId: number;
    let isVisible = true;

    try {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // 1. Scene & Camera Setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0, 8.8);

      // 2. High-Performance WebGL Renderer
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);

      // Parent Anchor Group for smooth mouse and scroll parallax
      const masterGroup = new THREE.Group();
      // Position slightly to the right so it beautifully anchors behind the right side of the headline
      masterGroup.position.set(1.1, 0.15, 0);
      scene.add(masterGroup);

      // -------------------------------------------------------------
      // SHADERS: Inner Liquid Obsidian Kernel
      // -------------------------------------------------------------
      const kernelVertexShader = `
        uniform float uTime;
        uniform float uNoiseStrength;
        uniform vec2 uMouse;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewPosition;
        varying float vDisplacement;

        // Simplex 3D Noise Implementation
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
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vNormal = normalize(normalMatrix * normal);
          
          // Multi-frequency harmonic liquid displacement
          float t = uTime * 0.28;
          vec3 coord = position * 0.65;
          float n1 = snoise(coord + vec3(0.0, t, 0.0));
          float n2 = snoise(coord * 2.1 - vec3(t * 0.8, 0.0, t * 0.5)) * 0.45;
          float n3 = snoise(coord * 4.2 + vec3(t * 0.4, t * 0.6, 0.0)) * 0.18;
          
          float totalDisplacement = (n1 + n2 + n3) * uNoiseStrength;
          vDisplacement = totalDisplacement;

          vec3 newPos = position + normal * totalDisplacement;
          vec4 worldPos = modelMatrix * vec4(newPos, 1.0);
          vWorldPosition = worldPos.xyz;
          
          vec4 mvPosition = viewMatrix * worldPos;
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const kernelFragmentShader = `
        uniform vec3 uColorTealPrimary;
        uniform vec3 uColorTealSecondary;
        uniform vec3 uColorTealDeep;
        uniform vec3 uColorHighlight;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewPosition;
        varying float vDisplacement;

        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vViewPosition);

          // Fresnel equations for metallic rim definition
          float NdotV = max(dot(N, V), 0.0);
          float fresnel = pow(1.0 - NdotV, 3.2);
          float deepFresnel = pow(1.0 - NdotV, 1.8);

          // Dual key & rim lights
          vec3 lightDir1 = normalize(vec3(-1.2, 1.4, 1.0));
          vec3 lightDir2 = normalize(vec3(1.4, -1.0, 0.8));

          // 1. Primary Teal Rim (#367D8A)
          float diff1 = max(dot(N, lightDir1), 0.0);
          vec3 primaryRim = uColorTealPrimary * (fresnel * 2.8 + diff1 * 0.35);

          // 2. Secondary Teal Rim (#285F6B)
          float diff2 = max(dot(N, lightDir2), 0.0);
          vec3 secondaryRim = uColorTealSecondary * (deepFresnel * 1.8 + diff2 * 0.25);

          // 3. Subsurface Deep Teal Glow (#133336)
          float scatter = pow(1.0 - NdotV, 2.0) * 0.6;
          vec3 internalGlow = uColorTealDeep * (scatter + (vDisplacement + 0.3) * 0.4);

          // 4. Specular Highlight Glints (#FFFFFF)
          vec3 H1 = normalize(lightDir1 + V);
          float spec1 = pow(max(dot(N, H1), 0.0), 64.0);
          vec3 specGlaze = uColorHighlight * (spec1 * 2.2);

          // Deep Obsidian Body Tone (#010001)
          vec3 obsidianBody = vec3(0.004, 0.006, 0.008);

          vec3 finalColor = obsidianBody + internalGlow + secondaryRim + primaryRim + specGlaze;
          gl_FragColor = vec4(finalColor, 0.96);
        }
      `;

      // -------------------------------------------------------------
      // SHADERS: Outer Translucent Glass Lattice Ribbon
      // -------------------------------------------------------------
      const glassVertexShader = `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vec4 mvPosition = viewMatrix * worldPos;
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const glassFragmentShader = `
        uniform vec3 uColorTealPrimary;
        uniform vec3 uColorTealSecondary;
        uniform vec3 uColorHighlight;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;

        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vViewPosition);

          float NdotV = max(dot(N, V), 0.0);
          // Strong outer edge luminescence
          float fresnel = pow(1.0 - NdotV, 2.5);
          float rimThin = pow(1.0 - NdotV, 5.0);

          vec3 lightDir = normalize(vec3(-1.0, 1.2, 0.9));
          vec3 H = normalize(lightDir + V);
          float spec = pow(max(dot(N, H), 0.0), 96.0);

          // Translucent glass transmission & chromatic dispersion
          vec3 edgeColor = mix(uColorTealSecondary, uColorTealPrimary, fresnel);
          vec3 specularLight = uColorHighlight * spec * 2.5 + uColorTealPrimary * (rimThin * 3.0);
          
          // Subtle internal refraction tint
          vec3 refractionTint = uColorTealPrimary * 0.08;

          vec3 finalColor = refractionTint + edgeColor * (fresnel * 1.6) + specularLight;
          float alpha = clamp(0.18 + fresnel * 0.65 + spec * 0.3, 0.0, 0.92);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `;

      // -------------------------------------------------------------
      // 1. Create Inner Liquid Obsidian Mesh
      // -------------------------------------------------------------
      const kernelGeo = new THREE.IcosahedronGeometry(1.9, 64);
      const kernelUniforms = {
        uTime: { value: 0 },
        uNoiseStrength: { value: prefersReducedMotion ? 0.08 : 0.42 * intensity },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorTealPrimary: { value: new THREE.Color('#367D8A') },
        uColorTealSecondary: { value: new THREE.Color('#285F6B') },
        uColorTealDeep: { value: new THREE.Color('#133336') },
        uColorHighlight: { value: new THREE.Color('#FFFFFF') },
      };

      const kernelMat = new THREE.ShaderMaterial({
        vertexShader: kernelVertexShader,
        fragmentShader: kernelFragmentShader,
        uniforms: kernelUniforms,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: true,
      });

      const kernelMesh = new THREE.Mesh(kernelGeo, kernelMat);
      masterGroup.add(kernelMesh);

      // -------------------------------------------------------------
      // 2. Create Outer Translucent Glass Crystalline Ribbon Cage
      // -------------------------------------------------------------
      // High-precision TorusKnot represents the intricate, interwoven algorithmic paths
      const glassGeo = new THREE.TorusKnotGeometry(2.35, 0.28, 140, 28, 2, 3);
      const glassUniforms = {
        uTime: { value: 0 },
        uColorTealPrimary: { value: new THREE.Color('#5DA8B6') },
        uColorTealSecondary: { value: new THREE.Color('#285F6B') },
        uColorHighlight: { value: new THREE.Color('#FFFFFF') },
      };

      const glassMat = new THREE.ShaderMaterial({
        vertexShader: glassVertexShader,
        fragmentShader: glassFragmentShader,
        uniforms: glassUniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      masterGroup.add(glassMesh);

      // -------------------------------------------------------------
      // 3. Gyroscopic Orbital Precision Rings (Algorithm Execution Loops)
      // -------------------------------------------------------------
      const ringGroup = new THREE.Group();
      masterGroup.add(ringGroup);

      // Ring 1 (Inner loop)
      const ring1Geo = new THREE.TorusGeometry(3.1, 0.016, 16, 120);
      const ring1Mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#367D8A'),
        transparent: true,
        opacity: 0.55,
      });
      const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1Mesh.rotation.x = Math.PI * 0.38;
      ring1Mesh.rotation.y = Math.PI * 0.12;
      ringGroup.add(ring1Mesh);

      // Ring 2 (Outer loop counter-inclination)
      const ring2Geo = new THREE.TorusGeometry(3.55, 0.014, 16, 140);
      const ring2Mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#285F6B'),
        transparent: true,
        opacity: 0.42,
      });
      const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2Mesh.rotation.x = -Math.PI * 0.28;
      ring2Mesh.rotation.z = Math.PI * 0.22;
      ringGroup.add(ring2Mesh);

      // -------------------------------------------------------------
      // 4. Memory Constellation Lattice (Deep Floating Sparse Particles)
      // -------------------------------------------------------------
      const particleCount = 85;
      const particleGeo = new THREE.BufferGeometry();
      const particlePos = new Float32Array(particleCount * 3);
      const particleScales = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Spherical shell distribution around the central sculpture
        const radius = 2.8 + Math.random() * 5.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        particlePos[i3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePos[i3 + 2] = radius * Math.cos(phi);
        particleScales[i] = Math.random() * 0.035 + 0.015;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
      const particleMat = new THREE.PointsMaterial({
        color: new THREE.Color('#5DA8B6'),
        size: 0.045,
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
      });

      const particlePoints = new THREE.Points(particleGeo, particleMat);
      masterGroup.add(particlePoints);

      // -------------------------------------------------------------
      // Mouse, Scroll & Parallax Interpolation
      // -------------------------------------------------------------
      const mouse = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
      };

      let scrollY = 0;
      let targetScrollY = 0;

      const handlePointerMove = (e: MouseEvent) => {
        if (!interactive) return;
        const rect = container.getBoundingClientRect();
        // Normalized cursor coordinates (-1 to 1)
        mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      };

      const handleScroll = () => {
        targetScrollY = window.scrollY;
      };

      window.addEventListener('mousemove', handlePointerMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });

      // Handle Resize
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };

      window.addEventListener('resize', handleResize);

      // Visibility Observer: Pause WebGL when hero is out of view for 60fps & battery efficiency
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

      const clock = new THREE.Clock();

      // -------------------------------------------------------------
      // Animation Loop
      // -------------------------------------------------------------
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Don't waste GPU cycles when out of viewport or tab is inactive
        if (!isVisible || document.hidden) return;

        // delta removed
        const elapsed = clock.getElapsedTime();

        // Smooth mouse damping (Lerp)
        mouse.x += (mouse.targetX - mouse.x) * 0.045;
        mouse.y += (mouse.targetY - mouse.y) * 0.045;

        // Smooth scroll damping
        scrollY += (targetScrollY - scrollY) * 0.06;

        const timeRate = prefersReducedMotion ? 0.05 : 1.0;

        // 1. Update Shaders
        kernelUniforms.uTime.value = elapsed * timeRate;
        kernelUniforms.uMouse.value.set(mouse.x, mouse.y);
        glassUniforms.uTime.value = elapsed * timeRate;

        // 2. Sculptural Kinematics: Organic multi-speed harmonic rotation
        kernelMesh.rotation.x = elapsed * 0.08 * timeRate + mouse.y * 0.25;
        kernelMesh.rotation.y = elapsed * 0.12 * timeRate + mouse.x * 0.35;
        kernelMesh.position.y = Math.sin(elapsed * 0.42 * timeRate) * 0.14;

        // Glass ribbon orbits on counter-axis with refractive depth
        glassMesh.rotation.x = -elapsed * 0.09 * timeRate + mouse.y * 0.38;
        glassMesh.rotation.y = elapsed * 0.14 * timeRate + mouse.x * 0.45;
        glassMesh.rotation.z = Math.sin(elapsed * 0.25 * timeRate) * 0.2;

        // 3. Orbital Precision Rings
        ring1Mesh.rotation.z = elapsed * 0.18 * timeRate;
        ring2Mesh.rotation.y = -elapsed * 0.14 * timeRate;

        // 4. Memory constellation drift
        particlePoints.rotation.y = elapsed * 0.02 * timeRate + mouse.x * 0.08;
        particlePoints.rotation.x = mouse.y * 0.06;

        // 5. Scroll depth interaction: gently tilts and tracks downwards on scroll
        const scrollFactor = Math.min(scrollY / 800, 1.2);
        masterGroup.position.y = 0.15 - scrollFactor * 0.85;
        masterGroup.rotation.x = mouse.y * 0.15 + scrollFactor * 0.22;
        masterGroup.rotation.y = mouse.x * 0.25;

        // Camera micro-sway
        if (camera && renderer && scene) {
          camera.position.x = mouse.x * 0.35;
        camera.position.y = mouse.y * 0.25;
        camera.lookAt(masterGroup.position.x * 0.3, masterGroup.position.y * 0.3, 0);

        renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
        cancelAnimationFrame(animationFrameId);

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }

        kernelGeo.dispose();
        kernelMat.dispose();
        glassGeo.dispose();
        glassMat.dispose();
        ring1Geo.dispose();
        ring1Mat.dispose();
        ring2Geo.dispose();
        ring2Mat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to CSS luxury glow sculpture:', err);
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
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#133336]/40 via-[#285F6B]/30 to-[#367D8A]/20 blur-3xl animate-pulse" />
            <div className="absolute inset-4 rounded-full border border-[#367D8A]/30 bg-[#010001]/90 backdrop-blur-2xl shadow-[0_0_80px_rgba(54,125,138,0.25)] flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-[#285F6B]/30 bg-gradient-to-br from-[#133336] via-[#010001] to-[#367D8A]/30 blur-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
