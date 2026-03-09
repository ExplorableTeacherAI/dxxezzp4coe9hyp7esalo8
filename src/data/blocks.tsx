import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH1,
    EditableH2,
    EditableParagraph,
    InlineTooltip,
    NodeLinkDiagram,
    InlineScrubbleNumber,
    InlineToggle,
    InlineClozeInput,
    InlineFeedback,
    InlineLinkedHighlight,
} from "@/components/atoms";
import { useVar } from "@/stores";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors } from "@/stores";
import {
    getDefaultValues,
    variableDefinitions,
    getVariableInfo,
    numberPropsFromDefinition,
    clozePropsFromDefinition,
} from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// ============================================================================
// CUSTOM VISUALIZATION COMPONENTS
// ============================================================================

/**
 * Interactive Grid-to-Graph Visualization
 * Shows a grid and its equivalent graph representation side by side
 */
const GridGraphVisualization = () => {
    const gridSize = useVar("gridSize", 4) as number;
    const movementType = useVar("movementType", "4-way") as string;

    // Generate grid nodes
    const nodes = [];
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            nodes.push({
                id: `${x},${y}`,
                label: `${x},${y}`,
                group: "cell",
                fx: 50 + x * 80,
                fy: 50 + y * 80,
            });
        }
    }

    // Generate edges based on movement type
    const links: { source: string; target: string; directed: boolean }[] = [];
    const dirs4 = [
        [1, 0],
        [0, 1],
    ]; // Only right and down to avoid duplicates
    const dirs8 = [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1],
    ];
    const dirs = movementType === "8-way" ? dirs8 : dirs4;

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            for (const [dx, dy] of dirs) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
                    links.push({
                        source: `${x},${y}`,
                        target: `${nx},${ny}`,
                        directed: false,
                    });
                }
            }
        }
    }

    const width = Math.max(350, gridSize * 80 + 100);
    const height = Math.max(350, gridSize * 80 + 100);

    return (
        <NodeLinkDiagram
            nodes={nodes}
            links={links}
            width={width}
            height={height}
            draggable={false}
            showLinkLabels={false}
            chargeStrength={0}
            linkDistance={80}
            groupColors={{ cell: "#6366F1" }}
            defaultLinkColor="#94a3b8"
            minNodeRadius={18}
            maxNodeRadius={22}
        />
    );
};

/**
 * Simple Graph Example for Section 2
 * Shows the classic A-G graph from the article
 * Nodes have highlightId for linked highlighting with text
 */
const SimpleGraphExample = () => {
    const nodes = [
        { id: "A", label: "A", group: "a", highlightId: "nodeA" },
        { id: "B", label: "B", group: "b", highlightId: "nodeB" },
        { id: "C", label: "C", group: "c", highlightId: "nodeC" },
        { id: "D", label: "D", group: "d", highlightId: "nodeD" },
        { id: "E", label: "E", group: "e", highlightId: "nodeE" },
        { id: "F", label: "F", group: "f", highlightId: "nodeF" },
        { id: "G", label: "G", group: "g", highlightId: "nodeG" },
    ];

    const links = [
        { source: "A", target: "B", directed: true, highlightId: "edgeAB" },
        { source: "A", target: "D", directed: true, highlightId: "edgeAD" },
        { source: "A", target: "G", directed: true, highlightId: "edgeAG" },
        { source: "B", target: "A", directed: true, highlightId: "edgeBA" },
        { source: "B", target: "C", directed: true, highlightId: "edgeBC" },
        { source: "B", target: "F", directed: true, highlightId: "edgeBF" },
        { source: "C", target: "B", directed: true, highlightId: "edgeCB" },
        { source: "C", target: "D", directed: true, highlightId: "edgeCD" },
        { source: "C", target: "E", directed: true, highlightId: "edgeCE" },
        { source: "D", target: "C", directed: true, highlightId: "edgeDC" },
        { source: "D", target: "A", directed: true, highlightId: "edgeDA" },
        { source: "E", target: "C", directed: true, highlightId: "edgeEC" },
        { source: "E", target: "F", directed: true, highlightId: "edgeEF" },
        { source: "F", target: "B", directed: true, highlightId: "edgeFB" },
        { source: "F", target: "E", directed: true, highlightId: "edgeFE" },
        { source: "G", target: "A", directed: true, highlightId: "edgeGA" },
    ];

    return (
        <NodeLinkDiagram
            nodes={nodes}
            links={links}
            height={350}
            draggable={true}
            showLinkLabels={false}
            chargeStrength={-400}
            linkDistance={100}
            highlightVarName="graphHighlight"
        />
    );
};

