import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Main component
 *
 * @returns
 */
export default function App() {
	const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
	const cameraRef = useRef<THREE.PerspectiveCamera>(
		new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		)
	);
	const rendererRef = useRef<THREE.WebGLRenderer>(new THREE.WebGLRenderer());
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const scene = sceneRef.current;
		const camera = cameraRef.current;
		const renderer = rendererRef.current;
		const canvas = canvasRef.current;

		if (!canvas) return;

		renderer.setSize(window.innerWidth, window.innerHeight);
		canvas.appendChild(renderer.domElement); // Append to the canvas ref

		// Example: Add a simple cube
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		camera.position.z = 5;

		// Animation loop
		const animate = () => {
			requestAnimationFrame(animate);
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
			renderer.render(scene, camera);
		};

		animate();

		// Handle resizing
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener("resize", handleResize);

		// Cleanup on unmount
		return () => {
			window.removeEventListener("resize", handleResize);
			// Optional: Clean up resources like geometries and materials
			geometry.dispose();
			material.dispose();
			renderer.dispose();
			if (canvas && renderer.domElement.parentNode === canvas) {
				canvas.removeChild(renderer.domElement);
			}
		};
	}, []); // Empty dependency array ensures this runs only once after the initial render

	return <div ref={canvasRef} />;
}
