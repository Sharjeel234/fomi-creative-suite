
"use client";

import {
    useCallback,
    useMemo,
    useState,
} from "react";

import {
    canCompareNodes,
    getComparisonNodes,
    normalizeComparisonIds,
    toggleComparisonNode,
} from "@/lib/comparison-utils";

export function useComparison(nodes) {
    const [comparisonIds, setComparisonIds] =
        useState([]);

    const [isOpenRequested, setIsOpenRequested] =
        useState(false);

    // Derive valid IDs without an effect.
    const validComparisonIds = useMemo(
        () =>
            normalizeComparisonIds(
                nodes,
                comparisonIds
            ),
        [nodes, comparisonIds]
    );

    const comparisonNodes = useMemo(
        () =>
            getComparisonNodes(
                nodes,
                validComparisonIds
            ),
        [nodes, validComparisonIds]
    );

    const isReady = useMemo(
        () =>
            canCompareNodes(
                nodes,
                validComparisonIds
            ),
        [nodes, validComparisonIds]
    );

    // Invalid comparisons cannot be displayed.
    const isComparisonOpen =
        isOpenRequested && isReady;

    const toggleNode = useCallback(
        function toggleNode(nodeId) {
            setComparisonIds((currentIds) =>
                toggleComparisonNode(
                    nodes,
                    currentIds,
                    nodeId
                )
            );

            // Close the modal whenever
            // the comparison selection changes.
            setIsOpenRequested(false);
        },
        [nodes]
    );

    const setComparisonPair = useCallback(
        function setComparisonPair(
            firstId,
            secondId
        ) {
            const nextIds =
                normalizeComparisonIds(
                    nodes,
                    [firstId, secondId]
                );

            if (
                !canCompareNodes(
                    nodes,
                    nextIds
                )
            ) {
                return false;
            }

            setComparisonIds(nextIds);
            setIsOpenRequested(false);

            return true;
        },
        [nodes]
    );

    const isNodeSelected = useCallback(
        function isNodeSelected(nodeId) {
            return validComparisonIds.includes(
                nodeId
            );
        },
        [validComparisonIds]
    );

    const clearComparison = useCallback(
        function clearComparison() {
            setComparisonIds([]);
            setIsOpenRequested(false);
        },
        []
    );

    const openComparison = useCallback(
        function openComparison() {
            if (isReady) {
                setIsOpenRequested(true);
            }
        },
        [isReady]
    );

    const closeComparison = useCallback(
        function closeComparison() {
            setIsOpenRequested(false);
        },
        []
    );

    return {
        comparisonIds: validComparisonIds,
        comparisonNodes,
        isReady,
        isComparisonOpen,
        toggleNode,
        setComparisonPair,
        isNodeSelected,
        clearComparison,
        openComparison,
        closeComparison,
    };
}