/**
 * Same Graph, Different Layout
 * Shows that the same graph can look completely different
 */
const SameGraphDifferentLayout = () => {
    const nodes = [
        { id: "A", label: "A", group: "a", fx: 200, fy: 50 },
        { id: "B", label: "B", group: "b", fx: 350, fy: 100 },
        { id: "C", label: "C", group: "c", fx: 300, fy: 200 },
        { id: "D", label: "D", group: "d", fx: 100, fy: 200 },
        { id: "E", label: "E", group: "e", fx: 250, fy: 300 },
        { id: "F", label: "F", group: "f", fx: 400, fy: 250 },
        { id: "G", label: "G", group: "g", fx: 50, fy: 100 },
    ];

    const links = [
        { source: "A", target: "B", directed: true },
        { source: "A", target: "D", directed: true },
        { source: "A", target: "G", directed: true },
        { source: "B", target: "A", directed: true },
        { source: "B", target: "C", directed: true },
        { source: "B", target: "F", directed: true },
        { source: "C", target: "B", directed: true },
        { source: "C", target: "D", directed: true },
        { source: "C", target: "E", directed: true },
        { source: "D", target: "C", directed: true },
        { source: "D", target: "A", directed: true },
        { source: "E", target: "C", directed: true },
        { source: "E", target: "F", directed: true },
        { source: "F", target: "B", directed: true },
        { source: "F", target: "E", directed: true },
        { source: "G", target: "A", directed: true },
    ];

    return (
        <NodeLinkDiagram
            nodes={nodes}
            links={links}
            height={350}
            draggable={false}
            showLinkLabels={false}
            chargeStrength={0}
            linkDistance={100}
            highlightVarName="graphHighlight"
        />
    );
};

/**
 * Graph Variants Visualization
 * Shows directed vs undirected and weighted edges
 */
const GraphVariantsVisualization = () => {
    const graphType = useVar("graphType", "undirected") as string;
    const showWeights = useVar("showWeights", false) as boolean;

    const nodes = [
        { id: "A", label: "A", group: "a" },
        { id: "B", label: "B", group: "b" },
        { id: "C", label: "C", group: "c" },
        { id: "D", label: "D", group: "d" },
    ];

    const isDirected = graphType === "directed";

    const links = [
        {
            source: "A",
            target: "B",
            directed: isDirected,
            label: showWeights ? "1" : undefined,
            weight: 1,
        },
        {
            source: "B",
            target: "C",
            directed: isDirected,
            label: showWeights ? "4" : undefined,
            weight: 4,
        },
        {
            source: "C",
            target: "D",
            directed: isDirected,
            label: showWeights ? "2" : undefined,
            weight: 2,
        },
        {
            source: "A",
            target: "D",
            directed: isDirected,
            label: showWeights ? "5" : undefined,
            weight: 5,
        },
    ];

    return (
        <NodeLinkDiagram
            nodes={nodes}
            links={links}
            height={300}
            draggable={true}
            showLinkLabels={showWeights}
            chargeStrength={-300}
            linkDistance={120}
            weightedLinks={showWeights}
        />
    );
};

/**
 * Obstacle Strategies Visualization
 * Shows three different ways to handle obstacles
 */
