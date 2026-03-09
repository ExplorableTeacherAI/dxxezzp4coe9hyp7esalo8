/**
 * Variables Configuration
 * =======================
 *
 * CENTRAL PLACE TO DEFINE ALL SHARED VARIABLES
 *
 * This file defines all variables that can be shared across sections.
 * AI agents should read this file to understand what variables are available.
 */

import { type VarValue } from '@/stores';

/**
 * Variable definition with metadata
 */
export interface VariableDefinition {
    /** Default value */
    defaultValue: VarValue;
    /** Human-readable label */
    label?: string;
    /** Description for AI agents */
    description?: string;
    /** Variable type hint */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    /** Unit (e.g., 'Hz', '°', 'm/s') - for numbers */
    unit?: string;
    /** Minimum value (for number sliders) */
    min?: number;
    /** Maximum value (for number sliders) */
    max?: number;
    /** Step increment (for number sliders) */
    step?: number;
    /** Display color for InlineScrubbleNumber / InlineSpotColor (e.g. '#D81B60') */
    color?: string;
    /** Options for 'select' type variables */
    options?: string[];
    /** Placeholder text for text inputs */
    placeholder?: string;
    /** Correct answer for cloze input validation */
    correctAnswer?: string;
    /** Whether cloze matching is case sensitive */
    caseSensitive?: boolean;
    /** Background color for inline components */
    bgColor?: string;
    /** Schema hint for object types (for AI agents) */
    schema?: string;
}

/**
 * =====================================================
 * 🎯 GRIDS AND GRAPHS LESSON VARIABLES
 * =====================================================
 */
export const variableDefinitions: Record<string, VariableDefinition> = {
    // ─────────────────────────────────────────
    // SECTION 2: What is a Graph?
    // ─────────────────────────────────────────
    graphHighlight: {
        defaultValue: null,
        type: 'linkedHighlight',
        label: 'Graph Highlight',
        description: 'Highlight ID for graph elements',
        color: '#6366F1',
    },

    // ─────────────────────────────────────────
    // SECTION 3: Grids as Graphs
    // ─────────────────────────────────────────
    gridSize: {
        defaultValue: 4,
        type: 'number',
        label: 'Grid Size',
        description: 'Width/height of the grid',
        min: 2,
        max: 8,
        step: 1,
        color: '#3cc499',
    },
    selectedCell: {
        defaultValue: { x: 1, y: 1 },
        type: 'object',
        label: 'Selected Cell',
        description: 'Currently selected grid cell',
        schema: '{ x: number, y: number }',
    },
    showNeighbors: {
        defaultValue: true,
        type: 'boolean',
        label: 'Show Neighbors',
        description: 'Toggle neighbor highlighting',
    },
    movementType: {
        defaultValue: '4-way',
        type: 'select',
        label: 'Movement Type',
        description: 'Type of grid movement',
        options: ['4-way', '8-way'],
        color: '#8b5cf6',
    },

    // ─────────────────────────────────────────
    // SECTION 4: Graph Variants
    // ─────────────────────────────────────────
    graphType: {
        defaultValue: 'undirected',
        type: 'select',
        label: 'Graph Type',
        description: 'Type of graph edges',
        options: ['undirected', 'directed'],
        color: '#f59e0b',
    },
    showWeights: {
        defaultValue: false,
        type: 'boolean',
        label: 'Show Weights',
        description: 'Toggle edge weight display',
    },
    edgeWeight: {
        defaultValue: 1,
        type: 'number',
        label: 'Edge Weight',
        description: 'Weight/cost of an edge',
        min: 1,
        max: 10,
        step: 1,
        color: '#ef4444',
    },

    // ─────────────────────────────────────────
    // SECTION 5: Representing Obstacles
    // ─────────────────────────────────────────
    obstacleStrategy: {
        defaultValue: 'remove-nodes',
        type: 'select',
        label: 'Obstacle Strategy',
        description: 'How obstacles are represented',
        options: ['remove-nodes', 'remove-edges', 'infinite-weight'],
        color: '#ec4899',
    },

    // ─────────────────────────────────────────
    // ASSESSMENT QUESTIONS
    // ─────────────────────────────────────────
    answer_graph_components: {
        defaultValue: '',
        type: 'text',
        label: 'Graph Components Answer',
        correctAnswer: '2',
        placeholder: '?',
        color: '#3B82F6',
    },
    answer_edges_count: {
        defaultValue: '',
        type: 'text',
        label: 'Edges Count Answer',
        correctAnswer: '4',
        placeholder: '?',
        color: '#3B82F6',
    },
    answer_grid_neighbors: {
        defaultValue: '',
        type: 'text',
        label: 'Grid Neighbors Answer',
        correctAnswer: '4',
        placeholder: '?',
        color: '#3B82F6',
    },
    answer_8way_neighbors: {
        defaultValue: '',
        type: 'text',
        label: '8-way Neighbors Answer',
        correctAnswer: '8',
        placeholder: '?',
        color: '#3B82F6',
    },
    answer_directed_meaning: {
        defaultValue: '',
        type: 'select',
        label: 'Directed Graph Meaning',
        correctAnswer: 'one-way',
        options: ['one-way', 'two-way', 'no-way'],
        color: '#8b5cf6',
    },
    answer_obstacle_strategy: {
        defaultValue: '',
        type: 'select',
        label: 'Obstacle Strategy Answer',
        correctAnswer: 'remove-nodes',
        options: ['remove-nodes', 'remove-edges', 'infinite-weight'],
        color: '#ec4899',
    },
};

/**
 * Get all variable names (for AI agents to discover)
 */
export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

/**
 * Get a variable's default value
 */
export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

/**
 * Get a variable's metadata
 */
export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

/**
 * Get all default values as a record (for initialization)
 */
export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

/**
 * Get number props for InlineScrubbleNumber from a variable definition.
 */
export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

/**
 * Get cloze choice props for InlineClozeChoice from a variable definition.
 */
export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Get toggle props for InlineToggle from a variable definition.
 */
export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

/**
 * Get spot-color props for InlineSpotColor from a variable definition.
 */
export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

/**
 * Get linked-highlight props for InlineLinkedHighlight from a variable definition.
 */
export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Build the `variables` prop for FormulaBlock from variable definitions.
 */
export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
