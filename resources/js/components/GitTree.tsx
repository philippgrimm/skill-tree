"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Types for our graph structure
interface GraphNode {
  id: string
  type: "main" | "feature" | "hotfix" | "release" // Different node types for styling
  x: number // Horizontal position (0-100)
  y: number // Vertical position (0-100)
  connections: Connection[] // Connections to other nodes
  active: boolean
  size?: number // Optional custom size
}

interface Connection {
  target: string // Target node ID
  type: "straight" | "branch" | "merge" // Connection type
}

export default function StylizedGitGraph() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [activeConnections, setActiveConnections] = useState<{ [key: string]: boolean }>({})
  const [isComplete, setIsComplete] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate graph data with 90-degree angles and left-to-right structure
  useEffect(() => {
    // Create a structured graph with main line on left and branches to right
    const graphNodes: GraphNode[] = [
      // Main branch (vertical line on the left)
      { id: "1", type: "main", x: 10, y: 5, connections: [{ target: "2", type: "straight" }], active: false },
      { id: "2", type: "main", x: 10, y: 15, connections: [{ target: "3", type: "straight" }], active: false },
      {
        id: "3",
        type: "main",
        x: 10,
        y: 25,
        connections: [
          { target: "4", type: "straight" },
          { target: "5", type: "branch" },
        ],
        active: false,
        size: 8,
      },
      { id: "4", type: "main", x: 10, y: 35, connections: [{ target: "8", type: "straight" }], active: false },

      // Feature branch 1 (extends right only)
      { id: "5", type: "feature", x: 30, y: 25, connections: [{ target: "6", type: "straight" }], active: false },
      { id: "6", type: "feature", x: 50, y: 25, connections: [{ target: "7", type: "straight" }], active: false },
      { id: "7", type: "feature", x: 70, y: 25, connections: [], active: false, size: 7 },

      // Main branch continued
      {
        id: "8",
        type: "main",
        x: 10,
        y: 45,
        connections: [
          { target: "9", type: "straight" },
          { target: "12", type: "branch" },
        ],
        active: false,
        size: 8,
      },
      { id: "9", type: "main", x: 10, y: 55, connections: [{ target: "10", type: "straight" }], active: false },
      { id: "10", type: "main", x: 10, y: 65, connections: [{ target: "11", type: "straight" }], active: false },
      {
        id: "11",
        type: "main",
        x: 10,
        y: 75,
        connections: [{ target: "16", type: "straight" }],
        active: false,
        size: 8,
      },

      // Hotfix branch (extends right only)
      { id: "12", type: "hotfix", x: 30, y: 45, connections: [{ target: "13", type: "straight" }], active: false },
      { id: "13", type: "hotfix", x: 50, y: 45, connections: [{ target: "14", type: "straight" }], active: false },
      { id: "14", type: "hotfix", x: 70, y: 45, connections: [{ target: "15", type: "straight" }], active: false },
      { id: "15", type: "hotfix", x: 90, y: 45, connections: [], active: false, size: 7 },

      // Main branch continued
      { id: "16", type: "main", x: 10, y: 85, connections: [{ target: "17", type: "branch" }], active: false },

      // Release branch (extends right only)
      { id: "17", type: "release", x: 30, y: 85, connections: [{ target: "18", type: "straight" }], active: false },
      { id: "18", type: "release", x: 50, y: 85, connections: [{ target: "19", type: "straight" }], active: false },
      { id: "19", type: "release", x: 70, y: 85, connections: [{ target: "20", type: "straight" }], active: false },
      { id: "20", type: "release", x: 90, y: 85, connections: [], active: false, size: 8 },
    ]

    setNodes(graphNodes)

    // Initialize connections map
    const connections: { [key: string]: boolean } = {}
    graphNodes.forEach((node) => {
      node.connections.forEach((conn) => {
        connections[`${node.id}-${conn.target}`] = false
      })
    })
    setActiveConnections(connections)

    return () => {
      // Cleanup if needed
    }
  }, [])

  // Animate the graph building up
  useEffect(() => {
    if (nodes.length === 0) return

    const animateGraph = async () => {
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

      // Activate nodes one by one
      for (let i = 0; i < nodes.length; i++) {
        await delay(400)

        // Activate the current node
        setNodes((prev) => prev.map((node, index) => (index === i ? { ...node, active: true } : node)))

        // Activate connections from this node
        const currentNode = nodes[i]
        for (const connection of currentNode.connections) {
          await delay(300)
          setActiveConnections((prev) => ({
            ...prev,
            [`${currentNode.id}-${connection.target}`]: true,
          }))
        }
      }

      setIsComplete(true)
    }

    animateGraph()
  }, [nodes])

  // Reset and restart animation when complete
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        // Reset all nodes and connections
        setNodes((prev) => prev.map((node) => ({ ...node, active: false })))

        const resetConnections: { [key: string]: boolean } = {}
        Object.keys(activeConnections).forEach((key) => {
          resetConnections[key] = false
        })
        setActiveConnections(resetConnections)

        setIsComplete(false)

        // Restart animation after a delay
        setTimeout(() => {
          const animateGraph = async () => {
            const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

            // Activate nodes one by one
            for (let i = 0; i < nodes.length; i++) {
              await delay(400)

              // Activate the current node
              setNodes((prev) => prev.map((node, index) => (index === i ? { ...node, active: true } : node)))

              // Activate connections from this node
              const currentNode = nodes[i]
              for (const connection of currentNode.connections) {
                await delay(300)
                setActiveConnections((prev) => ({
                  ...prev,
                  [`${currentNode.id}-${connection.target}`]: true,
                }))
              }
            }

            setIsComplete(true)
          }

          animateGraph()
        }, 1000)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isComplete, nodes, activeConnections])

  // Get color based on node type
  const getNodeColor = (type: string, active: boolean) => {
    if (!active) return "bg-transparent"

    switch (type) {
      case "main":
        return "bg-blue-500"
      case "feature":
        return "bg-emerald-500"
      case "hotfix":
        return "bg-amber-500"
      case "release":
        return "bg-violet-500"
      default:
        return "bg-blue-500"
    }
  }

  // Get shadow glow based on node type
  const getNodeGlow = (type: string, active: boolean) => {
    if (!active) return ""

    switch (type) {
      case "main":
        return "shadow-[0_0_15px_rgba(59,130,246,0.7)]"
      case "feature":
        return "shadow-[0_0_15px_rgba(16,185,129,0.7)]"
      case "hotfix":
        return "shadow-[0_0_15px_rgba(245,158,11,0.7)]"
      case "release":
        return "shadow-[0_0_15px_rgba(139,92,246,0.7)]"
      default:
        return "shadow-[0_0_15px_rgba(59,130,246,0.7)]"
    }
  }

  // Get line color based on node type
  const getLineColor = (type: string, active: boolean) => {
    if (!active) return "stroke-transparent"

    switch (type) {
      case "main":
        return "stroke-blue-500"
      case "feature":
        return "stroke-emerald-500"
      case "hotfix":
        return "stroke-amber-500"
      case "release":
        return "stroke-violet-500"
      default:
        return "stroke-blue-500"
    }
  }

  // Get line style based on connection type
  const getLineStyle = (type: string) => {
    switch (type) {
      case "branch":
      case "merge":
        return "2 2"
      default:
        return ""
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div ref={containerRef} className="relative aspect-video w-full bg-slate-900 rounded-xl overflow-hidden p-4">
        {/* Subtle grid background for depth */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-5 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border border-white/20" />
          ))}
        </div>

        {/* Create a positioned container for SVG and nodes to share the same coordinate system */}
        <div className="absolute inset-0">
          {/* Render connections with 90-degree angles */}
          <svg className="absolute inset-0 w-full h-full">
            {nodes.map((node) =>
              node.connections.map((connection) => {
                const targetNode = nodes.find((n) => n.id === connection.target)
                if (!targetNode) return null

                const connectionKey = `${node.id}-${connection.target}`
                const isActive = activeConnections[connectionKey]

                // Determine if we need to create a 90-degree angle
                const needsAngle = node.x !== targetNode.x && node.y !== targetNode.y

                if (needsAngle) {
                  // For 90-degree connections, we'll create two lines
                  // First determine if this is a branch (horizontal first) or merge (vertical first)
                  const isBranch = connection.type === "branch"

                  // Calculate midpoints for the angle
                  const midX = isBranch ? targetNode.x : node.x
                  const midY = isBranch ? node.y : targetNode.y

                  return (
                    <g key={connectionKey}>
                      {/* First segment */}
                      <motion.line
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${midX}%`}
                        y2={`${midY}%`}
                        className={getLineColor(node.type, isActive)}
                        strokeWidth={2}
                        strokeDasharray={getLineStyle(connection.type)}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: isActive ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />

                      {/* Second segment */}
                      <motion.line
                        x1={`${midX}%`}
                        y1={`${midY}%`}
                        x2={`${targetNode.x}%`}
                        y2={`${targetNode.y}%`}
                        className={getLineColor(node.type, isActive)}
                        strokeWidth={2}
                        strokeDasharray={getLineStyle(connection.type)}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: isActive ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                      />
                    </g>
                  )
                } else {
                  // Straight line (either horizontal or vertical)
                  return (
                    <motion.line
                      key={connectionKey}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${targetNode.x}%`}
                      y2={`${targetNode.y}%`}
                      className={getLineColor(node.type, isActive)}
                      strokeWidth={2}
                      strokeDasharray={getLineStyle(connection.type)}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isActive ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  )
                }
              }),
            )}
          </svg>

          {/* Render nodes with pulse effects */}
          {nodes.map((node) => {
            const nodeSize = node.size || 6
            const pulseSize = nodeSize * 3

            return (
              <div
                key={node.id}
                className="absolute"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  width: 0,
                  height: 0,
                }}
              >
                {/* Pulse effect for active nodes */}
                <AnimatePresence>
                  {node.active && (
                    <motion.div
                      className={`absolute rounded-full ${getNodeColor(node.type, true)} opacity-30`}
                      style={{
                        width: `${pulseSize}px`,
                        height: `${pulseSize}px`,
                        marginLeft: `-${pulseSize / 2}px`,
                        marginTop: `-${pulseSize / 2}px`,
                      }}
                      initial={{ scale: 0.8, opacity: 0.3 }}
                      animate={{
                        scale: [0.8, 1.5, 0.8],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                    />
                  )}
                </AnimatePresence>

                {/* The node itself */}
                <motion.div
                  className={`absolute rounded-full ${getNodeColor(node.type, node.active)} ${getNodeGlow(node.type, node.active)} transition-colors duration-300`}
                  style={{
                    width: `${nodeSize}px`,
                    height: `${nodeSize}px`,
                    marginLeft: `-${nodeSize / 2}px`,
                    marginTop: `-${nodeSize / 2}px`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: node.active ? 1 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    delay: 0.1,
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