const ObstacleVisualization = () => {
    const strategy = useVar("obstacleStrategy", "remove-nodes") as string;

    // Base 3x3 grid with obstacle at (1,1)
    const allNodes = [
        { id: "0,0", label: "0,0" },
        { id: "1,0", label: "1,0" },
        { id: "2,0", label: "2,0" },
        { id: "0,1", label: "0,1" },
        { id: "1,1", label: "1,1" }, // Obstacle
        { id: "2,1", label: "2,1" },
        { id: "0,2", label: "0,2" },
        { id: "1,2", label: "1,2" },
        { id: "2,2", label: "2,2" },
    ];

    // Filter nodes based on strategy
    const nodes =
        strategy === "remove-nodes"
            ? allNodes
                  .filter((n) => n.id !== "1,1")
                  .map((n) => ({
                      ...n,
                      fx: 80 + parseInt(n.id.split(",")[0]) * 100,
                      fy: 80 + parseInt(n.id.split(",")[1]) * 100,
                      group: "active",
                  }))
            : allNodes.map((n) => ({
                  ...n,
                  fx: 80 + parseInt(n.id.split(",")[0]) * 100,
                  fy: 80 + parseInt(n.id.split(",")[1]) * 100,
                  group: n.id === "1,1" ? "obstacle" : "active",
                  color: n.id === "1,1" ? "#ef4444" : undefined,
              }));

    // Generate edges
    const links: {
        source: string;
        target: string;
        directed: boolean;
        color?: string;
        label?: string;
    }[] = [];
    const dirs = [
        [1, 0],
        [0, 1],
    ];
    const nodeIds = new Set(nodes.map((n) => n.id));

    for (const node of nodes) {
        const [x, y] = node.id.split(",").map(Number);
        for (const [dx, dy] of dirs) {
            const neighborId = `${x + dx},${y + dy}`;
            if (nodeIds.has(neighborId)) {
                // Check if edge involves obstacle
                const involvesObstacle =
                    node.id === "1,1" || neighborId === "1,1";

                if (strategy === "remove-edges" && involvesObstacle) {
                    // Skip edges to/from obstacle
                    continue;
                }

                if (strategy === "infinite-weight" && involvesObstacle) {
                    links.push({
                        source: node.id,
                        target: neighborId,
                        directed: false,
                        color: "#ef4444",
                        label: "∞",
                    });
                } else {
                    links.push({
                        source: node.id,
                        target: neighborId,
                        directed: false,
                    });
                }
            }
        }
    }

    return (
        <NodeLinkDiagram
            nodes={nodes}
            links={links}
            height={380}
            width={380}
            draggable={false}
            showLinkLabels={strategy === "infinite-weight"}
            chargeStrength={0}
            linkDistance={100}
            groupColors={{ active: "#6366F1", obstacle: "#ef4444" }}
        />
    );
};

// ============================================================================
// SECTION 1: INTRODUCTION
// ============================================================================

const introBlocks: ReactElement[] = [
    <StackLayout key="layout-intro-title" maxWidth="xl">
        <Block id="block-intro-title" padding="lg">
            <EditableH1 id="h1-intro-title" blockId="block-intro-title">
                Grids and Graphs
            </EditableH1>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-intro-hook" maxWidth="xl">
        <Block id="block-intro-hook" padding="sm">
            <EditableParagraph id="para-intro-hook" blockId="block-intro-hook">
                Here is a strange fact: pathfinding algorithms like Dijkstra's
                and A* have no idea what a grid looks like. They cannot see
                coordinates, distances, or the shape of your game map. All they
                understand is a far more abstract structure: which locations
                exist, and which locations connect to which. This structure is
                called a{" "}
                <InlineTooltip
                    id="tooltip-graph"
                    tooltip="A mathematical structure consisting of nodes (vertices) connected by edges (links)."
                    color="#6366F1"
                >
                    graph
                </InlineTooltip>
                , and it turns out that every grid is just a special case of
                one.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-intro-insight" maxWidth="xl">
        <Block id="block-intro-insight" padding="sm">
            <EditableParagraph
                id="para-intro-insight"
                blockId="block-intro-insight"
            >
                This article explores the bridge between the grids you see in
                games and the graphs that algorithms actually process. Once you
                understand this connection, you will see why graph-based
                pathfinding works on grids, how to represent obstacles, and how
                the same techniques apply far beyond rectangular maps.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];

// ============================================================================
// SECTION 2: WHAT IS A GRAPH?
// ============================================================================

