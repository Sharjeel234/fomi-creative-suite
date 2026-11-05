
import { useMemo } from "react";

import {
    getConnectionPath,
    getNodeConnections,
} from "@/lib/canvas-utils";

// --------------------------------------------------
// Branch Connections
// --------------------------------------------------

const BranchConnections = ({ nodes, selectedNodeId }) => {
    // Create an efficient lookup for node IDs.
    const nodeMap = useMemo(() => {
        return new Map(
            nodes.map((node) => [node.id, node])
        );
    }, [nodes]);

    // Derive connections only when nodes change.
    const connections = useMemo(() => {
        return getNodeConnections(nodes);
    }, [nodes]);

    return (
        <svg
            className="pointer-events-none absolute inset-0 overflow-visible"
            width="100%"
            height="100%"
            aria-hidden="true"
            focusable="false"
        >
            {connections.map((connection) => {
                const source = nodeMap.get(connection.sourceId);
                const target = nodeMap.get(connection.targetId);

                if (!source || !target) {
                    return null;
                }

                const isActive =
                    connection.sourceId === selectedNodeId ||
                    connection.targetId === selectedNodeId;

                return (
                    <path
                        key={connection.id}
                        d={getConnectionPath(source, target)}
                        fill="none"
                        stroke={
                            isActive
                                ? "var(--canvas-accent)"
                                : "var(--canvas-border-strong)"
                        }
                        strokeWidth={isActive ? 2.5 : 1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                    />
                );
            })}
        </svg>
    );
};

export default BranchConnections;