const graphBasicsBlocks: ReactElement[] = [
    <StackLayout key="layout-graph-title" maxWidth="xl">
        <Block id="block-graph-title" padding="lg">
            <EditableH2 id="h2-graph-title" blockId="block-graph-title">
                What is a Graph?
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-graph-intro" maxWidth="xl">
        <Block id="block-graph-intro" padding="sm">
            <EditableParagraph
                id="para-graph-intro"
                blockId="block-graph-intro"
            >
                A mathematical graph is surprisingly simple. It consists of just
                two things:{" "}
                <InlineTooltip
                    id="tooltip-nodes"
                    tooltip="Also called vertices or objects. These are the 'things' in your graph."
                    color="#6366F1"
                >
                    nodes
                </InlineTooltip>{" "}
                (the locations) and{" "}
                <InlineTooltip
                    id="tooltip-edges"
                    tooltip="Also called links, connections, arrows, or arcs. These connect nodes together."
                    color="#ec4899"
                >
                    edges
                </InlineTooltip>{" "}
                (the connections between them). That is it. No coordinates, no
                distances, no colors. Just: what exists, and what connects to
                what.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-graph-example" ratio="1:1" gap="lg">
        <Block id="block-graph-explanation" padding="sm">
            <EditableParagraph
                id="para-graph-explanation"
                blockId="block-graph-explanation"
            >
                The diagram shows a graph with seven{" "}
                <InlineTooltip
                    id="tooltip-nodes-example"
                    tooltip="The circles in the diagram. Each node represents a location."
                    color="#6366F1"
                >
                    nodes
                </InlineTooltip>{" "}
                labeled{" "}
                <InlineLinkedHighlight
                    varName="graphHighlight"
                    highlightId="nodeA"
                    color="#6366F1"
                >
                    A
                </InlineLinkedHighlight>{" "}
                through{" "}
                <InlineLinkedHighlight
                    varName="graphHighlight"
                    highlightId="nodeG"
                    color="#8B5CF6"
                >
                    G
                </InlineLinkedHighlight>
                . Each arrow represents an edge. Notice that{" "}
                <InlineLinkedHighlight
                    varName="graphHighlight"
                    highlightId="nodeA"
                    color="#6366F1"
                >
                    node A
                </InlineLinkedHighlight>{" "}
                has edges going to{" "}
                <InlineLinkedHighlight
                    varName="graphHighlight"
                    highlightId="edgeAB"
                    color="#EC4899"
                >
                    B
                </InlineLinkedHighlight>
                ,{" "}
                <InlineLinkedHighlight
                    varName="graphHighlight"
                    highlightId="edgeAD"
                    color="#F59E0B"
                >
                    D
                </InlineLinkedHighlight>
                , and{" "}
                <InlineLinkedHighlight
                    varName="graphHighlight"
                    highlightId="edgeAG"
                    color="#8B5CF6"
                >
                    G
                </InlineLinkedHighlight>
                .{" "}
                <InlineLinkedHighlight
                    varName="graphHighlight"
                    highlightId="nodeB"
                    color="#EC4899"
                >
                    Node B
                </InlineLinkedHighlight>{" "}
                has an edge{" "}
                <InlineLinkedHighlight
                    varName="graphHighlight"
                    highlightId="edgeBA"
                    color="#6366F1"
                >
                    back to A
                </InlineLinkedHighlight>
                , and also to{" "}
                <InlineLinkedHighlight
                    varName="graphHighlight"
                    highlightId="edgeBC"
                    color="#14B8A6"
                >
                    C
                </InlineLinkedHighlight>{" "}
                and{" "}
                <InlineLinkedHighlight
                    varName="graphHighlight"
                    highlightId="edgeBF"
                    color="#3B82F6"
                >
                    F
                </InlineLinkedHighlight>
                . Hover over any node or edge reference here, or in the diagram, to see it
                highlighted.
            </EditableParagraph>
        </Block>
        <Block id="block-graph-viz" padding="sm" hasVisualization>
            <SimpleGraphExample />
        </Block>
    </SplitLayout>,

    <StackLayout key="layout-graph-key-insight" maxWidth="xl">
        <Block id="block-graph-key-insight" padding="sm">
            <EditableParagraph
                id="para-graph-key-insight"
                blockId="block-graph-key-insight"
            >
                Here is the crucial insight: the visual layout of a graph is not
                part of the graph itself. The same set of nodes and edges can be
                drawn in completely different arrangements, and a pathfinding
                algorithm would not know the difference. What matters is the
                connectivity, not the geometry.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-same-graph" ratio="1:1" gap="lg">
        <Block id="block-same-graph-left" padding="sm" hasVisualization>
            <SimpleGraphExample />
        </Block>
        <Block id="block-same-graph-right" padding="sm" hasVisualization>
            <SameGraphDifferentLayout />
        </Block>
    </SplitLayout>,

    <StackLayout key="layout-same-graph-text" maxWidth="xl">
        <Block id="block-same-graph-text" padding="sm">
            <EditableParagraph
                id="para-same-graph-text"
                blockId="block-same-graph-text"
            >
                These two diagrams look different, but they represent the exact
                same graph. Node A still connects to B, D, and G. Node E still
                connects to C and F. The structure is identical. A pathfinding
                algorithm processing either representation would find the same
                paths, because it only sees the abstract connections.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-graph-question" maxWidth="xl">
        <Block id="block-graph-question" padding="sm">
            <EditableParagraph
                id="para-graph-question"
                blockId="block-graph-question"
            >
                A graph is defined by exactly{" "}
                <InlineFeedback
                    varName="answer_graph_components"
                    correctValue="2"
                    successMessage="Exactly! Nodes and edges are the only two components of a graph"
                    failureMessage="Think about the two fundamental building blocks we discussed"
                    hint="We mentioned nodes (the locations) and edges (the connections)"
                >
                    <InlineClozeInput
                        varName="answer_graph_components"
                        correctAnswer="2"
                        {...clozePropsFromDefinition(
                            getVariableInfo("answer_graph_components")
                        )}
                    />
                </InlineFeedback>{" "}
                components: the set of nodes and the set of edges.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];

// ============================================================================
// SECTION 3: GRIDS AS GRAPHS
// ============================================================================

const gridsAsGraphsBlocks: ReactElement[] = [
    <StackLayout key="layout-grids-title" maxWidth="xl">
        <Block id="block-grids-title" padding="lg">
            <EditableH2 id="h2-grids-title" blockId="block-grids-title">
                Grids in Graph Form
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-grids-intro" maxWidth="xl">
        <Block id="block-grids-intro" padding="sm">
            <EditableParagraph
                id="para-grids-intro"
                blockId="block-grids-intro"
            >
                Now we see how a grid becomes a graph. Every cell in the grid
                becomes a node. Every valid movement between adjacent cells
                becomes an edge. A{" "}
                <InlineScrubbleNumber
                    varName="gridSize"
                    {...numberPropsFromDefinition(getVariableInfo("gridSize"))}
                />{" "}
                × {" "}
                <InlineScrubbleNumber
                    varName="gridSize"
                    {...numberPropsFromDefinition(getVariableInfo("gridSize"))}
                />{" "}
                grid creates a graph where each interior node connects to its{" "}
                <InlineToggle
                    varName="movementType"
                    options={["4-way", "8-way"]}
                    color="#8b5cf6"
                />{" "}
                neighbors.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-grid-viz" maxWidth="xl">
        <Block id="block-grid-viz" padding="md" hasVisualization>
            <GridGraphVisualization />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-grid-explanation" maxWidth="xl">
        <Block id="block-grid-explanation" padding="sm">
            <EditableParagraph
                id="para-grid-explanation"
                blockId="block-grid-explanation"
            >
                Each node is labeled with its grid coordinates. The edges
                connect each cell to its neighbors. With 4-way movement, each
                interior cell connects to the cells directly above, below, left,
                and right. With 8-way movement, diagonal neighbors are included
                as well. Edge cells and corners have fewer neighbors because
                some directions lead off the grid.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-grid-question1" maxWidth="xl">
        <Block id="block-grid-question1" padding="sm">
            <EditableParagraph
                id="para-grid-question1"
                blockId="block-grid-question1"
            >
                In a grid with 4-way movement, an interior cell has exactly{" "}
                <InlineFeedback
                    varName="answer_grid_neighbors"
                    correctValue="4"
                    successMessage="Correct! Up, down, left, and right give exactly 4 neighbors"
                    failureMessage="Count the cardinal directions: up, down, left, right"
                    hint="Think about the four compass directions"
                >
                    <InlineClozeInput
                        varName="answer_grid_neighbors"
                        correctAnswer="4"
                        {...clozePropsFromDefinition(
                            getVariableInfo("answer_grid_neighbors")
                        )}
                    />
                </InlineFeedback>{" "}
                neighbors.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-grid-question2" maxWidth="xl">
        <Block id="block-grid-question2" padding="sm">
            <EditableParagraph
                id="para-grid-question2"
                blockId="block-grid-question2"
            >
                With 8-way movement allowing diagonals, an interior cell has{" "}
                <InlineFeedback
                    varName="answer_8way_neighbors"
                    correctValue="8"
                    successMessage="Right! 4 cardinal + 4 diagonal directions = 8 neighbors"
                    failureMessage="Add the 4 diagonal neighbors to the 4 cardinal ones"
                    hint="Cardinal (4) plus diagonal (4) directions"
                >
                    <InlineClozeInput
                        varName="answer_8way_neighbors"
                        correctAnswer="8"
                        {...clozePropsFromDefinition(
                            getVariableInfo("answer_8way_neighbors")
                        )}
                    />
                </InlineFeedback>{" "}
                neighbors.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];

// ============================================================================
// SECTION 4: GRAPH VARIANTS
// ============================================================================

const graphVariantsBlocks: ReactElement[] = [
    <StackLayout key="layout-variants-title" maxWidth="xl">
        <Block id="block-variants-title" padding="lg">
            <EditableH2 id="h2-variants-title" blockId="block-variants-title">
                Graph Variants
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-variants-intro" maxWidth="xl">
        <Block id="block-variants-intro" padding="sm">
            <EditableParagraph
                id="para-variants-intro"
                blockId="block-variants-intro"
            >
                Not all graphs are created equal. Graph theory distinguishes
                several important variants based on how edges behave. The choice
                of variant affects what kinds of movement and costs you can
                represent in your game.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-variants-controls" ratio="1:1" gap="lg">
        <Block id="block-variants-text" padding="sm">
            <EditableParagraph
                id="para-variants-text"
                blockId="block-variants-text"
            >
                An{" "}
                <InlineToggle
                    varName="graphType"
                    options={["undirected", "directed"]}
                    color="#f59e0b"
                />{" "}
                graph determines whether edges work in both directions or just
                one. In an undirected graph, if you can go from A to B, you can
                also go from B to A. In a directed graph, one-way doors, jumping
                off ledges, and portals can be one-way edges.
            </EditableParagraph>
        </Block>
        <Block id="block-variants-viz" padding="sm" hasVisualization>
            <GraphVariantsVisualization />
        </Block>
    </SplitLayout>,

    <StackLayout key="layout-weights-explanation" maxWidth="xl">
        <Block id="block-weights-explanation" padding="sm">
            <EditableParagraph
                id="para-weights-explanation"
                blockId="block-weights-explanation"
            >
                A{" "}
                <InlineTooltip
                    id="tooltip-weighted"
                    tooltip="A graph where each edge has a numeric cost or weight associated with it."
                    color="#ef4444"
                >
                    weighted graph
                </InlineTooltip>{" "}
                assigns numeric costs to edges. A paved road might have weight
                1, while a muddy forest path has weight 4. This makes the
                pathfinder favor the road. In games, weights often represent
                movement cost, time, or danger level. Toggle weights above to
                see how edge costs appear.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-multigraph" maxWidth="xl">
        <Block id="block-multigraph" padding="sm">
            <EditableParagraph
                id="para-multigraph"
                blockId="block-multigraph"
            >
                There is also the{" "}
                <InlineTooltip
                    id="tooltip-multigraph"
                    tooltip="A graph that can have multiple edges between the same pair of nodes."
                    color="#22c55e"
                >
                    multigraph
                </InlineTooltip>
                , which allows multiple edges between the same nodes. This is
                useful when you can swim across a river or take a raft, or when
                multiple paths exist between locations with different costs or
                properties.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];

// ============================================================================
// SECTION 5: REPRESENTING OBSTACLES
// ============================================================================

const obstaclesBlocks: ReactElement[] = [
    <StackLayout key="layout-obstacles-title" maxWidth="xl">
        <Block id="block-obstacles-title" padding="lg">
            <EditableH2 id="h2-obstacles-title" blockId="block-obstacles-title">
                Representing Obstacles
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-obstacles-intro" maxWidth="xl">
        <Block id="block-obstacles-intro" padding="sm">
            <EditableParagraph
                id="para-obstacles-intro"
                blockId="block-obstacles-intro"
            >
                How do you tell a graph that certain cells are blocked? There
                are three common strategies, each with different tradeoffs. The
                red cell at position (1,1) represents an obstacle.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-obstacles-viz" ratio="1:1" gap="lg">
        <Block id="block-obstacles-controls" padding="sm">
            <EditableParagraph
                id="para-obstacles-controls"
                blockId="block-obstacles-controls"
            >
                <strong>Strategy:</strong>{" "}
                <InlineToggle
                    varName="obstacleStrategy"
                    options={["remove-nodes", "remove-edges", "infinite-weight"]}
                    color="#ec4899"
                />
            </EditableParagraph>
        </Block>
        <Block id="block-obstacles-diagram" padding="sm" hasVisualization>
            <ObstacleVisualization />
        </Block>
    </SplitLayout>,

    <StackLayout key="layout-strategy1" maxWidth="xl">
        <Block id="block-strategy1" padding="sm">
            <EditableParagraph
                id="para-strategy1"
                blockId="block-strategy1"
            >
                <strong>Remove Nodes:</strong> Simply delete the obstacle from
                the graph entirely. The node at (1,1) no longer exists, and all
                edges that would have connected to it are automatically removed.
                This is the simplest approach when obstacles occupy entire grid
                squares.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-strategy2" maxWidth="xl">
        <Block id="block-strategy2" padding="sm">
            <EditableParagraph
                id="para-strategy2"
                blockId="block-strategy2"
            >
                <strong>Remove Edges:</strong> Keep the obstacle node but remove
                all edges leading to it. This is useful when obstacles can
                occupy borders between squares rather than entire squares, or
                when you want to keep the node for other purposes.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-strategy3" maxWidth="xl">
        <Block id="block-strategy3" padding="sm">
            <EditableParagraph
                id="para-strategy3"
                blockId="block-strategy3"
            >
                <strong>Infinite Weight:</strong> Keep both the node and edges,
                but mark edges leading to obstacles with infinite (∞) weight.
                The pathfinder will never choose these paths because any finite
                alternative is better. This approach makes it easy to toggle
                obstacles on and off without rebuilding the graph.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];

// ============================================================================
// SECTION 6: BEYOND GRIDS
// ============================================================================

const beyondGridsBlocks: ReactElement[] = [
    <StackLayout key="layout-beyond-title" maxWidth="xl">
        <Block id="block-beyond-title" padding="lg">
            <EditableH2 id="h2-beyond-title" blockId="block-beyond-title">
                Beyond Grids
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-beyond-intro" maxWidth="xl">
        <Block id="block-beyond-intro" padding="sm">
            <EditableParagraph
                id="para-beyond-intro"
                blockId="block-beyond-intro"
            >
                The power of graphs extends far beyond rectangular grids. Once
                you can represent any problem as nodes and edges, you unlock a
                vast toolkit of graph algorithms. The same pathfinding code that
                navigates a game map can solve surprisingly different problems.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-beyond-examples" maxWidth="xl">
        <Block id="block-beyond-examples" padding="sm">
            <EditableParagraph
                id="para-beyond-examples"
                blockId="block-beyond-examples"
            >
                Consider: rooms connected by hallways in a dungeon crawler.
                Players connected by friendships in a social game. All possible
                board configurations connected by legal moves in chess. NPC
                states connected by actions in a behavior system. Conversation
                topics connected by transitions in a dialogue tree. Economic
                resources connected by crafting recipes. Each of these is a
                graph, and each can use graph search algorithms.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-beyond-conclusion" maxWidth="xl">
        <Block id="block-beyond-conclusion" padding="sm">
            <EditableParagraph
                id="para-beyond-conclusion"
                blockId="block-beyond-conclusion"
            >
                Grids are easy to visualize and incredibly common in games,
                which is why they appear so often in pathfinding tutorials. But
                they are just one instance of a much more general idea. If you
                can make your data look like a graph, you can reuse a wide
                variety of powerful algorithms that mathematicians and computer
                scientists have been refining for decades.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];

// ============================================================================
// EXPORT ALL BLOCKS
// ============================================================================

export const blocks: ReactElement[] = [
    ...introBlocks,
    ...graphBasicsBlocks,
    ...gridsAsGraphsBlocks,
    ...graphVariantsBlocks,
    ...obstaclesBlocks,
    ...beyondGridsBlocks,
];
